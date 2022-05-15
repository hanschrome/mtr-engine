const BinanceExchangeService = require('../service/BinanceExchangeService');
const DemexExchangeService = require('../service/DemexExchangeService');

class ExchangeFactory {
    relations = {
        'binance': BinanceExchangeService,
        'demex': DemexExchangeService,
    };

    constructor() {
    }

    /**
     *
     * @param key
     * @return {*|AbstractExchangeService}
     */
    getByKey(key) {
        return this.relations[key];
    }
}

module.exports = ExchangeFactory;
