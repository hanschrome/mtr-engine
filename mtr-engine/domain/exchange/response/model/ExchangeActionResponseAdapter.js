class ExchangeActionResponseAdapter {

    data = [];

    constructor(data) {
        this.data = data;
    }

    getExecutedQuantity() {
        return this.data.executedQty;
    }
}

module.exports = ExchangeActionResponseAdapter;
