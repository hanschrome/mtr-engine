const EngineRepository = require('../../../../../mtr-engine/infrastructure/engine/repositories/EngineRepository');
const EngineRepositoryTestDataProvider = require('./EngineRepositoryTest.data-provider');

const EngineRepositoryTest = describe('[Infrastructure] EngineRepository', () => {
    test('constructor', () => {
        const constructorData = new EngineRepositoryTestDataProvider().testConstructor();

        for (let i = 0; i < constructorData.length; i++) {
            const engineRepository = new EngineRepository(constructorData[i].dataDriverInterface);

            expect(engineRepository.dataDriver).toEqual(constructorData[i].expected);
        }
    })
});

module.exports = EngineRepositoryTest;
