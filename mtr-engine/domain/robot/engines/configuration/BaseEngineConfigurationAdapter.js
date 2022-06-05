const IEngineConfigurationAdapter = require('./IEngineConfigurationAdapter');

class BaseEngineConfigurationAdapter extends IEngineConfigurationAdapter {

    data = {
        id: 0,
        currentAmountInMarket: 0,
        decimalsMainCoin: 4,
        engine: '',
    };

    constructor(data) {
        super();
        this.data = data;
    }

    /**
     * @returns {number}
     */
    getId() {
        return this.data.id;
    }

    /**
     * @param currentAmountInMarket int
     */
    setCurrentAmountInMarket(currentAmountInMarket) {
        this.data.currentAmountInMarket = currentAmountInMarket;
    }

    /**
     * @returns {number}
     */
    getCurrentAmountInMarket() {
        return this.data.currentAmountInMarket;
    }

    /**
     * @returns {number}
     */
    getDecimalsMainCoin() {
        return this.data.decimalsMainCoin;
    }

    /**
     * @returns {string}
     */
    getEngine() {
        return this.data.engine;
    }
}

module.exports = BaseEngineConfigurationAdapter;
