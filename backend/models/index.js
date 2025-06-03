const User = require('./User');
const Book = require('./Book');
const Review = require('./Review');
const Favorite = require('./Favorite');

// User - Book relationships
User.belongsToMany(Book, { through: Favorite, as: 'favoriteBooks' });
Book.belongsToMany(User, { through: Favorite, as: 'favoritedBy' });

// User - Review relationships
User.hasMany(Review);
Review.belongsTo(User);

// Book - Review relationships
Book.hasMany(Review);
Review.belongsTo(Book);

module.exports = {
  User,
  Book,
  Review,
  Favorite
};
