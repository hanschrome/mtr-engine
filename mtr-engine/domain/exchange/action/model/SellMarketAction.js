const ActionInterface = require('../ActionInterface');

class SellMarketAction extends ActionInterface{
    quantity = 0;
    market = null;
    action = 'sellMarket';

    constructor(quantity, market, mainCoin, secondCoin) {
        super();

        this.quantity = quantity;
        this.market = market;
        this.mainCoin = mainCoin;
        this.secondCoin = secondCoin;
    }
}

module.exports = SellMarketAction;
