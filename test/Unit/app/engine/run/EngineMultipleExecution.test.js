const {describe, expect, test} = require('@jest/globals');
const EngineMultipleExecutionTestDataProvider = require('EngineMultipleExecutionTest.data-provider');

const EngineMultipleExecutionTest = describe('[App] EngineMultipleExecution', () => {
    test('getBalanceAndPrices', () => {

    });

    test('evaluateInstances', () => {
        const engineMultipleExecutionTestDataProvider = new EngineMultipleExecutionTestDataProvider();
        const data = engineMultipleExecutionTestDataProvider.testEvaluateInstances();

    });

    test('evaluateActions', () => {
        const engineMultipleExecutionTestDataProvider= new EngineMultipleExecutionTestDataProvider();
        const data = engineMultipleExecutionTestDataProvider.testEvaluateActions();

    });

    test('evaluateAction', () => {
        const engineMultipleExecutionTestDataProvider = new EngineMultipleExecutionTestDataProvider();
        const data = engineMultipleExecutionTestDataProvider.testEvaluateActions();

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