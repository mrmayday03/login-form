const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/loginapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: '@#$@;lkj',
    resave: false,
    saveUninitialized: true 
}));

app.get('/', (req, res) => {
    res.send('Welcome to the login page!');
  });
  
  app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
  });
  
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || user.password !== password) {
        res.send('Invalid email or password');
      } else {
        req.session.loggedIn = true;
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error(error);
      res.send('An error occurred');
    }
  });
  
  app.get('/dashboard', (req, res) => {
    if (req.session.loggedIn) {
      res.send('Welcome to the dashboard!');
    } else {
      res.redirect('/login');
    }
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  