var express = require('express');
var router = express.Router();
const { 
  getAll, getAllByCurrency, getOne, getTodayRates
} = require('../controllers/rates');

router.get('/', getAll);
router.get('/today', getTodayRates);
router.get('/:currency/all', getAllByCurrency);
router.get('/:currency', getOne);

module.exports = router;
