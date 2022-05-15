class ExchangePricesResponseAdapter {

    data = [];

    constructor(data) {
        this.data = data;
    }

    getPriceByMarket(market) {
        return this.data[market];
    }

}

module.exports = ExchangePricesResponseAdapter;
