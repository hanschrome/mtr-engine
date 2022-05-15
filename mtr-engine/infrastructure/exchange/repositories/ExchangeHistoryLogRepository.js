class ExchangeHistoryLogRepository {
    /**
     *
     * @type {DataDriverInterface}
     */
    dataDriver = null;

    /**
     * @param dataDriverInterface DataDriverInterface
     */
    constructor(dataDriverInterface) {
        this.dataDriver = dataDriverInterface;
    }

    getById(id) {
        const source = this.getSource(id);

        this.dataDriver.connect(source);

        return this.dataDriver.readFromStructure();
    }

    setObjectById(object, id) {
        const source = this.getSource(id);

        this.dataDriver.connect(source);

        return this.dataDriver.writeFromStructure(object);
    }

    /**
     *
     * @param id
     * @param action {ActionInterface}
     * @param response
     * @param prices
     */
    addLog(id, action, response, prices) {
        if (process.env.VERBOSE) console.log('[' + id + '] Logged history: ' + JSON.stringify(action));

        let object = this.getById(id);

        if (object == null) {
            object = {
                "logs": [],
            };
        }

        object.logs.push({action, response, prices});

        this.setObjectById(object, id);
    }

    getSource(id) {
        return 'data/history-logs/' + id + '.json';
    }
}

module.exports = ExchangeHistoryLogRepository;
