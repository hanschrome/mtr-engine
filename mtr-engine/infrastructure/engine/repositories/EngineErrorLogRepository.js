class EngineErrorLogRepository {
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

    get() {
        const source = this.getSource();

        this.dataDriver.connect(source);

        return this.dataDriver.readFromStructure();
    }

    setObjectById(object) {
        const source = this.getSource();

        this.dataDriver.connect(source);

        return this.dataDriver.writeFromStructure(object);
    }

    addLog(errorSummary, errorData) {
        if (process.env.VERBOSE) console.log('Logged engine error: ' + errorSummary);
        if (process.env.VERBOSE) console.log(errorData);

        let object = this.get();

        if (object == null) {
            object = {
                "logs": [],
            };
        }

        object.logs.push({errorSummary, errorData});

        this.setObjectById(object);
    }

    getSource() {
        return 'data/engine-error-log.json';
    }
}

module.exports = EngineErrorLogRepository;
