const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;
const SECRET_FILE = process.env.SECRET_STORAGE_FILE || 'answers.secret';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Route to render the form
app.get('/', (req, res) => {
  res.render('form');
});

// Route to handle form submission
app.post('/submit', (req, res) => {
  const answers = req.body;
  const data = JSON.stringify(answers);

  fs.appendFileSync(path.join(__dirname, SECRET_FILE), data + '\n', { encoding: 'utf8' });

  res.send("murakoze ubwo inkunga ya HANGAHUB YOSE IZACA KURI IYI CONTE <a href='/'>Go Back</a>");
});

// Route to display submitted answers
app.get('/answer', (req, res) => {
  const filePath = path.join(__dirname, SECRET_FILE);

  if (!fs.existsSync(filePath)) {
    return res.render('answers', { answers: [] });
  }

  const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n').filter(line => line.trim() !== '');
  const answers = lines.map(line => {
    try {
      return JSON.parse(line);
    } catch (e) {
      return {};
    }
  });

  res.render('answers', { answers });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
