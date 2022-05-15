const ExchangeHistoryLogRepository = require('../../../../../mtr-engine/infrastructure/exchange/repositories/ExchangeHistoryLogRepository');
const ExchangeHistoryLogRepositoryTestDataProvider = require('./ExchangeHistoryLogRepositoryTest.data-provider');

const ExchangeHistoryLogRepositoryTest = describe('[Infrastructure] ExchangeHistoryLogRepositoryTest', () => {
    test('constructor', () => {
        const dataConstructor = new ExchangeHistoryLogRepositoryTestDataProvider().testConstructor();

        for (let i = 0; i < dataConstructor.length; i++) {
            const exchangeHistoryLogRepository = new ExchangeHistoryLogRepository(dataConstructor[i].dataDriverInterface);

            expect(exchangeHistoryLogRepository.dataDriver).toEqual(dataConstructor[i].expected);
        }
    });
});

module.exports = ExchangeHistoryLogRepositoryTest;
