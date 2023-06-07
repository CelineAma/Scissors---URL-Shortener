const express = require("express");
const mongoose = require ("mongoose")
const scissors = require('./models/scissors')
const dotenv = require("dotenv")
const app = express();

dotenv.config()


//set up the mongodb database
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rx9tubi.mongodb.net/Scissors`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//set up the ejs folder
app.set('view engine', 'ejs')

//set app for url parameters
app.use(express.urlencoded({extended: false}))


//creating the route endpoint 
app.get('/', async (req, res) => {
   const scissorsUrl = await scissors.find()
res.render('index', {scissorsUrl: scissorsUrl})
});

app.post('/scissorsUrl', async(req, res) => {
await scissors.create({ fullUrl: req.body.fullUrl})  //creating a new short url

res.redirect('/')  //then redirect back to the homepage when done.
})

app.get('/:scissors', async (req, res) => {
 const scissor = await scissors.findOne({scissors: req.params.scissors})

 //when user enters url that doesn't exist
 if (scissor == null)
    return res.sendStatus(404)

 scissor.clicks++
 scissor.save()

 res.redirect(scissors.fullUrl)
})

//mongodb should be connected before server starts
mongoose.connection.on('open', () => {
app.listen(process.env.PORT || 8000, () => {
    console.log("Server started and MongoDB connected successfully")
});

})