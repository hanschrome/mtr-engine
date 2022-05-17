const IndexConfigurationAdapter = require('../../../domain/robot/engines/configuration/IndexConfigurationAdapter');
const ExchangeBalanceResponseAdapter = require('../../../domain/exchange/response/model/ExchangeBalanceResponseAdapter');
const ExchangePricesResponseAdapter = require('../../../domain/exchange/response/model/ExchangePricesResponseAdapter');
const BaseEngineConfigurationAdapter = require('../../../domain/robot/engines/configuration/BaseEngineConfigurationAdapter');
const ActionCollection = require('../../../domain/exchange/action/ActionCollection');
const ExchangeFactory = require('../../../domain/exchange/factory/ExchangeFactory');
const Robot = require('../../../domain/robot/Robot');
const RobotEngineFactory = require('../../../domain/robot/engines/factory/RobotEngineFactory');
const ExchangeActionResponseAdapter = require('../../../domain/exchange/response/model/ExchangeActionResponseAdapter');

class EngineMultipleExecution {

    /**
     * @type {EngineRepository}
     */
    engineRepository = null;

    /**
     * @type {ExchangeRepository}
     */
    exchangeRepository = null;

    /**
     * @type {ExchangeHistoryLogRepository}
     */
    exchangeHistoryLogRepository = null;

    /**
     * @type {ExchangeErrorLogRepository}
     */
    exchangeErrorLogRepository = null;

    /**
     * @type {ExchangeBalanceResponseAdapter}
     */
    exchangeBalanceResponseAdapter = null;

    /**
     *
     * @type {AbstractExchangeService}
     */
    exchangeService = null;

    /**
     * @param exchangeRepository {ExchangeRepository}
     * @param engineRepository {EngineRepository}
     * @param exchangeErrorLogRepository {ExchangeErrorLogRepository}
     * @param exchangeHistoryLogRepository {ExchangeHistoryLogRepository}
     */
    constructor(
        exchangeRepository,
        engineRepository,
        exchangeErrorLogRepository,
        exchangeHistoryLogRepository,
                ) {
        this.exchangeRepository = exchangeRepository;
        this.engineRepository = engineRepository;
        this.exchangeErrorLogRepository = exchangeErrorLogRepository;
        this.exchangeHistoryLogRepository = exchangeHistoryLogRepository;
    }

    executeByConfiguration() {
        this.callBalanceAndPrices(this.evaluateInstances);
    }

    /**
     * @return {IndexConfigurationAdapter}
     */
    getIndexConfigurationAdapter() {
        const indexData = this.engineRepository.getIndex();

        return new IndexConfigurationAdapter(indexData);
    }

    callBalanceAndPrices(callback) {
        const exchangeFactory = new ExchangeFactory();
        const ExchangeService = exchangeFactory.getByKey(this.exchangeRepository.active);
        this.exchangeService = new ExchangeService(this.exchangeRepository.getActive());

        this.exchangeService.balance((errorBalance, exchangeBalance) => {
            if (errorBalance) {
                return this.exchangeErrorLogRepository.addLog('error', 'ERROR_REQUEST_BALANCE', {
                    error: errorBalance,
                    response: exchangeBalance,
                    engine: '',
                });
            }

            this.exchangeBalanceResponseAdapter = new ExchangeBalanceResponseAdapter(exchangeBalance);

            this.exchangeService.prices([], (errorPrices, exchangePrices) => {
                if (errorPrices) {
                    return this.exchangeErrorLogRepository.addLog('error', 'ERROR_REQUEST_PRICES', {
                        error: errorPrices,
                        response: exchangePrices,
                        engine: '',
                    });
                }

                this.exchangePricesResponseAdapter = new ExchangePricesResponseAdapter(exchangePrices);

                callback(
                    this.getIndexConfigurationAdapter(),
                    this.exchangeBalanceResponseAdapter,
                    this.exchangePricesResponseAdapter
                );
            });
        });
    }

    /**
     * @param indexConfigurationAdapter {IndexConfigurationAdapter}
     * @param exchangeBalanceResponseAdapter {ExchangeBalanceResponseAdapter}
     * @param exchangePricesResponseAdapter {ExchangePricesResponseAdapter}
     */
    evaluateInstances(indexConfigurationAdapter,
                      exchangeBalanceResponseAdapter,
                      exchangePricesResponseAdapter
                      ) {
        /** @var {IAction[]} */
        const actions = [];

        for (let i = 0; i < indexConfigurationAdapter.getInstances().length; i++) {
            const instanceId = indexConfigurationAdapter.getInstances()[i].id;
            const instanceEngine = indexConfigurationAdapter.getInstances()[i].engine;
            const instanceActive = indexConfigurationAdapter.getInstances()[i].active;

            if (!instanceActive) continue;

            const baseEngineConfigurationData = this.engineRepository.getById(instanceId);
            baseEngineConfigurationData.data.engine = instanceEngine;

            const baseEngineConfigurationAdapter = new BaseEngineConfigurationAdapter(baseEngineConfigurationData);

            const robotEngineFactory = new RobotEngineFactory();
            const RobotEngine = robotEngineFactory.getByKey(baseEngineConfigurationAdapter.getEngine());
            const robotEngine = new RobotEngine();

            const robot = new Robot(robotEngine, baseEngineConfigurationAdapter, exchangePricesResponseAdapter, exchangeBalanceResponseAdapter);

            /** @var action IAction */
            const action = robot.execute();
            action.engineConfiguration = baseEngineConfigurationAdapter;

            let executeAction = { result: true, because: { 'Action': 'default' } };

            if (!action) {
                executeAction = { result: false, because: { 'Action': false } };
            } else if (action.action === 'buyMarket') {
                executeAction = this.checkCanBuy(action, exchangePricesResponseAdapter, exchangeBalanceResponseAdapter);

                action.message = 'Buying ' + action.getQuantity() + ' ' + action.getMainCoin() + ' for ' +
                    action.getQuantity()*exchangePricesResponseAdapter.getPriceByMarket(action.getMarket()) + ' ' +
                    action.getSecondCoin();
            } else if (action.action === 'sellMarket') {
                executeAction = this.checkCanSell(action, exchangePricesResponseAdapter, exchangeBalanceResponseAdapter);

                action.message = 'Selling ' + action.getQuantity() + ' ' + action.getSecondCoin() + ' for ' +
                    action.getQuantity()/exchangePricesResponseAdapter.getPriceByMarket(action.getMarket()) + ' ' +
                    action.getMainCoin();
            }

            if (!executeAction.result && action) this.exchangeErrorLogRepository.addLog(baseEngineConfigurationAdapter.getId(),
                'ACTION_IMPOSSIBLE', {
                error: action,
                because: executeAction.because,
                response: {
                    exchangePrices: exchangePricesResponseAdapter.data,
                    exchangeBalance: exchangeBalanceResponseAdapter.data,
                    baseEngineConfigurationAdapter,
                },
                engine: baseEngineConfigurationAdapter.getEngine(),
            });

            if (executeAction.result) actions.push(action);
        }

        this.evaluateActions(new ActionCollection(actions));
    }

