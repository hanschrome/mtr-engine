const ExchangeRepository = require('../../../../../mtr-engine/infrastructure/exchange/repositories/ExchangeRepository');

const ExchangeRepositoryTest = describe('[Infrastructure] ExchangeRepositoryTest', () => {
    test('getExchangeByKey', () => {
        const exchangeRepository = new ExchangeRepository();

        const binance = exchangeRepository.getExchangeByKey('binance');
        const demex = exchangeRepository.getExchangeByKey('demex');

        expect(binance).toBeNull();
        expect(demex).toBeNull();
    });
});
