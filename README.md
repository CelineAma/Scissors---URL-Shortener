# Scissor

### Brief is the new black, this is what inspires the team at Scissor. In today’s world, it’s important to keep things as short as possible, and this applies to more concepts than you may realize. From music, and speeches, to wedding receptions, the brief is the new black. Scissor is a simple tool that makes URLs as short as possible. Scissor thinks it can disrupt the URL-shortening industry and give the likes of bit.ly and ow.ly a run for their money within 2 years.

## Project Description
The Scissor is a web application that allows users to generate and manage short URLs. It provides a convenient way to shorten long URLs and track their usage statistics. The application is built using Node.js, Express, and MongoDB.

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
* Authentication: Users must authenticate to access certain features of the application.
* Error Handling: Proper error handling and responses are implemented for a better user experience.
* OpenAPI Documentation: API endpoints, request/response structures, and authentication mechanisms are documented using OpenAPI specification and stoplight.io.

## Technologies Used
* Node.js
* Express
* MongoDB
* Stoplight for API documentation
