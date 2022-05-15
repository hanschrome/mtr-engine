const {describe, expect} = require('@jest/globals');
const BinanceExchangeService = require('../../../../../mtr-engine/domain/exchange/service/BinanceExchangeService');
const DemexExchangeService = require('../../../../../mtr-engine/domain/exchange/service/DemexExchangeService');
const ExchangeFactory = require('../../../../../mtr-engine/domain/exchange/factory/ExchangeFactory');

const exchangeFactoryTest = describe('[Domain] ExchangeFactory', () => {
    test('Testing exchanges get', async () => {
        const exchangeFactory = new ExchangeFactory();
        const BinanceExchangeServiceClass = exchangeFactory.getByKey('binance');
        const DemexExchangeServiceClass = exchangeFactory.getByKey('demex');

        expect(BinanceExchangeServiceClass.constructor.name).toEqual(BinanceExchangeService.constructor.name);
        expect(DemexExchangeServiceClass.constructor.name).toEqual(DemexExchangeService.constructor.name);
    });
});

module.exports = exchangeFactoryTest;
