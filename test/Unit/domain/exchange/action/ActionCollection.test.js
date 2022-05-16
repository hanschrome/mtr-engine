const ActionCollection = require('../../../../../mtr-engine/domain/exchange/action/ActionCollection');
const ActionInterface = require('../../../../../mtr-engine/domain/exchange/action/ActionInterface');

const ActionCollectionTest = describe('[domain] ActionCollection', () => {
    test('getActions', () => {
        const mockedAction = class FakeBuyAction extends ActionInterface {};
        const actions = [mockedAction, mockedAction];

        const actionCollection = new ActionCollection(actions);

        expect(actionCollection.getActions()).beEquals(actions);
    });

    test('appendAction', () => {
        const mockedAction = class FakeSellAction extends ActionInterface {};

        const actionCollection = new ActionCollection([]);
        actionCollection.appendAction(mockedAction);

        expect(actionCollection.getActions()[0]).beEquals(mockedAction);
    });
});

module.exports = ActionCollectionTest;