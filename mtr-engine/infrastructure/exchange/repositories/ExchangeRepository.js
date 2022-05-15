const Binance = require('node-binance-api');

class ExchangeRepository {

    EXCHANGE_BINANCE = 'binance';
    EXCHANGE_DEMEX = 'demex';

    exchanges = {
        'binance': null,
        'demex': null,
    };

    active = process.env.ACTIVE_EXCHANGE;

    constructor() {
    }

    init() {
        // const sdk = await CarbonSDK.instance({network: CarbonSDK.Network.LocalHost});
        // this.exchanges[this.EXCHANGE_DEMEX] = await sdk.connectWithPrivateKey(process.env.CARBON_PRIVATE_KEY);

        this.exchanges[this.EXCHANGE_BINANCE] = new Binance().options({
            APIKEY: process.env.BINANCE_PUBLIC_KEY,
            APISECRET: process.env.BINANCE_PRIVATE_KEY,
        });

        return this;
    }

    getActive() {
        return this.getExchangeByKey(this.active);
    }

    getExchangeByKey(key) {
        return this.exchanges[key];
    }

    prices(market, callback) {
        this.getActive().prices(market, callback);
    }

    balance(callback) {
        this.getActive().balance(callback);
    }

    buy(market, balanceToSell, priceToSell, options, callback) {
        this.getActive().buy(market, balanceToSell, priceToSell, options, callback);
    }

    sell(market, balanceToSell, priceToSell, options, callback) {
        this.getActive().sell(market, balanceToSell, priceToSell, options, callback);
    }

    orderStatus(market, order, callback) {
        this.getActive().orderStatus(market, order, callback);
    }
}

module.exports = ExchangeRepository;
