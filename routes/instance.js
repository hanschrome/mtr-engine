const express = require('express');
const router = express.Router();
const EngineExecutor = require('../mtr-engine/app/engine/run/EngineExecutor');
const ExchangeRepository = require('../mtr-engine/infrastructure/exchange/repositories/ExchangeRepository');
const ExchangeHistoryLogRepository = require('../mtr-engine/infrastructure/exchange/repositories/ExchangeHistoryLogRepository');
const ExchangeErrorLogRepository = require('../mtr-engine/infrastructure/exchange/repositories/ExchangeErrorLogRepository');
const EngineRepository = require('../mtr-engine/infrastructure/engine/repositories/EngineRepository');
const JsonDataDriver = require('../mtr-engine/infrastructure/data-driver/file/JsonDataDriver');
const EngineErrorLogRepository = require('../mtr-engine/infrastructure/engine/repositories/EngineErrorLogRepository');

router.get('/', function(req, res, next) {
    const id = req.query.id;
    const engine = req.query.engine;

    if (!id || !engine) {
        res.send('Missing parameters id or engine');
        return;
    }

    const exchangeRepository = new ExchangeRepository().init();
    const engineRepository = new EngineRepository(new JsonDataDriver());
    const exchangeHistoryLogRepository = new ExchangeHistoryLogRepository(new JsonDataDriver());
    const exchangeErrorLogRepository = new ExchangeErrorLogRepository(new JsonDataDriver());

    const engineExecutor = new EngineExecutor(
        exchangeRepository,
        engineRepository,
        exchangeHistoryLogRepository,
        exchangeErrorLogRepository,
    );

    try {
        engineExecutor.executeByInstanceId(id, engine);
    } catch (e) {
        const engineErrorLogRepository = new EngineErrorLogRepository(new JsonDataDriver());

        engineErrorLogRepository.addLog('GENERAL ERROR', e);
    }

    res.send('respond with a resource');
});

module.exports = router;
