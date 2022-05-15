// let LinearFunctionRobotEngine = require('../trading-algorithms/linear-function/LinearFunctionRobotEngine');

class RobotEngineFactory {
    /**
     * @todo add here the different engines in order to trade
     *
     * @type {{}}
     */
    robotEngines = {
        // 'linear_function': LinearFunctionRobotEngine
    }

    /**
     *
     * @param key
     * @return RobotEngine
     */
    getByKey(key) {
        return this.robotEngines[key];
    }
}

module.exports = RobotEngineFactory;
