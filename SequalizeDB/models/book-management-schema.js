// models/book-management-schema.js

module.exports = (sequelize, DataTypes) => {
  const models = {};

  // USERS
  models.User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    passwordHash: DataTypes.STRING,
    role: DataTypes.ENUM("user", "admin"),
    emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    lastLoginAt: DataTypes.DATE,
    lastLogoutAt: DataTypes.DATE,
    lastLoginDevice: DataTypes.STRING
  });

  // BOOKS
  models.Book = sequelize.define("Book", {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    createdBy: DataTypes.INTEGER
  });

  // AUTHORS
  models.Author = sequelize.define("Author", {
    name: DataTypes.STRING,
    bio: DataTypes.TEXT
  });

  // BOOK_AUTHORS (Many-to-Many)
  models.BookAuthor = sequelize.define("BookAuthor", {}, { timestamps: false });

  // GENRES
  models.Genre = sequelize.define("Genre", {
    name: DataTypes.STRING
  });

  // BOOK_GENRES (Bridge table for Many-to-Many)
  models.BookGenre = sequelize.define("BookGenre", {}, { timestamps: false });

  // USER_BOOK_INTERACTIONS (wishlist + reading status + reviews combined)
  models.UserBookInteraction = sequelize.define("UserBookInteraction", {
    isWishlisted: { type: DataTypes.BOOLEAN, defaultValue: false },
    readingStatus: DataTypes.ENUM("not started", "in progress", "completed"),
    startDate: DataTypes.DATE,
    completionDate: DataTypes.DATE,
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  });

  // SHARED LINKS
  models.SharedLink = sequelize.define("SharedLink", {
    token: { type: DataTypes.STRING, unique: true }
  });

  // LOGIN HISTORY (track each login with time + device)
  models.LoginHistory = sequelize.define("LoginHistory", {
    loginTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deviceInfo: DataTypes.STRING,
    ipAddress: DataTypes.STRING
  });

  // Relationships
  models.Book.belongsToMany(models.Author, { through: models.BookAuthor });
  models.Author.belongsToMany(models.Book, { through: models.BookAuthor });

  models.Book.belongsToMany(models.Genre, { through: models.BookGenre });
  models.Genre.belongsToMany(models.Book, { through: models.BookGenre });

  models.User.belongsToMany(models.Book, { through: models.UserBookInteraction });
  models.Book.belongsToMany(models.User, { through: models.UserBookInteraction });

  models.SharedLink.belongsTo(models.Book);
  models.SharedLink.belongsTo(models.User, { as: 'creator', foreignKey: 'createdBy' });

  models.LoginHistory.belongsTo(models.User);
  models.User.hasMany(models.LoginHistory);

  return models;
};
