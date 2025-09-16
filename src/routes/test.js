const express = require('express');
const router = express.Router();
const Rate = require('../models/rates');
const obtenerValoresBCV = require('../utils/getBCVvalues');

const getTodayRates = async () => {
  const today = new Date();

  const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23, 59, 59, 999
    );
    
    const rates = await Rate.find({
      createdAt: { 
        $gte: startOfToday,
        $lte: endOfToday
      }
    }, { 
      rate: 1, 
      currency: 1, 
      _id: 0, 
      name: 1,
      createdAt: 1 
    })
    .sort({ createdAt: -1 })
    .exec();

    // Filtrar solo los rates requeridos
    const filtered = rates.filter(r => ["YD_USD", "BCV_EUR", "BCV_USD"].includes(r.currency));

    // Obtener el YD_USD más reciente
    const ydUsd = filtered.find(r => r.currency === "YD_USD");

    // Obtener el BCV_EUR más reciente
    let bcvEur = filtered.find(r => r.currency === "BCV_EUR");

    // Obtener el BCV_USD más reciente
    let bcvUsd = filtered.find(r => r.currency === "BCV_USD");

    // Solo devolver los que existan
    const result = [ydUsd, bcvEur, bcvUsd].filter(Boolean)

    return result;
}

router.post('/', async (_, res) => {
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

    // get rates from db
    const rates = await getTodayRates();

    return res.json({
      message: 'Rates updated successfully',
      rates
    });
  })
  .catch((error) => {
    console.error('Error fetching Yadio rate', error)
    return res.status(500).json("Ha habido un error obteniendo los datos del USDT")
  });
});

module.exports = router;
