const Rate = require('../../models/Rate');
const obtenerValoresBCV = require('../../utils/getBCVvalues');
const getDollarYadio = require('../../utils/getDollarYadio');

export default async function handler(req, res) {
   const { euro: euroBVC, dollar: dollarBCV } =  await obtenerValoresBCV();

    await Rate.create([
      { rate: dollarBCV, currency: 'BCV_USD', name: 'Dólar' },
      { rate: euroBVC, currency: 'BCV_EUR', name: 'Euro' }
    ]);
    console.log(`Rates saved: Euro BCV: ${euroBVC}, Dollar BCV: ${dollarBCV}`);
    
    // Obtener el dólar Yadio inmediatamente después de obtener los valores BCV
    getDollarYadio();
}