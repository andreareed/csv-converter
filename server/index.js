//Imports
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const csv = require('csvtojson');
const fs = require('fs');
const moment = require('moment');
const cron = require('node-cron');

const app = express();
const upload = multer().single('csvFile');

cron.schedule('0 0 * * *', function() {
  console.log('------------Running Cron Job------------');
  fs.readdir(path.join(__dirname, '..', 'build', 'static', 'downloads'), async (err, files) => {
    if (err) {
      logger.log('Error getting files:', err);
      return;
    }

    try {
      for (let i = 0; i < files.length; ++i) {
        fs.unlink(path.join(__dirname, '..', 'build', 'static', 'downloads', files[i]), err => {
          if (err) throw err;
          console.log(`${files[i]} file succesfully deleted`);
        });
      }
    } catch (e) {
      console.error(e);
    }
  });
});

app.use(express.static(`${__dirname}/../build`));

//API Endpoints
app.post('/api/convert', upload, async (req, res) => {
  return csv({ noheader: false })
    .fromString(req.file.buffer.toString())
    .then(lines => {
      // for (let line of lines) {
      //   Do something with each line
      // }
      const filename = moment().toISOString();
      fs.writeFile(`${__dirname}/../build/static/downloads/${filename}.json`, JSON.stringify(lines, null, 2), function(
        error
      ) {
        if (error) {
          res.status(422).json({ error });
        } else {
          res.status(200).json({ filename, preview: lines[0] });
        }
      });
    });
});

const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

//Shhh Listen...
app.listen(5250, () => console.log(`Up and running on port 5250`));
