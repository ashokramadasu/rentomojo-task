'use strict'

const express     = require('express')
    , http        = require('http')
    , rp          = require('request-promise')
    , cheerio     = require('cheerio')
    , mongoose    = require('mongoose')
    , helmet      = require('helmet')
    , config      = require('./config')
    , URL         = require('url')
    , schema      = require('./model')
    , app         = express();

// configuration ===========================================================
// This will limit 5 concurrent Requests.
http.globalAgent.maxSockets = 5;
// Express Middleware settings
app.use(helmet());



let urlModel;
// Connect to mlab remote MongoDB instance.
let init  = async function () {
    try {
        const conn = await mongoose.createConnection(config.MongoURI, { useNewUrlParser: true })
        urlModel = conn.model('Url', schema);
    } catch(err) {
        console.log('err', err);
        process.exit(1);
    }
}

let getLinks = async function (req, res) {
    try {
        // takes website url passed in Query params. Default url is medium website Url 
        let uri = (req.query.url) ? (req.query.url) : (config.mediumUrl);
        let html = await rp.get(uri);
        // result array contains all urls and params as keys
        let result = []
        let $ = cheerio.load(html.toString());
        // using url module to get url and params from all the hyperlinks 
        $("a").each((i, link) => {
          let u = URL.parse($(link).attr("href"), true);
          let params = Object.keys(u.query);
          let url = u.href.split('?')[0];
          result.push({ url, params});
        });
        // takes result array as input and gives unique urls and its count
        let data = await ([...new Set(result.map(x => x.url))].map(
           x => { return {
            url: x, 
            reference_count: result.filter(y => y.url === x).length, 
            params: result.find(z => z.url === x).params,
           } 
        }));

        let dbResponse = await urlModel.collection.insertMany(data);
        res.status(200).json(dbResponse.ops);
    } catch(err){
        console.log('err', err);
        res.status(500).json({ status: 'FAIL', Error : err });    
    }
};


// getLinks route
app.get('/getLinks', getLinks);

// Server Listens and calls init function to make DB connection live.
app.listen(config.port, init);
console.log('Express Server listening on port ' + config.port);
exports = module.exports = app;