const IndexConfigurationAdapter = require('../../../domain/robot/engines/configuration/IndexConfigurationAdapter');
const ExchangeBalanceResponseAdapter = require('../../../domain/exchange/response/model/ExchangeBalanceResponseAdapter');
const ExchangePricesResponseAdapter = require('../../../domain/exchange/response/model/ExchangePricesResponseAdapter');
const ActionCollection = require('../../../domain/exchange/action/ActionCollection');
const ExchangeFactory = require('../../../domain/exchange/factory/ExchangeFactory');

class EngineMultipleExecution {

    /**
     * @type {ExchangeRepository}
     */
    exchangeRepository = null;

    /**
     * @param exchangeRepository {ExchangeRepository}
     */
    constructor(exchangeRepository) {
        this.exchangeRepository = exchangeRepository;
    }

    executeByConfiguration() {
        this.callBalanceAndPrices(this.evaluateInstances);
    }

    /**
     * @return {IndexConfigurationAdapter}
     */
    getIndexConfigurationAdapter() {
        return new IndexConfigurationAdapter({});
    }

    callBalanceAndPrices(callback) {
        const exchangeFactory = new ExchangeFactory();
        const ExchangeService = exchangeFactory.getByKey(this.exchangeRepository.active);
        const exchangeService = new ExchangeService(this.exchangeRepository.getActive());

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

                callback(
                    this.getIndexConfigurationAdapter(),
                    exchangeBalanceResponseAdapter,
                    exchangePricesResponseAdapter);
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
        this.evaluateActions(new ActionCollection([]));
    }

    /**
     * @param actionCollection {ActionCollection}
     */
    evaluateActions(actionCollection) {
        for (let i = 0; i < actionCollection.getActions().length; i++) {
            this.evaluateAction(actionCollection.getActions()[i]).then((e, m) => {
                if (e) {
                    // !!
                }

                console.log(m);
            });
        }
    }

    /**
     * @param action {IAction}
     */
    async evaluateAction(action) {
        try {
            // perform the action on the exchange
        } catch (e) {
            // handle error
        }
    }
}

module.exports = EngineMultipleExecution;