const express = require('express')
    ,request = require('request')
    ,throttledRequest = require('throttled-request')(request)
    ,cheerio = require('cheerio')
    ,app = express();
 
throttledRequest.configure({
    requests: 5,
    milliseconds: 1000
});//This will throttle the requests so no more than 5 are made every second

app.get('/getLinks', function (req, res) {
    let url = 'https://medium.com/';

    request(url, function (error, response, html) {
        if (!error) {            let $ = cheerio.load(html.toString());

            let result = []
            $("a").each((i, link) => {
                // result.push($(link).attr("href"))
                let scrapedUrl = $(link).attr("href").split('?');
                console.log(scrapedUrl)
                let urlPart = scrapedUrl[0];
                let Params = (scrapedUrl[1]) ? scrapedUrl[1].split('&') : [];
                console.log('Params',Params)
                let paramsPart = [...new Set(Params)];
                result.push(urlPart)


            });

            let urls = new Map([...new Set(result)].map(
                x => [x, result.filter(y => y === x).length]
            ));
            console.log(urls);
            res.send(urls);
        };
    });
})

app.listen('3000')
console.log('Express Server listening on port 3000');
exports = module.exports = app;