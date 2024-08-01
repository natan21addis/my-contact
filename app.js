require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/route'); // If this is an Express router

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000 });
const db = mongoose.connection;
db.on('error', (error) => {
   console.log(error);
});
db.once('open', () => {
   console.log('Connected to database');
});

app.use(express.static('public'));
app.use(express.static('uploads'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
   session({
      secret: "my secret key",
      saveUninitialized: true,
      resave: false,
   })
);

app.use((req, res, next) => {
   res.locals.message = req.session.message;
   delete req.session.message;
   next();
});

app.set("view engine", "ejs");

// Use the router here
app.use("/", authRoutes); // Make sure authRoutes is an Express router

app.listen(PORT, () => {
   console.log(`Server started at http://localhost:${PORT}`);
});
