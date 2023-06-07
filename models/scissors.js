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
        date: {type: String, default: Date.now},
        required: true,
        default: shortId.generate
    },

    clicks: {
        type: String,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('scissors', scissorsSchema)