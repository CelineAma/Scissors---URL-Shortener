const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const scissors = require("./models/scissors");
const connectToMongoDB = require("./config/db");

const morgan = require("morgan");
const shortId = require("shortid");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const fs = require("fs");
const methodOverride = require("method-override");
const rateLimit = require("express-rate-limit");
const sessionMiddleware = require("./middlewares/sessionMiddleware"); // Import session middleware
const { saveToSession } = require("./helpers");
const User = require("./models/userModel");

const app = express();

//set up and connect the ejs folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session middleware
app.use(sessionMiddleware);

//set app for url parameters
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use(morgan("dev"));

// Add the cookie-parser middleware
app.use(cookieParser());

// Enable method override for DELETE functionality
app.use(methodOverride("_method"));

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
  res.status(statusCode).render("error", { errorMessage });
});

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs
});

app.use(limiter);

//creating the route endpoint
//search functionality(get method)
app.get("/", async (req, res) => {
  const session = req.session;
  let userId = session.userId;
  let user;
  if (!userId) {
    userId = uuidv4(); // creates a unique string as the userId
    session.userId = userId; // saves the userId in session
    saveToSession(session);
    user = await User.create({ userId }); // creates a new user in the DB with the userId
    console.log("New user onboarded! 🎉🎉🎉");
  } else {
    console.log("Welcome back! 🍿");
    user = await User.findOne({ userId }); // gets the user associated with the userId stored in the session
  }

  // ///////////////////////////////////////////////////////
  //    const scissorsUrl = await scissors.find()
  // res.render('index', {scissorsUrl: scissorsUrl})

  const searchQuery = req.query.search || ""; // Extract the search query parameter or set it to an empty string if not provided

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
          { fullUrl: { $regex: searchQuery, $options: "i" } },
          { shortUrl: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalCount = await scissors.countDocuments(query);

    // Filter the URLs based on the search query
    // const filteredUrls = allUrls.filter(url => url.fullUrl.includes(searchQuery));

    // Sorting logic criteria (fullUrl, shortUrl and Clicks)
    const sortCriteria = req.query.sort || ""; // Get the selected sorting criteria from the query parameter

    let sortOptions = {};

    if (sortCriteria === "fullUrl") {
      sortOptions = { fullUrl: 1 }; // Sort by fullUrl ascending
    } else if (sortCriteria === "shortUrl") {
      sortOptions = { shortUrl: 1 }; // Sort by shortUrl ascending
    } else if (sortCriteria === "clicks") {
      sortOptions = { clicks: -1 }; // Sort by clicks descending
    }

    const allUrls = await scissors
      .find({ userId: user._id, ...query })
      .sort(sortOptions);
    const totalPages = Math.ceil(totalCount / perPage);
    const scissorsUrl = allUrls.slice(startIndex, endIndex);
    //   const scissorsUrl = await scissors.find().skip(startIndex).limit(perPage);

    // Retrieve the filter criteria from the query parameters
    const filterCriteria = req.query.filterCriteria;

    // Build the filter query based on the selected criteria
    let filterQuery = {};

    if (filterCriteria === "fullUrl") {
      filterQuery = {
        /* Add filter condition for fullUrl */
      };
    } else if (filterCriteria === "shortUrl") {
      filterQuery = {
        /* Add filter condition for shortUrl */
      };
    } else if (filterCriteria === "clicks") {
      filterQuery = {
        /* Add filter condition for clicks */
      };
    }

    // Retrieve the filtered URLs from the database
    const filteredUrls = await scissors.find({
      userId: user._id,
      ...filterQuery,
    });

    // console.log('scissors:', scissors);

    // console.log(scissorsUrl.scissors, "clicked");

    // Pass the retrieved URLs and pagination information to the index.ejs template
    res.render("index", {
      scissorsUrl: scissorsUrl,
      currentPage: page,
      totalPages: totalPages,
      searchQuery: searchQuery,
      selectedSort: sortCriteria,
      filteredUrls: filteredUrls, // Add filteredUrls to the render parameters
      filterCriteria: filterCriteria, // Pass the filter criteria to the render parameters
      scissors: scissors,
      i: 0,
      errorMessage: null, // Initialize the errorMessage variable with null
    });
  } catch (err) {
    // Handle any errors that occur during the retrieval
    console.error("Error retrieving URLs:", err);
    res.status(500).render("index", {
      scissorsUrl: [],
      currentPage: 1,
      totalPages: 1,
      searchQuery: searchQuery,
      selectedSort: sortCriteria,
      filteredUrls: filteredUrls, // Add filteredUrls to the render parameters
      filterCriteria: filterCriteria, // Pass the filter criteria to the render parameters
      scissors: scissors,
      errorMessage: "Error retrieving URLs. Please try again later.", // Set the error message; Internal Server Error
    });
  }
});

