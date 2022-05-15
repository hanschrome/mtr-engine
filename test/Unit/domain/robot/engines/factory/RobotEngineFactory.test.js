const {describe, expect} = require('@jest/globals');
const RobotEngineFactory = require('../../../../../../mtr-engine/domain/robot/engines/factory/RobotEngineFactory');
// const LinearFunctionRobotEngine = require('../../../../../../mtr-engine/domain/robot/engines/trading-algorithms/linear-function/LinearFunctionRobotEngine');

const RobotEngineFactoryTest = describe('[Domain] RobotEngineFactory', () => {
    test('getByKey', () => {
        const robotEngineFactory = new RobotEngineFactory();
	
//        expect(robotEngineFactory.getByKey('linear_function').constructor.name).toEqual(LinearFunctionRobotEngine.constructor.name);
    });
});
