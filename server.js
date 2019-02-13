const express     = require('express')
    , request     = require('request')
    , rp          = require('request-promise')
    , cheerio     = require('cheerio')
    , mongoose    = require('mongoose')
    , config      = require('./config')
    , URL         = require('url')
    , app         = express();

     mongoose.createConnection(config.MongoURI, { useNewUrlParser: true })
     .then(conn => {
        console.log('conn', conn);
     })
     .catch(err => {
         console.log('err', err);
     })


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

    res.send(data);

};



app.get('/getLinks', getLinks);

app.listen('3000')
console.log('Express Server listening on port 3000');
exports = module.exports = app;