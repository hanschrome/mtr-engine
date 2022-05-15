const {describe, expect} = require('@jest/globals');
const SellMarketAction = require('../../../../../../mtr-engine/domain/exchange/action/model/SellMarketAction');

const sellMarketActionTest = describe("[Domain] SellMarketAction test", () => {

    test('Testing getters', async () => {
        const properties = {quantity: 1.01, market: 'ETHBUSD', mainCoin: 'ETH', secondCoin: 'BUSD'};
        const sellMarketAction = new SellMarketAction(properties.quantity, properties.market, properties.mainCoin, properties.secondCoin);

        expect(sellMarketAction.getQuantity()).toStrictEqual(properties.quantity);
        expect(sellMarketAction.getMarket()).toEqual(properties.market);
        expect(sellMarketAction.getMainCoin()).toEqual(properties.mainCoin);
        expect(sellMarketAction.getSecondCoin()).toEqual(properties.secondCoin);
        expect(sellMarketAction.getAction()).toEqual('sellMarket');
        expect(sellMarketAction.getMessage()).toEqual('');
    })

    test('Testing properties', async () => {
        const properties = {quantity: 1.01, market: 'ETHBUSD', mainCoin: 'ETH', secondCoin: 'BUSD'};
        const sellMarketAction = new SellMarketAction(properties.quantity, properties.market, properties.mainCoin, properties.secondCoin);

        expect(sellMarketAction.quantity).toStrictEqual(properties.quantity);
        expect(sellMarketAction.market).toEqual(properties.market);
        expect(sellMarketAction.mainCoin).toEqual(properties.mainCoin);
        expect(sellMarketAction.secondCoin).toEqual(properties.secondCoin);
        expect(sellMarketAction.action).toEqual('sellMarket');
        expect(sellMarketAction.message).toEqual('');
    });

});

module.exports = sellMarketActionTest;
