const IIndexConfigurationAdapter = require('./IIndexConfigurationAdapter');

class IndexConfigurationAdapter extends IIndexConfigurationAdapter {
    data = {
        instances: [],
    };

    constructor(data) {
        super();
        this.data = data;
    }

    getInstanceByKey(key) {
        return this.data.instances[key];
    }

    getInstances() {
        return this.data.instances;
    }
}

module.exports = IndexConfigurationAdapter;