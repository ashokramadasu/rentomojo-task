const express = require('express')
    ,request = require('request')
    ,cheerio = require('cheerio')
    ,app = express();

app.get('/getLinks', function (req, res) {
    let url = 'https://medium.com/';

    request(url, function (error, response, html) {
        if (!error) {
            let $ = cheerio.load(html.toString());
            let result = []
            $("a").each((i, link) => {
                result.push($(link).attr("href"))
            });
            res.send(result);
        };
    });
})

app.listen('3000')
console.log('Express Server listening on port 3000');
exports = module.exports = app;