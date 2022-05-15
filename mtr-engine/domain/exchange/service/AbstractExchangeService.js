class AbstractExchangeService {
    connection = null;

    constructor(connection) {
        this.connection = connection;
    }

    prices(market, callback) {
        console.log('WARNING prices not extended');
    }

    balance(callback) {
        console.log('WARNING balance NOT EXTENDED');
    }

    marketBuy(market, quantity, callback) {
        console.log('WARNING marketBuy NOT EXTENDED');
    }

    buy(market, balanceToSell, priceToSell, options, callback) {
        console.log('WARNING buy NOT EXTENDED');
    }

    marketSell(market, quantity, callback) {
        console.log('WARNING marketSell NOT EXTENDED');
    }

    sell(market, balanceToSell, priceToSell, options, callback) {
        console.log('WARNING sell NOT EXTENDED');
    }

    orderStatus(market, order, callback) {
        console.log('WARNING orderStatus NOT EXTENDED');
    }

    /**
     * @param action ActionInterface
     * @param callback
     */
    evaluateAction(action, callback) {
        if (action.action === 'buyMarket') this.marketBuy(action.market, action.quantity, callback);
        if (action.action === 'sellMarket') this.marketSell(action.market, action.quantity, callback);
    }
}

module.exports = AbstractExchangeService;
