class ExchangeErrorLogRepository {
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

    addLog(id, errorSummary, errorData) {
        if (process.env.VERBOSE) console.log('[' + id + '] Logged exchange error: ' + errorSummary, errorData.because);

        let object = this.getById(id);

        if (object == null) {
            object = {
                "logs": [],
            };
        }

        object.logs.push({errorSummary, errorData});

        this.setObjectById(object, id);
    }

    getSource(id) {
        return 'data/error-logs/' + id + '.json';
    }
}

module.exports = ExchangeErrorLogRepository;
