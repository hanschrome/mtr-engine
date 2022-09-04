const IAction = require('../IAction');

class RefreshStatusAction extends IAction {
    quantity = 0;
    market = null;
    status = {}
    action = 'refreshStatus';

    constructor(status) {
        super();

        this.status = status;
    }

    getStatus() {
        return this.status;
    }
}

module.exports = RefreshStatusAction;