const {describe, expect} = require('@jest/globals');
const Binance = require('node-binance-api');
const BinanceExchangeService = require('../../../../../mtr-engine/domain/exchange/service/BinanceExchangeService');

const BinanceExchangeServiceTest = describe('',  () => {
    const connection = new Binance().options({
        APIKEY: process.env.BINANCE_PUBLIC_KEY,
        APISECRET: process.env.BINANCE_PRIVATE_KEY,
    });

    const binanceExchangeService = new BinanceExchangeService(connection);

    test('Test prices', async () => {
        binanceExchangeService.prices([], (error, prices) => {
            expect(prices).not.toBeFalsy();
            expect(prices).toBeInstanceOf(Object);
            expect(prices).toHaveProperty('ETHBUSD');
        });
    });

    test('Test balance', async () => {
        binanceExchangeService.balance((error, balance) => {
            expect(balance).not.toBeFalsy();
            expect(balance).toBeInstanceOf(Object);
            expect(balance).toHaveProperty('BTC');
            expect(balance).toHaveProperty('ETH');
            expect(balance['BTC']).toHaveProperty('available');
            expect(balance['BTC']).toHaveProperty('onOrder');
        });
    });
});

module.exports = BinanceExchangeServiceTest;
