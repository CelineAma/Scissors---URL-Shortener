const express = require("express");
const mongoose = require ("mongoose")
const scissors = require('./models/scissors')
const dotenv = require("dotenv")
const morgan = require("morgan")
const axios = require('axios');
const fs = require('fs');

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

app.use((err, req, res, next) => {
    let errorMessage = "Internal Server Error";
    let statusCode = 500;
  
    // Check the type of error and customize the error message and status code
    if (err instanceof mongoose.Error.ValidationError) {
      errorMessage = "Validation Error";
      statusCode = 400;
    } else if (err instanceof mongoose.Error.CastError) {
      errorMessage = "Invalid ID";
      statusCode = 400;
    } else if (err.status === 404) {
      errorMessage = "Not Found";
      statusCode = 404;
    }
  
    // Render the error.ejs template with the error message
    res.status(statusCode).render('error', { errorMessage });
  });
  


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


// Filter the URLs based on the search query
// const filteredUrls = allUrls.filter(url => url.fullUrl.includes(searchQuery));


// Sorting logic criteria (fullUrl, shortUrl and Clicks)
const sortCriteria = req.query.sort || ''; // Get the selected sorting criteria from the query parameter

let sortOptions = {};

    if (sortCriteria === 'fullUrl') {
      sortOptions = { fullUrl: 1 }; // Sort by fullUrl ascending
    } else if (sortCriteria === 'shortUrl') {
      sortOptions = { shortUrl: 1 }; // Sort by shortUrl ascending
    } else if (sortCriteria === 'clicks') {
      sortOptions = { clicks: -1 }; // Sort by clicks descending
    }

const allUrls = await scissors.find(query).sort(sortOptions);
const totalPages = Math.ceil(totalCount / perPage);
const scissorsUrl = allUrls.slice(startIndex, endIndex);
//   const scissorsUrl = await scissors.find().skip(startIndex).limit(perPage);

// Retrieve the filter criteria from the query parameters
const filterCriteria = req.query.filterCriteria;

// Build the filter query based on the selected criteria
let filterQuery = {};

if (filterCriteria === 'fullUrl') {
    filterQuery = { /* Add filter condition for fullUrl */ };
} else if (filterCriteria === 'shortUrl') {
    filterQuery = { /* Add filter condition for shortUrl */ };
} else if (filterCriteria === 'clicks') {
    filterQuery = { /* Add filter condition for clicks */ };
}

// Retrieve the filtered URLs from the database
const filteredUrls = await scissors.find(filterQuery);

console.log('scissors:', scissors);

// Pass the retrieved URLs and pagination information to the index.ejs template
  res.render('index', { 
    scissorsUrl: scissorsUrl, 
    currentPage: page, 
    totalPages: totalPages,
    searchQuery: searchQuery,
    selectedSort: sortCriteria,
    filteredUrls: filteredUrls, // Add filteredUrls to the render parameters
  filterCriteria: filterCriteria, // Pass the filter criteria to the render parameters
  scissors: scissors,
    errorMessage: null, // Initialize the errorMessage variable with null
});
    
}
catch (err) {
  // Handle any errors that occur during the retrieval
  console.error('Error retrieving URLs:', err);
  res.status(500).render('index', {
    scissorsUrl: [],
    currentPage: 1,
    totalPages: 1,
    searchQuery: searchQuery,
    selectedSort: sortCriteria,
    filteredUrls: filteredUrls, // Add filteredUrls to the render parameters
  filterCriteria: filterCriteria, // Pass the filter criteria to the render parameters
  scissors: scissors,
    errorMessage: 'Error retrieving URLs. Please try again later.', // Set the error message; Internal Server Error
});
}
});



// Function to generate a unique short URL
function generateShortUrl() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8;
    let shortUrl = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      shortUrl += characters.charAt(randomIndex);
    }
    
    return shortUrl;
  };


  // Generate QR code and provide download option
app.get('/qr/:scissors', async (req, res) => {
    try {
      const scissor = await scissors.findOne({ shortUrl: req.params.scissors });
  
      // When the short URL doesn't exist
      if (scissor === null) {
        return res.status(404).send('Short URL not found');
      }
  
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        scissor.fullUrl
      )}&size=300x300`;

      const response = await axios.get(qrCodeUrl, { responseType: 'stream' });
    
  
      // Set the response headers for downloading the QR code image
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename=${scissor.shortUrl}.png`);
  
      // Pipe the image stream to the response object
      response.data.pipe(res);
    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).send('Failed to generate QR code');
    }
  });
  
  


//Update custom URLs (Creating new short url)
app.post('/scissorsUrl', async(req, res) => {
// await scissors.create({ fullUrl: req.body.fullUrl})  
//creating a new short url

const { fullUrl, customUrl } = req.body;

  try {
// Generate a unique custom URL
const uniqueCustomUrl = await generateUniqueCustomUrl(customUrl);

    // Check if the custom URL is already taken
    const existingUrl = await scissors.findOne({ customUrl: uniqueCustomUrl });
    if (existingUrl) {

        console.log('Custom URL conflict. Generated unique custom URL:', uniqueCustomUrl);
    // Use the generated unique custom URL instead
      return res.status(400).json({ error: 'Custom URL already taken', uniqueCustomUrl });
    }

    // Generate a new shortened URL
    const shortUrl = generateShortUrl();

    // Create a new instance of the scissors model
    const newUrl = new scissors({
        fullUrl,
        shortUrl,
        customUrl: uniqueCustomUrl, // Store the custom URL in the database
      });
  
      // Save the new URL to the database
      await newUrl.save();
  

res.redirect('/')  //then redirect back to the homepage when done.
} catch (error) {
    console.error('Error creating new URL:', error);
    res.status(500).json({ error: 'Failed to create shortened URL' });
  }
});


// Function to generate a unique custom URL by appending a suffix
async function generateUniqueCustomUrl(customUrl) {
    let newCustomUrl = customUrl;
    let counter = 1;
    while (await scissors.findOne({ customUrl: newCustomUrl })) {
      newCustomUrl = `${customUrl}-${counter}`;
      counter++;
    }
    return newCustomUrl;
  }


//GET urls
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