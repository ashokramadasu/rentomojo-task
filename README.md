# NodeJS developer task of rentomojo

Node WebScraping REST API using Mongoose, Express and Cheerio.

## Requirements

- [Node and npm](http://nodejs.org)

## Installation

1. Clone the repository: `git clone https://github.com/ashokramadasu/rentomojo-task`
2. Install the application: `cd rentomojo-task && npm install`
3. Place your own MongoDB URI with Database name in `config.js`
4. Start the server:  `npm start` or `node server.js`


## Usage of API

1. make requests to rest api using Postman/Browser at  `https://rentomojo-task.herokuapp.com/getLinks` or `http://localhost:3000/getLinks`
2. Available GET Apis are `/getLinks` only.
3. Default Scraping url is medium website url. 
4. If you want scrape other website replace `<website-url>` part with other website Url `https://rentomojo-task.herokuapp.com/getLinks?url=<website-url>` or `http://localhost:3000/getLinks?url=<website-url>`
5. Tested for google.com `https://rentomojo-task.herokuapp.com/getLinks?url=https://google.com`
6. Suggestions always welcome. Have a nice day.
