const Rate = require('../../models/rates');

async function getAllByCurrency(req, res) {
  try {
    const { currency } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    if (!currency) {
      return res.status(400).json({ error: 'Currency parameter is required' });
    }

    const rates = await Rate.find({ currency }, { rate: 1, createdAt: 1, name: 1, _id: 0, currency: 1 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const totalRates = await Rate.countDocuments({ currency });
    
    const paginationInfo = {
      currentPage: page,
      totalPages: Math.ceil(totalRates / limit),
      totalItems: totalRates,
      itemsPerPage: limit,
    }
    
    return res.json({ rates, pagination: paginationInfo });
  } catch (error) {
    console.error('Error fetching rates:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getAllByCurrency;