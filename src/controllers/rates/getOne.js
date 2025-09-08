const Rate = require('../../models/rates');

async function getOne(req, res) {
  try {
    const { currency } = req.params;
    
    if (!currency) {
      return res.status(400).json({ error: 'Currency parameter is required' });
    }

    const rate = await Rate.findOne({ currency }, { rate: 1, currency: 1, _id: 0, name: 1, createdAt: 1 }).sort({ createdAt: -1 });
    if (!rate) {
      return res.status(404).json({ error: 'No rate found for the specified currency' });
    }

    return res.json(rate);
  } catch (error) {
    console.error('Error fetching rate by currency:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getOne;