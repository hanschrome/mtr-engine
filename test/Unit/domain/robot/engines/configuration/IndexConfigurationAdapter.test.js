const IndexConfigurationAdapter = require('../../../../../../mtr-engine/domain/robot/engines/configuration/IndexConfigurationAdapter');

const IndexConfigurationAdapterTest = describe('[domain] IndexConfigurationAdapter', () => {
    test('getInstanceByKey', () => {
        const dataSet = [{
            data: {
                instances: {
                    "1": {"data": "datav"},
                    "a": {"data2": "datav"},
                }
            },
            key: "a",
            expected: {"data2": "datav"},
        }];

        for (let i = 0; i < dataSet.length; i++) {
            const indexConfigurationAdapter = new IndexConfigurationAdapter(dataSet[i].data);
            expect(indexConfigurationAdapter.getInstanceByKey(dataSet[i].key)).toEqual(dataSet[i].expected);
        }
    });

    test('getInstances', () => {
        const dataSet = [{
            data: {
                instances: {
                    "1": {"data": "datav"},
                    "2": {"data": "datav"},
                },
            },
            expected: {
                "1": {"data": "datav"},
                "2": {"data": "datav"},
            }
        }];

        for (let i = 0; i < dataSet.length; i++) {
            const indexConfigurationAdapter = new IndexConfigurationAdapter(dataSet[i].data);
            expect(indexConfigurationAdapter.getInstances()).toEqual(dataSet[i].expected);
        }
    });
});

module.exports = IndexConfigurationAdapterTest;