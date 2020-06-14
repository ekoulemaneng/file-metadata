// File system module
const fs = require('fs');

// Require Express et set an instance
const express = require('express');
const app = express();
//--------

// Static files
app.use(express.static('public'));
//--------

// Module to parse sent form data 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//--------

// Module to allow others domains to communicate with this server
const cors = require('cors');
app.use(cors());
//--------

// Module to handle uploaded file
const fileUpload = require('express-fileupload');
app.use(fileUpload({createParentPath: true}));
// Set routes

app.get('/', (req, res) => res.send("/public/index.html"));

app.post('/api/fileanalyse', async (req, res) => {
  if (!req.files) res.send('No file uploaded');
  else {
    let file = await req.files.upfile;
    file.mv('./files/' + file.name);
    res.json({name: file.name, type: file.mimetype, size: file.size, md5: file.md5});
    fs.unlink('./files/' + file.name, (err) => {if (err) console.log(err)});
  }
}); 

app.use((err, req, res, next) => res.status(500).send('Something broke!'));

app.use((req, res, next) => res.status(404).send('Sorry cant find that!'));

app.listen(3000);



