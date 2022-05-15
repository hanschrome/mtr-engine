var AbstractExchangeService = require("./AbstractExchangeService");

class BinanceExchangeService extends AbstractExchangeService {

    prices(market, callback) {
        this.connection.prices(market, callback);
    }

    balance(callback) {
        this.connection.balance(callback);
    }

    buy(market, balanceToBuy, priceToBuy, options, callback) {
        this.connection.buy(market, balanceToBuy, priceToBuy, options, callback);
    }

    sell(market, balanceToSell, priceToSell, options, callback) {
        this.connection.sell(market, balanceToSell, priceToSell, options, callback);
    }

    marketSell(market, quantity, callback) {
        this.connection.marketSell(market, quantity, callback);
    }

    marketBuy(market, quantity, callback) {
        this.connection.marketBuy(market, quantity, callback);
    }

    orderStatus(market, order, callback) {
        this.connection.orderStatus(market, order, callback);
    }
}

module.exports = BinanceExchangeService;
