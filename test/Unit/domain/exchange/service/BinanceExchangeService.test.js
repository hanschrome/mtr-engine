const {describe, expect} = require('@jest/globals');
const BinanceExchangeService = require('../../../../../mtr-engine/domain/exchange/service/BinanceExchangeService')

const BinanceExchangeServiceTest = describe('[Domain] Binance exchange service test', () => {

    test('Test prices', () => {

        const connectionMockup = {
            prices: async (market, callback) => {
                const data = {'ETHBUSD': 10.01};
                const error = undefined;

                return callback(error, data);
            }
        };

        const binanceExchangeService = new BinanceExchangeService(connectionMockup);

        binanceExchangeService.prices([], (error, prices) => {
            expect(error).toBeUndefined();

            expect(prices).not.toBeFalsy();
            expect(prices).toBeInstanceOf(Object);
            expect(prices).toHaveProperty('ETHBUSD');
            expect(prices['ETHBUSD']).toEqual(10.01);
        })
    });

    test('Test balance', () => {

        const connectionMockup = {
            balance: async (callback) => {
                const data = {'ETH': {available: 10.01, onOrder: 12.01}};
                const error = undefined;

                return callback(error, data);
            }
        };

        const binanceExchangeService = new BinanceExchangeService(connectionMockup);

        binanceExchangeService.balance((error, balance) => {
            expect(error).toBeUndefined();

            expect(balance).not.toBeFalsy();
            expect(balance).toBeInstanceOf(Object);
            expect(balance['ETH']).toHaveProperty('available');
            expect(balance['ETH']).toHaveProperty('onOrder');
            expect(balance['ETH'].available).toBe(10.01);
            expect(balance['ETH'].onOrder).toBe(12.01);
        });
    });

    test('Test buy' , () => {
        const connectionMockup = {
            buy: async (market, balanceToBuy, priceToBuy, options, callback) => {
                const data = {};
                const error = undefined;

                return callback(error, data);
            }
        };

        const binanceExchangeService = new BinanceExchangeService(connectionMockup);

        binanceExchangeService.buy(null, null, null, null, (error, buy) => {
            expect(error).toBeUndefined();

            expect(buy).not.toBeFalsy();
            expect(buy).toBeInstanceOf(Object);
        });
    });

    test('Test sell', () => {
        const connectionMockup = {
            sell: async (market, balanceToSell, priceToSell, options, callback) => {
                const data = {};
                const error = undefined;

                return callback(error, data);
            }
        };

        const binanceExchangeService = new BinanceExchangeService(connectionMockup);

        binanceExchangeService.sell(null, null, null, null, (error, sell) => {
            expect(error).toBeUndefined();

            expect(sell).not.toBeFalsy();
            expect(sell).toBeInstanceOf(Object);
        });
    });

    test('Test marketBuy', () => {
        const connectionMockup = {
            marketBuy: async (market, quantity, callback) => {
                const data = {};
                const error = undefined;

                return callback(error, data);
            }
        };

        const binanceExchangeService = new BinanceExchangeService(connectionMockup);

        binanceExchangeService.marketBuy(null, null, (error, marketBuy) => {
            expect(error).toBeUndefined();

            expect(marketBuy).not.toBeFalsy();
            expect(marketBuy).toBeInstanceOf(Object);
        });
    });

    test('Test marketSell', () => {
        const connectionMockup = {
            marketSell: async (market, quantity, callback) => {
                const data = {};
                const error = undefined;

                return callback(error, data);
            }
        };

        const binanceExchangeService = new BinanceExchangeService(connectionMockup);

        binanceExchangeService.marketSell(null, null, (error, marketSell) => {
            expect(error).toBeUndefined();

            expect(marketSell).not.toBeFalsy();
            expect(marketSell).toBeInstanceOf(Object);
        });
    });

    test('Test orderStatus', () => {
        const connectionMockup = {
            orderStatus: async (market, order, callback) => {
                const data = {};
                const error = undefined;

                return callback(error, data);
            }
        };

        const binanceExchangeService = new BinanceExchangeService(connectionMockup);

        binanceExchangeService.orderStatus(null, null, (error, orderStatus) => {
            expect(error).toBeUndefined();

            expect(orderStatus).not.toBeFalsy();
            expect(orderStatus).toBeInstanceOf(Object);
        });
    });
});

module.exports = BinanceExchangeServiceTest;
