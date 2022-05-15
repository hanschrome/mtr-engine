const {describe, expect} = require('@jest/globals');
const BuyMarketAction = require('../../../../../../mtr-engine/domain/exchange/action/model/BuyMarketAction');

const buyMarketActionTest = describe("[Domain] BuyMarketAction test", () => {

    test('Testing getters', async () => {
        const properties = {quantity: 1.01, market: 'ETHBUSD', mainCoin: 'ETH', secondCoin: 'BUSD'};
        const buyMarketAction = new BuyMarketAction(properties.quantity, properties.market, properties.mainCoin, properties.secondCoin);

        expect(buyMarketAction.getQuantity()).toStrictEqual(properties.quantity);
        expect(buyMarketAction.getMarket()).toEqual(properties.market);
        expect(buyMarketAction.getMainCoin()).toEqual(properties.mainCoin);
        expect(buyMarketAction.getSecondCoin()).toEqual(properties.secondCoin);
        expect(buyMarketAction.getAction()).toEqual('buyMarket');
        expect(buyMarketAction.getMessage()).toEqual('');
    });

    test('Testing properties', async () => {
        const properties = {quantity: 1.01, market: 'ETHBUSD', mainCoin: 'ETH', secondCoin: 'BUSD'};
        const buyMarketAction = new BuyMarketAction(properties.quantity, properties.market, properties.mainCoin, properties.secondCoin);

        expect(buyMarketAction.quantity).toStrictEqual(properties.quantity);
        expect(buyMarketAction.market).toEqual(properties.market);
        expect(buyMarketAction.mainCoin).toEqual(properties.mainCoin);
        expect(buyMarketAction.secondCoin).toEqual(properties.secondCoin);
        expect(buyMarketAction.action).toEqual('buyMarket');
        expect(buyMarketAction.message).toEqual('');
    });

});

module.exports = buyMarketActionTest;
