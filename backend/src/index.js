const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/authors', require('./routes/author.routes'));
app.use('/api/genres', require('./routes/genre.routes'));
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database models
    await sequelize.sync();
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer(); 