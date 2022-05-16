/**
 * @property action string|null
 */
class IAction {
    quantity = 0;
    market = '';
    action = '';
    mainCoin = '';
    secondCoin = '';
    message = '';

    getQuantity() {
        return this.quantity;
    }

    getMarket() {
        return this.market;
    }

    getAction() {
        return this.action;
    }

    getMainCoin() {
        return this.mainCoin;
    }

    getSecondCoin() {
        return this.secondCoin;
    }

    getMessage() {
        return this.message
    }
}

module.exports = IAction;
