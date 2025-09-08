const Rate = require('../../models/rates');

async function getAll(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const rates = await Rate.find({}, { rate: 1, currency: 1, name: 1, createdAt: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .limit(10)
        .skip(skip)
        .exec();

    const totalRates = await Rate.countDocuments();
    
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

module.exports = getAll;