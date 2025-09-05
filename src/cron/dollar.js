const cron = require('node-cron');
const Rate = require('../models/rates');
const obtenerValoresBCV = require('../utils/getBCVvalues');

// You can import your Mongoose models here to interact with the database.
// For example: const MyModel = require('../models/MyModel');

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

  cron.schedule('0 6 * * *', async () => {
    const { euro: euroBVC, dollar: dollarBCV } =  await obtenerValoresBCV();
    const dollarYadio = fetch('https://api.yadio.io/rate/ves/usd');
    
    dollarYadio.then(response => response.json())
      .then(async (data) => {
        const dollarYadioValue = Number(data.rate).toFixed(2);

        await Rate.create({ rate: dollarYadioValue, currency: 'YD_USD' });

        return res.json({
          euro: euroBVC, 
          dollarBCV, 
          dollarYadio: dollarYadioValue
        });
      })
      .catch(() => res.json({
        euro: euroBVC, 
        dollarBCV, 
        dollarYadio: 'Error fetching Yadio API' 
      }));
  });

  // Add more scheduled tasks as needed
  // cron.schedule('0 0 * * *', () => {
  //   console.log('Running a task every day at midnight');
  // });
};

module.exports = initCronJobs;