const IEngineConfigurationAdapter = require('./IEngineConfigurationAdapter');

class BaseEngineConfigurationAdapter extends IEngineConfigurationAdapter {

    data = {
        id: 0,
        currentAmountInMarket: 0,
        decimalsMainCoin: 4,
    };

    constructor(data) {
        super();
        this.data = data;
    }

    getId() {
        return this.data.id;
    }

    /**
     * @param currentAmountInMarket int
     */
    setCurrentAmountInMarket(currentAmountInMarket) {
        this.data.currentAmountInMarket = currentAmountInMarket;
    }

    getCurrentAmountInMarket() {
        return this.data.currentAmountInMarket;
    }

    getDecimalsMainCoin() {
        return this.data.decimalsMainCoin;
    }
}

module.exports = BaseEngineConfigurationAdapter;
