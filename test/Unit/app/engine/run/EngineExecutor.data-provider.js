class EngineExecutorDataProvider {
    testRoundAmount() {
        return [
            {amount: 0, decimals: 0, expected: 0},
            {amount: 10.01, decimals: 1, expected: 10.0},
            {amount: 10.01, decimals: 2, expected: 10.01},
            {amount: 0.00000011, decimals: 7, expected: 0.0000001},
            {amount: 1.1, decimals: 0, expected: 1},
        ];
    }
}

module.exports = EngineExecutorDataProvider;