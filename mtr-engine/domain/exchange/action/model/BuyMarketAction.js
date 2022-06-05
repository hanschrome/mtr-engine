const IAction = require('../IAction');

class BuyMarketAction extends IAction {
    quantity = 0;
    market = null;
    action = 'buyMarket';

    constructor(quantity, market, mainCoin, secondCoin) {
        super();

        this.quantity = quantity;
        this.market = market;
        this.mainCoin = mainCoin;
        this.secondCoin = secondCoin;
    }
}

module.exports = BuyMarketAction;
