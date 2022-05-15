const {describe, expect} = require('@jest/globals');
const ExchangePricesResponseAdapter = require('../../../../../../mtr-engine/domain/exchange/response/model/ExchangePricesResponseAdapter');

const ExchangeBalanceResponseAdapterTest = describe('[Domain] ExchangeBalanceResponseAdapter', () => {
    test('Test getters', async () => {
        const data = { 'ETH': 10.01 };
        const exchangePricesResponseAdapter = new ExchangePricesResponseAdapter(data);

        expect(exchangePricesResponseAdapter.getPriceByMarket('ETH')).toEqual(data['ETH']);
    });
});

module.exports = ExchangeBalanceResponseAdapterTest;
