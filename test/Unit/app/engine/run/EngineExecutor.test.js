const {describe, expect, test} = require('@jest/globals');
const EngineExecutorTestDataProvider = require('./EngineExecutor.data-provider');
const EngineExecutor = require('../../../../../mtr-engine/app/engine/run/EngineExecutor');

const EngineExecutorTest = describe('[App] EngineExecutorTest', () => {

    test('roundAmount', () => {
        const engineExecutor = new EngineExecutor(null, null, null, null);
        const testData = new EngineExecutorTestDataProvider().testRoundAmount();

        for (let data of testData) {
            expect(engineExecutor.roundAmount(data.amount, data.decimals)).toEqual(data.expected);
        }
    });
});

module.exports = EngineExecutor;