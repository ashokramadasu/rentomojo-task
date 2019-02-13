'use strict'

const express     = require('express')
    , request     = require('request')
    , rp          = require('request-promise')
    , cheerio     = require('cheerio')
    , mongoose    = require('mongoose')
    , helmet      = require('helmet')
    , config      = require('./config')
    , URL         = require('url')
    , schema      = require('./model')
    , app         = express();

// configuration ===========================================================
// Express Middleware settings
app.use(helmet());

// Connect to mlab remote MongoDB instance.
let urlModel;

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
    let uri = 'https://medium.com/';
    let html = await rp.get(uri);

    let $ = cheerio.load(html.toString());
    let result = []

    $("a").each((i, link) => {
        let u = URL.parse($(link).attr("href"), true);
        let params = Object.keys(u.query);
        let url = u.href.split('?')[0];
        result.push({ url, params});
    });

    let data = await ([...new Set(result.map(x => x.url))].map(
        x => { return {
            url: x, 
            reference_count: result.filter(y => y.url === x).length, 
            params: result.find(z => z.url === x).params,
           } 
        }
    ));

    let dbResponse = await urlModel.collection.insertMany(data);
    res.status(200).json(dbResponse.ops);

};



app.get('/getLinks', getLinks);

app.listen('3000', init);
console.log('Express Server listening on port 3000');
exports = module.exports = app;