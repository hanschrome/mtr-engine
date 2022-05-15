var AbstractExchangeService = require("./AbstractExchangeService");

class DemexExchangeService extends AbstractExchangeService {

    prices(market, callback) {
        return {};
    }

    balance(callback) {
        return {};
    }

    buy(market, balanceToSell, priceToSell, options, callback) {
        return {};
    }

    sell(market, balanceToSell, priceToSell, options, callback) {
        return {};
    }

    marketSell(market, quantity, callback) {
        return {};
    }

    marketBuy(market, quantity, callback) {
        return {};
    }

    orderStatus(market, order, callback) {
        return {};
    }
}

module.exports = DemexExchangeService;
