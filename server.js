const express = require('express');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/url', (req, res) => {
  const url = req.query.url;
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(body);
      const links = [];
      $('a').each((i, el) => {
        const link = $(el).attr('href');
        links.push(link);
      });
      res.send({ links });
    } else {
      console.error(error);
      res.status(500).send('Error extracting links');
    }
  });
});

app.listen(3000, () => {
  console.log('App is listening');
});
