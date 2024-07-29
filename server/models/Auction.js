const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    },
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: { 
        type: Date, 
        required: true 
    },
    startingPrice: { 
        type: Number, 
        required: true 
    },
    bids: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bid' 
    }],
    status: { 
        type: String, 
        required: true }
});

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;