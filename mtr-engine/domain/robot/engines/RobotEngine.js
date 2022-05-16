/**
 * Abstract
 */
class RobotEngine {
    /**
     *
     * @param balance {ExchangeBalanceResponseAdapter}
     * @param prices {ExchangePricesResponseAdapter}
     * @param configurationAdapterData
     */
    init(balance, prices, configurationAdapterData) {

    }

    /**
     * @return IAction|null
     */
    dispatcher() {
        console.log('Empty dispatcher!');
    }
}

module.exports = RobotEngine;
