const {describe, expect} = require('@jest/globals');
const ExchangeActionResponseAdapter = require('../../../../../../mtr-engine/domain/exchange/response/model/ExchangeActionResponseAdapter');

const ExchangeActionResponseAdapterTest = describe('[Domain] ExchangeActionResponseAdapter', () => {

    test('Testing getters', async () => {
        const data = {
            executedQty: 1.01,
        };

        const exchangeActionResponseAdapter = new ExchangeActionResponseAdapter(data);

        expect(exchangeActionResponseAdapter.getExecutedQuantity()).toEqual(data.executedQty);
    });

});

module.exports = ExchangeActionResponseAdapterTest;
