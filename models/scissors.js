const mongoose = require('mongoose')
const shortId = require('shortid')

shortId.generate()

const scissorsSchema = new mongoose.Schema({
    fullUrl: {
        type: String,
        date: {type: String, default: Date.now},
        required: true
    },

    shortUrl: {
        type: String,
        date: {default: Date.now},
        required: true,
        default: shortId.generate
    },

    userId: { 
        type: String, 
        default: ''
    },

    clicks: {
        type: Number,
        required: true,
        default: 0
    },

    customUrl: {
        type: String,
        unique: true,
      },
})

module.exports = mongoose.model('scissors', scissorsSchema)