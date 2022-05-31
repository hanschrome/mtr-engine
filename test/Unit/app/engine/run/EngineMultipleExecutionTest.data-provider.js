const BaseEngineConfigurationAdapter = require('../../../../../mtr-engine/domain/robot/engines/configuration/BaseEngineConfigurationAdapter');

class EngineMultipleExecutionTestDataProvider {

    testGetBalanceAndPrices() {
        return [
            {data: {balanceCallback: {error: null, response: {'ETH': {available: 0, onOrder: 0}}}, pricesCallback: {error: null, response: {'ETHBUSD': 0,}}}, expect: {error: null, availableBalanceByCoins: {'ETH': {available: 0, onOrder: 0}}, pricesByMarket: {'ETHBUSD': 0,}}},
        ];
    }

    testEvaluateInstances() {
        return [
            {
                data: {
                    exchangeBalanceResponseAdapter: null,
                    exchangePricesResponseAdapter: null,
                    engineRepositoryGetIndex: {
                        "instances": {

                        }
                    },
                    engineRepositoryGetById: {1: null}
                },
                expect: {
                    actions: [],
                },
            },
        ];
    }

    testEvaluateActions() {
        return [
            {
                data: {
                    actions: [], // IAction with fake ok/ko promise ?
                },
                expect: {},
            }
        ]
    }

    testEvaluateAction() {
        return [
            {
                data: {
                    action: {
                        getEngineConfiguration: () => new BaseEngineConfigurationAdapter({"id": "1"})
                    },
                },
                expect: {},
            }
        ]
    }

    testCheckCanBuy() {

    }

    testCheckCanSell() {

    }
}

module.exports = EngineMultipleExecutionTestDataProvider;