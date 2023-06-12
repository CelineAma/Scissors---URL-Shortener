const express = require("express");
const mongoose = require ("mongoose")
const scissors = require('./models/scissors')
const dotenv = require("dotenv")
const morgan = require("morgan")

const app = express();

dotenv.config()


//set up the mongodb database
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rx9tubi.mongodb.net/Scissors`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//set up and connect the ejs folder
app.set('view engine', 'ejs')

//set app for url parameters
app.use(express.urlencoded({extended: false}))


// Logging middleware
app.use(morgan('dev'));


//creating the route endpoint
//search functionality(get method) 
app.get('/', async (req, res) => {
//    const scissorsUrl = await scissors.find()
// res.render('index', {scissorsUrl: scissorsUrl})

const searchQuery = req.query.search || ''; // Extract the search query parameter or set it to an empty string if not provided

const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter, default to page 1

// Calculate the starting and ending indexes for the URLs based on the page number and 10 URLs per page
const perPage = 10;
const startIndex = (page - 1) * perPage;
const endIndex = page * perPage;

try {
  // Retrieve the URLs from the database or data source based on the calculated indexes

  let query = {};

  if (searchQuery) {
    query = {
      $or: [
        { fullUrl: { $regex: searchQuery, $options: 'i' } },
        { shortUrl: { $regex: searchQuery, $options: 'i' } }
      ]
    };
  }

  const totalCount = await scissors.countDocuments(query);

  const allUrls = await scissors.find(query).skip(startIndex).limit(perPage);
  const scissorsUrl = allUrls.slice(startIndex, endIndex);
//   const scissorsUrl = await scissors.find().skip(startIndex).limit(perPage);


// Filter the URLs based on the search query
const filteredUrls = allUrls.filter(url => url.fullUrl.includes(searchQuery));


// Pass the retrieved URLs and pagination information to the index.ejs template
  res.render('index', { 
    scissorsUrl: scissorsUrl, 
    currentPage: page, 
    totalPages: Math.ceil(allUrls.length / perPage),
    searchQuery: searchQuery,
});
    
}
catch (err) {
  // Handle any errors that occur during the retrieval
  console.error('Error retrieving URLs:', err);
  res.status(500).send("Internal Server Error"); // Internal Server Error
}
});


//Update Full URLs
app.post('/scissorsUrl', async(req, res) => {
await scissors.create({ fullUrl: req.body.fullUrl})  //creating a new short url

res.redirect('/')  //then redirect back to the homepage when done.
})

app.get('/:scissors', async (req, res) => {
 const scissor = await scissors.findOne({shortUrl: req.params.scissors})

 //when user enters url that doesn't exist
 if (scissor === null){
    return res.status(404).send("Short URL not found");
 }

 scissor.clicks++
 await scissor.save()

 res.redirect(scissor.fullUrl)
})

//mongodb should be connected before server starts
mongoose.connection.on('open', () => {
app.listen(process.env.PORT || 8000, () => {
    console.log("Server started and MongoDB connected successfully")
});

})