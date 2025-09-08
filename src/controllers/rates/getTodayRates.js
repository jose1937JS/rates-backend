const Rate = require('../../models/rates');

async function getTodayRates(req, res) {
  try {
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

    // Si falta BCV_EUR o BCV_USD, buscar en el día anterior
    if (!bcvEur || !bcvUsd) {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const startOfYesterday = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate()
      );
      const endOfYesterday = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        23, 59, 59, 999
      );
      const ratesYesterday = await Rate.find({
        createdAt: {
          $gte: startOfYesterday,
          $lte: endOfYesterday
        },
        currency: { $in: ["BCV_EUR", "BCV_USD"] }
      }, {
        rate: 1,
        currency: 1,
        _id: 0,
        name: 1,
        createdAt: 1
      })
      .sort({ createdAt: -1 })
      .exec();

      if (!bcvEur) {
        bcvEur = ratesYesterday.find(r => r.currency === "BCV_EUR");
      }
      if (!bcvUsd) {
        bcvUsd = ratesYesterday.find(r => r.currency === "BCV_USD");
      }
    }

    // Solo devolver los que existan
    const result = [ydUsd, bcvEur, bcvUsd].filter(Boolean);

    return res.json(result);
  } catch (error) {
    console.error('Error fetching rate by currency:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getTodayRates;