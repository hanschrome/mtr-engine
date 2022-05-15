const {describe, expect} = require('@jest/globals');
const ExchangeBalanceResponseAdapter = require('../../../../../../mtr-engine/domain/exchange/response/model/ExchangeBalanceResponseAdapter');

const ExchangeBalanceResponseAdapterTest = describe('[Domain] ExchangeBalanceResponseAdapter', () => {
    test('Test getters', async () => {
        const data = {
            'ETH': { available: 100.01, onOrder: 0},
            'BUSD': { available: 0, onOrder: 0},
            'BTC': { available: 0, onOrder: 0},
            'XMR': { available: 0, onOrder: 0},
        };

        const exchangeBalanceResponseAdapter = new ExchangeBalanceResponseAdapter(data);

        expect(exchangeBalanceResponseAdapter.getAvailableBalanceByCoin('ETH')).toEqual(data['ETH'].available);
    });
});

module.exports = ExchangeBalanceResponseAdapterTest;
