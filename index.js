require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

let urlDatabase = {};  
let urlCount = 1;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  try {
    const urlObj = new URL(originalUrl);
    dns.lookup(urlObj.hostname, (err, address) => {
      if (err || !address) {
        return res.json({ error: 'invalid url' });
      }
      
      urlDatabase[urlCount] = originalUrl;
      res.json({ original_url: originalUrl, short_url: urlCount });
      urlCount++;
    });
  } catch (e) {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];
  
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found' });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
