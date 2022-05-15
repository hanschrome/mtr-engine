class JsonDataDriverTestDataProvider {
    connect() {
        return [
            {expected: 'path', path: 'path'},
            {expected: 'path/sub-path', path: 'path/sub-path'},
            {expected: 'path/sub-path', path: 'path/sub-path'},
            {expected: 'path/sub-path/sub-sub-path', path: 'path/sub-path/sub-sub-path'},
            {expected: '0', path: 0},
            {expected: '0', path: [0]},
            {expected: '0,1', path: [0, 1]},
        ];
    }
}

module.exports = JsonDataDriverTestDataProvider;
