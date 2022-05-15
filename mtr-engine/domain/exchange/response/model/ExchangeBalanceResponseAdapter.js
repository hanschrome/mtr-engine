class ExchangeBalanceResponseAdapter {

    data = {
        "ETH": {
            available: 0,
            onOrder: 0,
        }
    };

    constructor(data) {
        this.data = data;
    }

    /**
     *
     * @param coin {string}
     * @return {{available: string, onOrder: string}}
     */
    getAvailableBalanceByCoin(coin) {
        const coinBalance = {
            available: this.data[coin].available,
            onOrder: this.data[coin].onOrder,
        };

        return coinBalance.available;
    }

}

module.exports = ExchangeBalanceResponseAdapter;