// Generate QR code and provide download option
app.get("/qr/:scissors", async (req, res) => {
  try {
    const scissor = await scissors.findOne({ shortUrl: req.params.scissors });

    // When the short URL doesn't exist
    if (scissor === null) {
      return res.status(404).send("Short URL not found");
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      scissor.fullUrl
    )}&size=300x300`;

    const response = await axios.get(qrCodeUrl, { responseType: "stream" });

    // Set the response headers for downloading the QR code image
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${scissor.shortUrl}.png`
    );

    // Pipe the image stream to the response object
    response.data.pipe(res);
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).send("Failed to generate QR code");
  }
});

//Update custom URLs (Creating new short url)
app.post("/scissorsUrl", async (req, res) => {
  //creating a new short url
  try {
    const { fullUrl, customUrl } = req.body;
    const userId = req.session.userId;
    const user = await User.findOne({ userId });

    if (customUrl) {
      // Check if the custom URL is already taken
      const existingUrl = await scissors.findOne({
        customUrl,
      });
      if (existingUrl) {
        return res
          .status(400)
          .json({ error: "Custom URL already taken", customUrl });
      }
    }

    const urlAlias = customUrl || shortId.generate();
    const shortUrl = `${req.protocol}://${req.get("host")}/${urlAlias}`;

    // Create a new instance of the scissors model
    await scissors.create({
      fullUrl,
      shortUrl,
      customUrl: urlAlias, // Store the custom URL in the database
      userId: user._id, // Associate the user identifier with the URL
    });

    res.redirect("/"); //then redirect back to the homepage when done.
  } catch (error) {
    console.error("Error creating new URL:", error);
    res.status(500).json({ error: "Failed to create shortened URL" });
  }
});

//GET short urls
app.get("/:scissors", async (req, res) => {
  // Retrieve the userId from the user's cookies
  try {
    const scissor = await scissors.findOne({ customUrl: req.params.scissors });

    //when user enters url that doesn't exist
    if (!scissor) {
      return res.status(404).send("Short URL not found");
    }

    scissor.clicks++;
    await scissor.save();

    // Redirect the user to the full URL
    return res.redirect(scissor.fullUrl);
  } catch (error) {
    console.error("Error retrieving URL:", error);
    return res.status(500).send("Failed to retrieve URL");
  }
});

// DELETE route to handle URL deletion
app.delete("/urls/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;

  try {
    // Find the URL in the database
    const url = await scissors.findOne({ shortUrl });

    // If the URL doesn't exist, return a 404 error
    if (!url) {
      return res.redirect("/");
    }

    // Perform the deletion logic
    await scissors.deleteOne({ shortUrl });

    // Redirect to the homepage after successful deletion
    res.redirect("/");

    // // Return a response indicating success
    // res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ error: "Failed to delete URL" });
  }
});

//mongodb should be connected before server starts
const PORT = process.env.PORT || 8000;
connectToMongoDB()
  .then(() => {
    console.log("Connection to MongoDB is successful.");
    app.listen(PORT, "0.0.0.0", () => {
      console.log("Server running on port ->", PORT);
    });
  })
  .catch((error) => {
    console.log(
      error.message || error,
      "Connection to MongoDB was unsuccessful."
    );
  });
