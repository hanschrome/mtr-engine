class Robot {
    /**
     *
     * @type {RobotEngine}
     */
    robotEngine = null;
    robotData;
    exchangePrices;
    exchangeBalance;

    /**
     *
     * @param robotEngine {RobotEngine}
     * @param robotData
     * @param exchangePrices {ExchangePricesResponseAdapter}
     * @param exchangeBalance {ExchangeBalanceResponseAdapter}
     */
    constructor(robotEngine, robotData, exchangePrices, exchangeBalance) {
        this.robotEngine = robotEngine;
        this.robotData = robotData;
        this.exchangePrices = exchangePrices;
        this.exchangeBalance = exchangeBalance;
    }

    /**
     * @return ActionInterface|null
     */
    execute() {
        this.robotEngine.init(this.exchangeBalance, this.exchangePrices, this.robotData);

        return this.robotEngine.dispatcher();
    }
}

module.exports = Robot;
