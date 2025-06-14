// const express = require('express');
// const cors = require('cors');
// const sequelize = require('./config/database');
// const path = require('path');
// const adminRoutes = require('./routes/admin.routes');
// require('dotenv').config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// // Routes
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/books', require('./routes/book.routes'));
// app.use('/api/users', require('./routes/user.routes'));
// app.use('/api/reviews', require('./routes/review.routes'));
// app.use('/api/authors', require('./routes/author.routes'));
// app.use('/api/genres', require('./routes/genre.routes'));
// app.use('/api/admin', adminRoutes);
// app.use('/api/ai', require('./routes/ai.routes'));

// const PORT = process.env.PORT || 5000;

// // Database connection and server start
// async function startServer() {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection established successfully.');
    
//     // Sync database models
//     await sequelize.sync();
//     console.log('Database models synchronized.');

//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// startServer(); 



const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database'); // Your sequelize instance
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/health', (req, res) => res.status(200).send('OK'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/authors', require('./routes/author.routes'));
app.use('/api/genres', require('./routes/genre.routes'));
app.use('/api/admin', adminRoutes);
// app.use('/api/ai', require('./routes/ai.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Get PORT from env or default 5000
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models
    await sequelize.sync();
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit with failure
  }
}

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Start the server
startServer();
