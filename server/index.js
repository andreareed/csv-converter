//Imports
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const csv = require('csvtojson');
const fs = require('fs');

const app = express();
const upload = multer().single('csvFile');
app.use(express.static(`${__dirname}/../build`));

//API Endpoints
app.post('/api/convert', upload, async (req, res) => {
  return csv({ noheader: false })
    .fromString(req.file.buffer.toString())
    .then(lines => {
      // for (let line of lines) {
      //   Do something with each line
      // }
      fs.writeFile('public/download.json', JSON.stringify(lines), function(error) {
        if (error) {
          res.status(422).json({ error });
        }
        res.status(200).json(lines[0]);
      });
    });
});

const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

//Shhh Listen...
app.listen(5250, () => console.log(`Up and running on port 5250`));
