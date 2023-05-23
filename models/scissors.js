const mongoose = require('mongoose')
const shortId = require('shortid')

shortId.generate()

const scissorsSchema = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },

    shortUrl: {
        type: String,
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