class EngineMultipleExecutionTestDataProvider {

    testGetBalanceAndPrices() {
        return [
            {data: {balanceCallback: {error: null, response: {'ETH': {'available': 0, 'onOrder': 0,}}}, pricesCallback: {error: null, response: {'ETHBUSD': 0,}}}, expect: {error: null,availableBalanceByCoins: {'EHT': 0,}, pricesByMarket: {'ETHBUSD': 0,}}},
        ];
    }

    testEvaluateInstances() {

    }

    testEvaluateActions() {

    }

    testEvaluateAction() {

    }

    testCheckCanBuy() {

    }

    testCheckCanSell() {

    }
}

module.exports = EngineMultipleExecutionTestDataProvider;