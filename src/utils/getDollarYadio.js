const Rate = require('../models/rates');

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

module.exports = getDollarYadio;