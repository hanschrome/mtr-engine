class EngineRepository {
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

    getSource(id) {
        return 'data/' + id + '.json';
    }
}

module.exports = EngineRepository;
