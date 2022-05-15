const fs = require('fs');
const DataDriverInterface = require('../DataDriverInterface');

class JsonDataDriver extends DataDriverInterface {
    source = null;

    connect(source) {
        source = source.toString();
        this.source = source;
    }

    readFromStructure(structure = null) {
        if (!fs.existsSync(this.source)) return null;

        let content = fs.readFileSync(this.source);

        content = JSON.parse(content);

        if (structure != null) {
            return content[structure];
        }

        return content;
    }

    writeFromStructure(data, structure = null) {
        let content = JSON.stringify(data, null, 2);

        fs.writeFileSync(this.source, content);

        return content;
    }

    deleteFromStructure() {
        fs.unlinkSync(this.source);
    }
}

module.exports = JsonDataDriver;
