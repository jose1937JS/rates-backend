const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    rate: Number, 
    currency: String
}, {
    timestamps: true,
    collection: 'rates'
});

const Rate = mongoose.model('Rate', schema);
module.exports = Rate;