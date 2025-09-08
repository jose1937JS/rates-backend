const express = require('express');
const router = express.Router();
const Rate = require('../models/rates');
const obtenerValoresBCV = require('../utils/getBCVvalues');

router.get('/', async (req, res) => {
  const { euro: euroBVC, dollar: dollarBCV } =  await obtenerValoresBCV();
  let dollarYadioValue;

  await Rate.create([
    { rate: dollarBCV, currency: 'BCV_USD', name: 'Dólar' },
    { rate: euroBVC, currency: 'BCV_EUR', name: 'Euro' }
  ]);

  console.log(`Rates saved: Euro BCV: ${euroBVC}, Dollar BCV: ${dollarBCV}`);
  
  fetch('https://api.yadio.io/rate/ves/usd')
  .then(response => response.json())
  .then(async (data) => {
    dollarYadioValue = Number(data.rate).toFixed(2);

    await Rate.create({ rate: dollarYadioValue, currency: 'YD_USD', name: 'USDT' });

    console.log(`Rate saved: Dollar Yadio: ${dollarYadioValue}`);

    return res.json({
      message: 'Rates updated successfully',
      rates: { euroBVC, dollarBCV, dollarYadioValue }
    });
  })
  .catch(() => console.error('Error fetching Yadio rate'));
});

module.exports = router;
