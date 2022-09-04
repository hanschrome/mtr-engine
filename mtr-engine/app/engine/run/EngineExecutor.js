let ExchangeFactory = require('../../../domain/exchange/factory/ExchangeFactory');
let Robot = require('../../../domain/robot/Robot');
let RobotEngineFactory = require('../../../domain/robot/engines/factory/RobotEngineFactory');
let ExchangeBalanceResponseAdapter = require('../../../domain/exchange/response/model/ExchangeBalanceResponseAdapter');
let ExchangePricesResponseAdapter = require('../../../domain/exchange/response/model/ExchangePricesResponseAdapter');
let ExchangeActionResponseAdapter = require('../../../domain/exchange/response/model/ExchangeActionResponseAdapter');
const BaseEngineConfigurationAdapter = require('../../../domain/robot/engines/configuration/BaseEngineConfigurationAdapter');

class EngineExecutor {

    /**
     * @type {ExchangeRepository}
     */
    exchangeRepository = null;
    /**
     * @type {EngineRepository}
     */
    engineRepository = null;
    /**
     * @type {ExchangeHistoryLogRepository}
     */
    exchangeHistoryLogRepository = null;
    /**
     *
     * @type {ExchangeErrorLogRepository}
     */
    exchangeErrorLogRepository = null;

    /**
     * @param exchangeRepository ExchangeRepository
     * @param engineRepository EngineRepository
     * @param exchangeHistoryLogRepository ExchangeHistoryLogRepository
     * @param exchangeErrorLogRepository ExchangeErrorLogRepository
     */
    constructor(
        exchangeRepository,
        engineRepository,
        exchangeHistoryLogRepository,
        exchangeErrorLogRepository,
    ) {
        this.exchangeRepository = exchangeRepository;
        this.engineRepository = engineRepository;
        this.exchangeHistoryLogRepository = exchangeHistoryLogRepository;
        this.exchangeErrorLogRepository = exchangeErrorLogRepository;
    }

    /**
     * @return {boolean}
     */
    executeByInstanceId(id, engineKey) {
        const engine = this.engineRepository.getById(id);
        engine.id = id;

        const engineConfigurationAdapter = new BaseEngineConfigurationAdapter(engine);

        const exchangeConnection = this.exchangeRepository.getActive();

        const exchangeFactory = new ExchangeFactory();
        const ExchangeService = exchangeFactory.getByKey(this.exchangeRepository.active);
        const exchangeService = new ExchangeService(exchangeConnection);

        const robotEngineFactory = new RobotEngineFactory();
        const RobotEngine = robotEngineFactory.getByKey(engineKey);
        const robotEngine = new RobotEngine();

        exchangeService.balance((errorBalance, exchangeBalance) => {
            if (errorBalance) {
                return this.exchangeErrorLogRepository.addLog(id, 'ERROR_REQUEST_BALANCE', {
                    error: errorBalance,
                    response: exchangeBalance,
                    engine: engineKey,
                });
            }

            const exchangeBalanceResponseAdapter = new ExchangeBalanceResponseAdapter(exchangeBalance);

            exchangeService.prices([], (errorPrices, exchangePrices) => {
                if (errorPrices) {
                    return this.exchangeErrorLogRepository.addLog(id, 'ERROR_REQUEST_PRICES', {
                        error: errorPrices,
                        response: exchangePrices,
                        engine: engineKey,
                    });
                }

                const exchangePricesResponseAdapter = new ExchangePricesResponseAdapter(exchangePrices);

                const robot = new Robot(robotEngine, engine, exchangePricesResponseAdapter, exchangeBalanceResponseAdapter);
                /** @var action IAction */
                const action = robot.execute();

                let executeAction = { result: true, because: { 'Action': 'default' } };

                if (!action) {
                    executeAction = {result: false, because: {'Action': false}};
                } else if (action.action === 'refreshStatus') {
                    engine.status = action.getStatus();
                    this.engineRepository.setObjectById(engine, id);

                    executeAction = {result: false, because: {'Action': false}};
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

                if (!executeAction.result && action) this.exchangeErrorLogRepository.addLog(id, 'ACTION_IMPOSSIBLE', {
                    error: action,
                    because: executeAction.because,
                    response: {
                        exchangePrices: exchangePricesResponseAdapter.data,
                        exchangeBalance: exchangeBalanceResponseAdapter.data,
                        engine,
                    },
                    engine: engineKey,
                });

                if (executeAction.result) console.log('Executing', action);

                if (executeAction.result) exchangeService.evaluateAction(action, (error, response) => {
                    if (error) {
                        return this.exchangeErrorLogRepository.addLog(id, 'ERROR_REQUEST_EVALUATE_ACTION', {
                            error: error,
                            response: response,
                            engine: engineKey,
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
                            this.roundAmount(
                                engineConfigurationAdapter.getCurrentAmountInMarket(),
                                engineConfigurationAdapter.getDecimalsMainCoin()
                            )
                        );

                        this.engineRepository.setObjectById(engine, id);

                        this.exchangeHistoryLogRepository.addLog(id, action, response, exchangePricesResponseAdapter.data);
                    } else {
                        this.exchangeErrorLogRepository.addLog(id, 'ERROR_ACTION_NOT_FILLED', {
                            error: error,
                            response: response,
                            engine: engineKey,
                        })
                    }
                });
            })
        });

        return true;
    }

    /**
     *
     * @param amount {number}
     * @param decimals {number}
     */
    roundAmount(amount, decimals) {
        return Math.floor(amount * Math.pow(10, decimals)) / Math.pow(10, decimals)
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

module.exports = EngineExecutor;
