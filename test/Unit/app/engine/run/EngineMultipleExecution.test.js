const {describe, expect, test} = require('@jest/globals');
const EngineMultipleExecutionTestDataProvider = require('./EngineMultipleExecutionTest.data-provider');
const EngineMultipleExecution = require('../../../../../mtr-engine/app/engine/run/EngineMultipleExecution');
const ExchangeBalanceResponseAdapter = require('../../../../../mtr-engine/domain/exchange/response/model/ExchangeBalanceResponseAdapter');
const ExchangePricesResponseAdapter = require('../../../../../mtr-engine/domain/exchange/response/model/ExchangePricesResponseAdapter');

const EngineMultipleExecutionTest = describe('[App] EngineMultipleExecution', () => {
    test('getBalanceAndPrices', () => {
        const engineMultipleExecutionTestDataProvider = new EngineMultipleExecutionTestDataProvider();
        const testData = engineMultipleExecutionTestDataProvider.testGetBalanceAndPrices();

        const exchangeRepository = {};
        const engineRepository = {};
        const exchangeErrorLogRepository = {};
        const exchangeHistoryLogRepository = {};

        testData.forEach((testDataUnit) => {
            const exchangeService = {
                balance: (callback) => callback(testDataUnit.data.balanceCallback.error, testDataUnit.data.balanceCallback.response),
                prices: (market, callback) => callback(testDataUnit.data.pricesCallback.error, testDataUnit.data.pricesCallback.response),
            };

            const engineMultipleExecution = new EngineMultipleExecution(
                exchangeRepository,
                engineRepository,
                exchangeErrorLogRepository,
                exchangeHistoryLogRepository,
                exchangeService
            );

            const balanceAndPricesPromise = engineMultipleExecution.getBalanceAndPrices();

            balanceAndPricesPromise.then((exchangeData) => {
                /** @var ExchangeBalanceResponseAdapter */
                const exchangeBalanceResponseAdapter = exchangeData.exchangeBalanceResponseAdapter;
                /** @var ExchangePricesResponseAdapter */
                const exchangePricesResponseAdapter = exchangeData.exchangePricesResponseAdapter;

                const isExchangeBalanceResponseAdapter = exchangeBalanceResponseAdapter instanceof ExchangeBalanceResponseAdapter;
                const isExchangePricesResponseAdapter = exchangePricesResponseAdapter instanceof ExchangePricesResponseAdapter;

                expect(isExchangeBalanceResponseAdapter).toBeTruthy();
                expect(isExchangePricesResponseAdapter).toBeTruthy();

                Object.keys(testDataUnit.expect.availableBalanceByCoins).forEach((key) => {
                    expect(exchangeBalanceResponseAdapter.getAvailableBalanceByCoin(key)).toEqual(testDataUnit.expect.availableBalanceByCoins[key].available);
                });

                Object.keys(testDataUnit.expect.pricesByMarket).forEach((key) => {
                    expect(exchangePricesResponseAdapter.getPriceByMarket(key)).toEqual(testDataUnit.expect.pricesByMarket[key]);
                });

            }).catch((error) => {
                // @todo
                throw error;
            });
        });
    });

    test('evaluateInstances', () => {
        const engineMultipleExecutionTestDataProvider = new EngineMultipleExecutionTestDataProvider();
        const testData = engineMultipleExecutionTestDataProvider.testEvaluateInstances();

        const exchangeRepository = {};
        const exchangeErrorLogRepository = {};
        const exchangeHistoryLogRepository = {};
        const exchangeService = {};

        testData.forEach((testDataUnit) => {

            const engineRepository = {
                getIndex: () => testDataUnit.data.engineRepositoryGetIndex,
                getById: (id) => testDataUnit.data.engineRepositoryGetById[id],
            };

            const engineMultipleExecution = new EngineMultipleExecution(
                exchangeRepository,
                engineRepository,
                exchangeErrorLogRepository,
                exchangeHistoryLogRepository,
                exchangeService
            );

            const evaluateInstancesPromise = engineMultipleExecution.evaluateInstances(testDataUnit.data.exchangeBalanceResponseAdapter, testDataUnit.data.exchangePricesResponseAdapter);

            evaluateInstancesPromise.then((actionCollection) => {
                /** @var actionCollection {ActionCollection} */
                expect(actionCollection.getActions()).toEqual(testDataUnit.expect.actions);
            }).catch((error) => throw error); // @todo handle it properly
        });
    });

    test('evaluateActions', () => {
        const engineMultipleExecutionTestDataProvider = new EngineMultipleExecutionTestDataProvider();
        const testData = engineMultipleExecutionTestDataProvider.testEvaluateActions();

        const exchangeRepository = {};
        const exchangeErrorLogRepository = {};
        const exchangeHistoryLogRepository = {};
        const exchangeService = {};
        const engineRepository = {};

        testData.forEach((testDataUnit) => {
            const engineMultipleExecution = new EngineMultipleExecution(
                exchangeRepository,
                engineRepository,
                exchangeErrorLogRepository,
                exchangeHistoryLogRepository,
                exchangeService
            );

            engineMultipleExecution.evaluateActions(testDataUnit.data.actions);
        });
    });

    test('evaluateAction', () => {
        const engineMultipleExecutionTestDataProvider = new EngineMultipleExecutionTestDataProvider();
        const testData = engineMultipleExecutionTestDataProvider.testEvaluateAction();

        const exchangeRepository = {};
        const exchangeErrorLogRepository = {};
        const exchangeHistoryLogRepository = {};
        const exchangeService = {};
        const engineRepository = {};

        testData.forEach((testDataUnit) => {
            const engineMultipleExecution = new EngineMultipleExecution(
                exchangeRepository,
                engineRepository,
                exchangeErrorLogRepository,
                exchangeHistoryLogRepository,
                exchangeService
            );

            engineMultipleExecution.evaluateAction(testDataUnit.data.action).then((data) => {

            });
        });
    });

    test('checkCanBuy', () => {
        const engineMultipleExecutionTestDataProvider = new EngineMultipleExecutionTestDataProvider();
        const data = engineMultipleExecutionTestDataProvider.testCheckCanBuy();

    });

    test('checkCanSell', () => {
        const engineMultipleExecutionTestDataProvider = new EngineMultipleExecutionTestDataProvider();
        const data = engineMultipleExecutionTestDataProvider.testCheckCanSell();

    });
});

module.exports = EngineMultipleExecutionTest;