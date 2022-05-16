const IndexConfigurationAdapter = require('../../../domain/robot/engines/configuration/IndexConfigurationAdapter');
const ExchangeBalanceResponseAdapter = require('../../../domain/exchange/response/model/ExchangeBalanceResponseAdapter');
const ExchangePricesResponseAdapter = require('../../../domain/exchange/response/model/ExchangePricesResponseAdapter');
const ActionCollection = require('../../../domain/exchange/action/ActionCollection');

class EngineMultipleExecution {

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
        callback(
            this.getIndexConfigurationAdapter(),
            new ExchangeBalanceResponseAdapter({}),
            new ExchangePricesResponseAdapter({}));
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

    }

    /**
     * @param action {IAction}
     */
    evaluateAction(action) {

    }
}

module.exports = EngineMultipleExecution;