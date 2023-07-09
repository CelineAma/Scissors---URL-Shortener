# Scissors

### Brief is the new black, this is what inspires the team at Scissor. In today’s world, it’s important to keep things as short as possible, and this applies to more concepts than you may realize. From music, and speeches, to wedding receptions, the brief is the new black. Scissor is a simple tool that makes URLs as short as possible. Scissor thinks it can disrupt the URL-shortening industry and give the likes of bit.ly and ow.ly a run for their money within 2 years.

## Project Description
The Scissor is a web application that allows users to generate and manage short URLs. It provides a convenient way to shorten long URLs and track their usage statistics. The application is built using Node.js, Express, and MongoDB.

Built a Capstone Project at [Altschool Africa School of Engineering - Backend (Node.js track)](https://www.altschoolafrica.com/schools/engineering)

## Requirements And Implementation Guide:
### - URL Shortening:
Scissor allows users to shorten URLs by pasting a long URL into the Scissor platform and a shorter URL gets automatically generated. The shortened URL is designed to be as short as possible, making it easy to share on social media or other channels.
### - Custom URLs:
Scissor also allows users to customize their shortened URLs. Users can choose their own custom domain name and customize the URL to reflect their brand or content. This feature is particularly useful for individuals or small businesses who want to create branded links for their 
### - QR Code Generation:
Scissor allows users to also generate QR codes for shortened URLs. Users can download and use the QR code image in their promotional materials or/or on their website. This feature will be implemented using a third-party QR code generator API, which can be integrated into the Scissor platform.
### - Analytics:
Scissor provides basic analytics that allows users to track their shortened URL's performance. Users can see how many clicks their shortened URL has received and where the clicks are coming from. We need to track when a URL is used.
### - Link History:
Scissor allows users to see the history of links they’ve created so they can easily find and reuse links they have previously created.

## Project Feature
* User Registration: Users can create an account to manage their shortened URLs.
* URL Shortening: Users can generate short URLs for long web addresses.
* Click Tracking: The service tracks the number of clicks for each short URL.
* API endpoints for creating, retrieving, and deleting shortened URLs.
* Error Handling: Proper error handling and responses are implemented for a better user experience.
* OpenAPI Documentation: API endpoints, request/response structures, and authentication mechanisms are documented using stoplight.io.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See **Installation** for detailed steps on how to install the application.

## Technologies Used
* Node.js (Javascript Runtime Environment)
* Express (Server Framework)
* MongoDB
* Mongoose
* Morgan
* ShortId
* UUID
* Valid-URL
   
## Prerequisites
To start this application, kindly install [node](https://nodejs.org/en/download/) on your device and register/login to [MongoDB Atlas](https://account.mongodb.com/) 

## Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/CelineAma/Scissors---URL-Shortener
   ```
2. **Install dependencies:**
   ```bash
   cd Scissors
   npm install
   ```
3. **Configure the environment variables:**

* Create a .env file in the root directory of the project.
* Copy the contents from .env.example into the .env file.
* Modify the values of the environment variables according to your configuration.

4. **Start the application:**
   ```bash
   npm run dev
   ```
5. Access the application at [http://localhost:8000] (http://localhost:8000) in your web browser.

## Usage
* Enter a long URL in the provided input field.
* Optionally, customize the shortened URL with a custom alias.
* Click the "Scissor" button to generate the shortened URL.
* Copy the shortened URL and share it with others.
* Track the number of clicks on each shortened URL in your account table.
* Enter the short URL to the provided input field for generating the QR code.
* Click the "Generate QR Code" button to render the code.
* Click the "Download QR Code" button to download the png file.

## Security
The Scissors include various security measures to protect user data and prevent unauthorized access. These measures include:

* *Authorization* and access control: Users can only view, create, and manage their own shortened URLs. The service implements access control mechanisms to prevent unauthorized access.
* *Input validation* and sanitization: User input is thoroughly validated and sanitized to prevent common security vulnerabilities, such as SQL injection and cross-site scripting (XSS) attacks.
* *Rate limiting:* The service applies rate limiting to prevent abuse and mitigate the impact of malicious activities.
* *Secure communication:* The service uses HTTPS to encrypt data transmitted between clients and servers, ensuring the confidentiality and integrity of user data.

## Troubleshooting
If you encounter any issues or errors while using the URL shortener service, consider the following troubleshooting steps:

* Check the application logs for any error messages or stack traces that may indicate the cause of the issue.
* Verify that the required dependencies and environment variables are properly configured.
* Ensure that the database connection is established and functioning correctly.
* Check for any recent code changes or updates that may have introduced bugs or compatibility issues.
* If the issue persists, consider opening a new issue in the project's issue tracker with detailed information about the problem, including error messages, steps to reproduce, and any relevant code snippets

***Contributions and feedback are welcome!***

## Roadmap
The following features and improvements are planned for future releases:

* User profile authentication, management, and settings
* Analytics and statistics for shortened URLs
* Integration with third-party authentication providers
* Bulk URL shortening
* Customizable URL expiration and deletion policies
* URL preview and verification before shortening
* Social sharing options for shortened URLs
* Integration with URL validation and scanning services
* URL categorization and tagging
* User-friendly error pages and error handling
* Multi-language support
* API rate limiting and access control
Please note that this roadmap is subject to change and may be updated based on user feedback and project priorities.

## Deployment
[Scissors](https://scissors-s7o9.onrender.com/)

## Authors/Credits
The Scissors App is developed and maintained by [AMARACHI CELINE ARINZE](https://github.com/CelineAma)

## Acknowledgements 
AltSchool Africa
