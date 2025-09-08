const cron = require('node-cron');
const Rate = require('../models/rates');
const obtenerValoresBCV = require('../utils/getBCVvalues');

const initCronJobs = () => {
  // Cron expression:
  // * * * * * *
  // | | | | | |
  // | | | | | - day of week (0 - 7) (0 and 7 are Sunday)
  // | | | | --- month (1 - 12)
  // | | | ----- day of month (1 - 31)
  // | | ------- hour (0 - 23)
  // | --------- minute (0 - 59)
  // ----------- second (0 - 59) (optional)

  const getDollarYadio = () => {
    fetch('https://api.yadio.io/rate/ves/usd')
    .then(response => response.json())
    .then(async (data) => {
      const dollarYadioValue = Number(data.rate).toFixed(2);

      await Rate.create({ rate: dollarYadioValue, currency: 'YD_USD', name: 'USDT' });

      console.log(`Rate saved: Dollar Yadio: ${dollarYadioValue}`);
    })
    .catch(() => console.error('Error fetching Yadio rate'));
  };

  // se ejecuta todos los días a las 6:00 AM
  cron.schedule('0 0 6 * *', async () => {
    const { euro: euroBVC, dollar: dollarBCV } =  await obtenerValoresBCV();

    await Rate.create([
      { rate: dollarBCV, currency: 'BCV_USD', name: 'Dólar' },
      { rate: euroBVC, currency: 'BCV_EUR', name: 'Euro' }
    ]);
    console.log(`Rates saved: Euro BCV: ${euroBVC}, Dollar BCV: ${dollarBCV}`);
    
    // Obtener el dólar Yadio inmediatamente después de obtener los valores BCV
    getDollarYadio();
  });

  // se ejecuta cada 4 horas
  cron.schedule('0 0 */4 * * *', () => {
    getDollarYadio();
  });
};

module.exports = initCronJobs;