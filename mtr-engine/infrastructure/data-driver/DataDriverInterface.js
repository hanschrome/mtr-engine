class DataDriverInterface {
    connect(source) {
        console.log('Not implemented connect');
    }

    readFromStructure(structure = null) {
        console.log('Not implemented readFromStructure');
    }

    writeFromStructure(data, structure = null) {
        console.log('Not implemented writeFromStructure');
    }
}

module.exports = DataDriverInterface;
