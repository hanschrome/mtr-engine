class IEngineConfigurationAdapter {

    getId() {
        console.log('[WARNING] Engine configuration adapter has not overridden method getId');
    }

    getCurrentAmountInMarket() {
        console.log('[WARNING] Engine configuration adapter has not overriden method getCurrentAmountInMarket');
    }

}

module.exports = IEngineConfigurationAdapter;
