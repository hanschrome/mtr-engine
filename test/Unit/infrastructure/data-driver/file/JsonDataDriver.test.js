const JsonDataDriver = require('../../../../../mtr-engine/infrastructure/data-driver/file/JsonDataDriver');
const JsonDataDriverTestDataProvider = require('./JsonDataDriverTest.data-provider');

const JsonDataDriverTest = describe('[Infrastructure] JsonDataDriver', () => {

    test('connect',  () => {
        const jsonDataDriver = new JsonDataDriver();
        const dataSet = new JsonDataDriverTestDataProvider().connect();

        for (let i = 0; i < dataSet.length; i++) {
            jsonDataDriver.connect(dataSet[i].path);

            expect(jsonDataDriver.source).toEqual(dataSet[i].expected);
        }
    });

});

module.exports = JsonDataDriverTest;
