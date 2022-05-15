const {describe, expect} = require('@jest/globals');
const BaseEngineConfigurationAdapter = require('../../../../../../mtr-engine/domain/robot/engines/configuration/BaseEngineConfigurationAdapter');

const BaseEngineConfigurationAdapterTest = describe('[Domain] BaseEngineConfigurationAdapter', () => {
    test('getId', () => {
        const data = {id: 1};

        const baseEngineConfigurationAdapter = new BaseEngineConfigurationAdapter(data);

        expect(baseEngineConfigurationAdapter.getId()).toEqual(data.id);
    });

    test('setCurrentAmountInMarket', () => {
        const amountInMarket = 10.01;
        const data = {currentAmountInMarket: 10};

        const baseEngineConfigurationAdapter = new BaseEngineConfigurationAdapter(data);

        expect(baseEngineConfigurationAdapter.getCurrentAmountInMarket()).toEqual(data.currentAmountInMarket);

        baseEngineConfigurationAdapter.setCurrentAmountInMarket(amountInMarket);

        expect(baseEngineConfigurationAdapter.getCurrentAmountInMarket()).toEqual(amountInMarket);
    });

    test('getDecimalsMainCoin', () => {
        const data = {decimalsMainCoin: 4};

        const baseEngineConfigurationAdapter = new BaseEngineConfigurationAdapter(data);

        expect(baseEngineConfigurationAdapter.getDecimalsMainCoin()).toEqual(data.decimalsMainCoin);
    });
});

module.exports = BaseEngineConfigurationAdapterTest;
