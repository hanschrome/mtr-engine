const ActionCollection = require('../../../../../mtr-engine/domain/exchange/action/ActionCollection');
const IAction = require('../../../../../mtr-engine/domain/exchange/action/IAction');

const ActionCollectionTest = describe('[domain] ActionCollection', () => {
    test('getActions', () => {
        const mockedAction = class FakeBuyAction extends IAction {};
        const actions = [mockedAction, mockedAction];

        const actionCollection = new ActionCollection(actions);

        expect(actionCollection.getActions()).toEqual(actions);
    });

    test('appendAction', () => {
        const mockedAction = class FakeSellAction extends IAction {};

        const actionCollection = new ActionCollection([]);
        actionCollection.appendAction(mockedAction);

        expect(actionCollection.getActions()[0]).toEqual(mockedAction);
    });
});

module.exports = ActionCollectionTest;