const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const defineModels = require('./models/book-management-schema');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const sequelize = new Sequelize('book_manager', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

const models = defineModels(sequelize, DataTypes);

// USERS 
app.get('/api/users', async (req, res) => {
  const users = await models.User.findAll();
  res.json(users);
});

app.get('/api/users/:id', async (req, res) => {
  const user = await models.User.findByPk(req.params.id);
  res.json(user);
});

app.post('/api/users', async (req, res) => {
  const user = await models.User.create(req.body);
  res.status(201).json(user);
});

app.put('/api/users/:id', async (req, res) => {
  const user = await models.User.findByPk(req.params.id);
  await user.update(req.body);
  res.json(user);
});

app.delete('/api/users/:id', async (req, res) => {
  const user = await models.User.findByPk(req.params.id);
  await user.destroy();
  res.json({ message: 'User deleted' });
});

// BOOKS
app.get('/api/books', async (req, res) => {
  const books = await models.Book.findAll();
  res.json(books);
});

app.get('/api/books/:id', async (req, res) => {
  const book = await models.Book.findByPk(req.params.id);
  res.json(book);
});

app.post('/api/books', async (req, res) => {
  const book = await models.Book.create(req.body);
  res.status(201).json(book);
});

app.put('/api/books/:id', async (req, res) => {
  const book = await models.Book.findByPk(req.params.id);
  await book.update(req.body);
  res.json(book);
});

app.delete('/api/books/:id', async (req, res) => {
  const book = await models.Book.findByPk(req.params.id);
  await book.destroy();
  res.json({ message: 'Book deleted' });
});

// GENRES 
app.get('/api/genres', async (req, res) => {
  const genres = await models.Genre.findAll();
  res.json(genres);
});

app.post('/api/genres', async (req, res) => {
  const genre = await models.Genre.create(req.body);
  res.status(201).json(genre);
});

// BOOK-GENRE LINK 
app.post('/api/book-genres', async (req, res) => {
  const entry = await models.BookGenre.create(req.body); // needs bookId, genreId
  res.status(201).json(entry);
});

app.get('/api/book-genres/:bookId', async (req, res) => {
  const entries = await models.BookGenre.findAll({ where: { bookId: req.params.bookId } });
  res.json(entries);
});

// USERBOOK INTERACTIONS (Wishlist, Status, Reviews) 
app.get('/api/userbooks', async (req, res) => {
  const records = await models.UserBookInteraction.findAll();
  res.json(records);
});

app.get('/api/userbooks/:userId', async (req, res) => {
  const records = await models.UserBookInteraction.findAll({ where: { userId: req.params.userId } });
  res.json(records);
});

app.post('/api/userbooks', async (req, res) => {
  const record = await models.UserBookInteraction.create(req.body);
  res.status(201).json(record);
});

// SHARED LINKS 
app.get('/api/shared-links/:token', async (req, res) => {
  const link = await models.SharedLink.findOne({ where: { token: req.params.token } });
  res.json(link);
});

// LOGIN HISTORY 
app.get('/api/logins/:userId', async (req, res) => {
  const logs = await models.LoginHistory.findAll({
    where: { UserId: req.params.userId },
    order: [['loginTime', 'DESC']]
  });
  res.json(logs);
});

// START SERVER
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
