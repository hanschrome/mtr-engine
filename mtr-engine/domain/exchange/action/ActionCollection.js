class ActionCollection {
    /** @var {IAction[]} */
    actions = [];

    /**
     *
     * @param actions {IAction[]}
     */
    constructor(actions) {
        this.actions = actions;
    }

    /**
     * @returns {IAction[]}
     */
    getActions() {
        return this.actions;
    }

    /**
     * @param action {IAction}
     */
    appendAction(action) {
        this.actions.push(action);
    }
}

module.exports = ActionCollection;