    /**
     * @param actionCollection {ActionCollection}
     */
    evaluateActions(actionCollection) {
        for (let i = 0; i < actionCollection.getActions().length; i++) {
            this.evaluateAction(actionCollection.getActions()[i]);
        }
    }

    /**
     * @param action {IAction}
     */
    evaluateAction(action) {
        const engineConfigurationAdapter = action.getEngineConfiguration();

        try {
            this.exchangeService.evaluateAction(action, (error, response) => {
                if (error) {
                    return this.exchangeErrorLogRepository.addLog(action.getEngineConfiguration().getId(), 'ERROR_REQUEST_EVALUATE_ACTION', {
                        error: error,
                        response: response,
                        engine: action.getEngineConfiguration().getEngine(),
                    });
                }

                const exchangeActionResponseAdapter = new ExchangeActionResponseAdapter(response);

                if (response.status === 'FILLED') {
                    if (action.action === 'buyMarket') {
                        engineConfigurationAdapter.setCurrentAmountInMarket(
                            engineConfigurationAdapter.getCurrentAmountInMarket() + Number.parseFloat(exchangeActionResponseAdapter.getExecutedQuantity())
                        );
                    } else if(action.action === 'sellMarket') {
                        engineConfigurationAdapter.setCurrentAmountInMarket(
                            engineConfigurationAdapter.getCurrentAmountInMarket() - Number.parseFloat(exchangeActionResponseAdapter.getExecutedQuantity())
                        );
                    }

                    // @todo change currentAmountInMarket for currentAmountInMarket(amount, coin) and map into an object
                    engineConfigurationAdapter.setCurrentAmountInMarket(
                        Math.floor(engineConfigurationAdapter.getCurrentAmountInMarket() * engineConfigurationAdapter.getDecimalsMainCoin())
                        / engineConfigurationAdapter.getDecimalsMainCoin()
                    );

                    this.engineRepository.setObjectById(action.getEngineConfiguration().data, action.getEngineConfiguration().getId());

                    this.exchangeHistoryLogRepository.addLog(action.getEngineConfiguration().getId(), action, response, this.exchangePricesResponseAdapter.data);
                } else {
                    this.exchangeErrorLogRepository.addLog(action.getEngineConfiguration().getId(), 'ERROR_ACTION_NOT_FILLED', {
                        error: error,
                        response: response,
                        engine: action.getEngineConfiguration().getEngine(),
                    })
                }
            });
        } catch (e) {
            // @todo handle error
        }
    }


    /**
     *
     * @param action {IAction}
     * @param exchangePrices {ExchangePricesResponseAdapter}
     * @param exchangeBalance {ExchangeBalanceResponseAdapter}
     * @return {{result: boolean, because: {}}}
     */
    checkCanBuy(action, exchangePrices, exchangeBalance) {
        const priceCoin = exchangePrices.getPriceByMarket(action.getMarket());
        const quantityNeededOfSecondCoinToBuy = priceCoin * action.getQuantity();
        const quantityOwned = exchangeBalance.getAvailableBalanceByCoin(action.getSecondCoin());

        return {
            result: quantityNeededOfSecondCoinToBuy <= quantityOwned,
            because: {
                'Needed': quantityNeededOfSecondCoinToBuy,
                'OfCurrency': action.getSecondCoin(),
                'ButHaving': quantityOwned,
            },
        };
    }

    /**
     *
     * @param action {IAction}
     * @param exchangePrices {ExchangePricesResponseAdapter}
     * @param exchangeBalance {ExchangeBalanceResponseAdapter}
     * @return {{result: boolean, because: {ButHaving: *, OfCurrency: *, Needed: *}}}
     */
    checkCanSell(action, exchangePrices, exchangeBalance) {
        const amount = action.getQuantity();

        return {
            result: amount <= exchangeBalance.getAvailableBalanceByCoin(action.getMainCoin()),
            because: {
                'Needed': amount,
                'OfCurrency': action.getMainCoin(),
                'ButHaving': exchangeBalance.getAvailableBalanceByCoin(action.getMainCoin()),
            },
        };
    }
}

module.exports = EngineMultipleExecution;