const express = require('express');
const session = require('express-session');
const app = express();
const authRoutes = require('./routes/auth.routes');
const groupRoutes = require('./routes/group.routes');
const logger = require('./middleware/logger');
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
  secret: 'your_secret', 
  resave: false,
  saveUninitialized: true 
}));
app.use(logger);

// CORS and logging
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  console.log(`${req.method} ${req.url}`);
// Add this to your app.js BEFORE routes
  console.log(`Incoming request: ${req.method} ${req.path}`);


  next();
});



// Routes
app.use('/auth', authRoutes);
app.use('/group', groupRoutes);

// 2. THEN static files (this must come AFTER API routes)
app.use(express.static('public'));

// 3. Catch-all for SPA (must be LAST)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(3000, () => console.log('Server is running on port 3000'));
