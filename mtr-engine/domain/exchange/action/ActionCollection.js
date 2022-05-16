class ActionCollection {
    /** @var {ActionInterface[]} */
    actions = [];

    /**
     *
     * @param actions {ActionInterface[]}
     */
    constructor(actions) {
        this.actions = actions;
    }

    /**
     * @returns {ActionInterface[]}
     */
    getActions() {
        return this.actions;
    }

    /**
     * @param action {ActionInterface}
     */
    appendAction(action) {
        this.actions.push(action);
    }
}

module.exports = ActionCollection;