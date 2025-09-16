var express = require('express');
var router = express.Router();

const bcv = require('../cron/vercel/bcv')
const yadio = require('../cron/vercel/yadio')

router.get('/bcv', bcv);
router.get('/yadio', yadio);

module.exports = router