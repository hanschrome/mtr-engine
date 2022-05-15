const ExchangeErrorLogRepository = require('../../../../../mtr-engine/infrastructure/exchange/repositories/ExchangeErrorLogRepository');
const ExchangeErrorLogRepositoryTestDataProvider = require('./ExchangeErrorLogRepositoryTest.data-provider');

const ExchangeErrorLogRepositoryTest = describe('[Infrastructure] ExchangeErrorLogRepository', () => {
    test('constructor', () => {
        const dataConstructor = new ExchangeErrorLogRepositoryTestDataProvider().testConstructor();

        for (let i = 0; i < dataConstructor.length; i++) {
            const exchangeErrorLogRepository = new ExchangeErrorLogRepository(dataConstructor[i].dataDriverInterface);

            expect(exchangeErrorLogRepository.dataDriver).toEqual(dataConstructor[i].expected);
        }
    });
});

module.exports = ExchangeErrorLogRepositoryTest;
