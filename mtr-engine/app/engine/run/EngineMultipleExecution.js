const IndexConfigurationAdapter = require('../../../domain/robot/engines/configuration/IndexConfigurationAdapter');
const ExchangeBalanceResponseAdapter = require('../../../domain/exchange/response/model/ExchangeBalanceResponseAdapter');
const ExchangePricesResponseAdapter = require('../../../domain/exchange/response/model/ExchangePricesResponseAdapter');
const BaseEngineConfigurationAdapter = require('../../../domain/robot/engines/configuration/BaseEngineConfigurationAdapter');
const ActionCollection = require('../../../domain/exchange/action/ActionCollection');
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
     * @type {AbstractExchangeService}
     */
    exchangeService = null;

    /**
     * @param exchangeRepository {ExchangeRepository}
     * @param engineRepository {EngineRepository}
     * @param exchangeErrorLogRepository {ExchangeErrorLogRepository}
     * @param exchangeHistoryLogRepository {ExchangeHistoryLogRepository}
     * @param exchangeService {AbstractExchangeService}
     */
    constructor(
        exchangeRepository,
        engineRepository,
        exchangeErrorLogRepository,
        exchangeHistoryLogRepository,
        exchangeService,
    ) {
        this.exchangeRepository = exchangeRepository;
        this.engineRepository = engineRepository;
        this.exchangeErrorLogRepository = exchangeErrorLogRepository;
        this.exchangeHistoryLogRepository = exchangeHistoryLogRepository;
        this.exchangeService = exchangeService;
    }

    executeByConfiguration() {
        this.getBalanceAndPrices().then(
            exchangeData => this.evaluateInstances(exchangeData.exchangeBalanceResponseAdapter, exchangeData.exchangePricesResponseAdapter),
            error => this.exchangeErrorLogRepository.addLog('1', 'EvaluatingInstances', error)
        ).then(
            actions => this.evaluateActions(actions),
            error => this.exchangeErrorLogRepository.addLog('1', 'evaluateActions', error)
        ).catch((error) => this.exchangeErrorLogRepository.addLog('1', 'generalError', error));
    }

    /**
     * @return {Promise}
     */
    getBalanceAndPrices() {
        return new Promise((ok, ko) => {
            this.exchangeService.balance((errorBalance, exchangeBalance) => {
                if (errorBalance) return ko({error: errorBalance, response: exchangeBalance});

                const exchangeBalanceResponseAdapter = new ExchangeBalanceResponseAdapter(exchangeBalance);

                this.exchangeService.prices([], (errorPrices, exchangePrices) => {
                    if (errorPrices) return ko({error: errorPrices, response: exchangePrices});

                    const exchangePricesResponseAdapter = new ExchangePricesResponseAdapter(exchangePrices);

                    ok({exchangeBalanceResponseAdapter, exchangePricesResponseAdapter});
                });
            });
        });
    }

    /**
     * @param exchangeBalanceResponseAdapter {ExchangeBalanceResponseAdapter}
     * @param exchangePricesResponseAdapter {ExchangePricesResponseAdapter}
     */
    evaluateInstances(exchangeBalanceResponseAdapter, exchangePricesResponseAdapter) {
        const indexConfigurationAdapter = new IndexConfigurationAdapter(this.engineRepository.getIndex())

        return new Promise((ok, ko) => {
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

                let executeAction = {result: true, because: {'Action': 'default'}};

                if (!action) {
                    executeAction = {result: false, because: {'Action': false}};
                } else if (action.action === 'buyMarket') {
                    executeAction = this.checkCanBuy(action, exchangePricesResponseAdapter, exchangeBalanceResponseAdapter);

                    action.message = 'Buying ' + action.getQuantity() + ' ' + action.getMainCoin() + ' for ' +
                        action.getQuantity() * exchangePricesResponseAdapter.getPriceByMarket(action.getMarket()) + ' ' +
                        action.getSecondCoin();
                } else if (action.action === 'sellMarket') {
                    executeAction = this.checkCanSell(action, exchangePricesResponseAdapter, exchangeBalanceResponseAdapter);

                    action.message = 'Selling ' + action.getQuantity() + ' ' + action.getSecondCoin() + ' for ' +
                        action.getQuantity() / exchangePricesResponseAdapter.getPriceByMarket(action.getMarket()) + ' ' +
                        action.getMainCoin();
                }

                if (!executeAction.result && action) ko({
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

            ok(new ActionCollection(actions));
        });
    }

    /**
     * @param actionCollection {ActionCollection}
     */
    evaluateActions(actionCollection) {
        for (let i = 0; i < actionCollection.getActions().length; i++) {
            this.evaluateAction(actionCollection.getActions()[i]).then(
                success => console.log(success),
                error => this.exchangeErrorLogRepository.addLog('1', 'EvaluateActionsError', error)
            ).catch(error => console.log(error));
        }
    }

    /**
     * @param action {IAction}
     */
    evaluateAction(action) {
        return new Promise((ok, ko) => {
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
                        } else if (action.action === 'sellMarket') {
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

                        this.exchangeHistoryLogRepository.addLog(action.getEngineConfiguration().getId(), action, response, {});

                        ok(action.getAction());
                    } else {
                        /**
                         * @todo Here should be some extra handles, big amounts are not instantly fulfilled on a market action
                         */
                        this.exchangeErrorLogRepository.addLog(action.getEngineConfiguration().getId(), 'ERROR_ACTION_NOT_FILLED', {
                            error: error,
                            response: response,
                            engine: action.getEngineConfiguration().getEngine(),
                        });

                        ko('NOT_FILLED');
                    }
                });
            } catch (e) {
                ko(e);
            }
        });
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