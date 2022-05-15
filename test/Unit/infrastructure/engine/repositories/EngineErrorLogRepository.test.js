const EngineErrorLogRepository = require('../../../../../mtr-engine/infrastructure/exchange/repositories/ExchangeErrorLogRepository');
const EngineErrorLogRepositoryTestDataProvider = require('./EngineErrorLogRepositoryTest.data-provider');

const EngineErrorLogRepositoryTest = describe('[Infrastructure] EngineErrorLogRepository', () => {
    test('constructor', () => {
        const constructorData = new EngineErrorLogRepositoryTestDataProvider().testConstructor();

        for (let i = 0; i < constructorData.length; i++) {
            const engineErrorLogRepository = new EngineErrorLogRepository(constructorData[i].dataDriverInterface);

            expect(engineErrorLogRepository.dataDriver).toEqual(constructorData[i].expected);
        }
    });
});

module.exports = EngineErrorLogRepositoryTest;
