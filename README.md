# Book Review Application

A full-stack web application for managing and reviewing books, built with Node.js, React, and MySQL.

## Features

- User authentication (register, login, logout)
- Book management (add, view, update, delete)
- Book reviews with ratings
- Favorite books functionality
- Responsive design with Material-UI
- File upload for book cover images

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication
- Multer for file uploads

### Frontend
- React
- Material-UI
- React Router
- Axios
- React Toastify
- Date-fns

## Project Structure

```
book-review-app/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Setup Instructions

### 1. MySQL Setup

First, you need to set up MySQL:

1. Open MySQL command line as root:
```bash
sudo mysql
```

2. Create a new user and database:
```sql
CREATE USER 'bookuser'@'localhost' IDENTIFIED BY 'bookpass123';
CREATE DATABASE book_review_app;
GRANT ALL PRIVILEGES ON book_review_app.* TO 'bookuser'@'localhost';
FLUSH PRIVILEGES;
exit;
```

3. Verify the user and database:
```bash
mysql -u bookuser -p
```
Enter password when prompted: `bookpass123`

Then in MySQL:
```sql
SHOW DATABASES;
USE book_review_app;
SHOW TABLES;
exit;
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
DB_NAME=book_review_app
DB_USER=bookuser
DB_PASSWORD=bookpass123
DB_HOST=localhost
JWT_SECRET=book_review_secret_key
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will start on http://localhost:5000

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend application will start on http://localhost:3000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Books
- GET /api/books - Get all books
- GET /api/books/:id - Get book by ID
- POST /api/books - Create new book
- PUT /api/books/:id - Update book
- DELETE /api/books/:id - Delete book

### Reviews
- GET /api/reviews - Get all reviews
- GET /api/reviews/book/:bookId - Get reviews by book
- GET /api/reviews/user/:userId - Get reviews by user
- POST /api/reviews - Create new review
- PUT /api/reviews/:id - Update review
- DELETE /api/reviews/:id - Delete review

### Favorites
- GET /api/favorites - Get user's favorite books
- POST /api/favorites/:bookId - Add book to favorites
- DELETE /api/favorites/:bookId - Remove book from favorites

## Application Flow

1. User Authentication Flow:
   - User registers or logs in
   - JWT token is generated and stored
   - Protected routes are accessible

2. Book Management Flow:
   - Users can add new books with cover images
   - View book details and reviews
   - Update or delete their books

3. Review System Flow:
   - Users can write reviews for books
   - Rate books on a 5-star scale
   - View all reviews for a book

4. Favorites System Flow:
   - Users can add/remove books to favorites
   - View their favorite books
   - Quick access to favorite books

## Troubleshooting

### MySQL Connection Issues

If you encounter MySQL connection issues:

1. Make sure MySQL is running:
```bash
sudo service mysql status
```

2. If MySQL is not running, start it:
```bash
sudo service mysql start
```

3. Verify your MySQL credentials:
```bash
mysql -u bookuser -p
```
Enter password: `bookpass123`

4. Check if the database exists:
```sql
SHOW DATABASES;
```

5. If needed, recreate the user and database:
```sql
DROP USER IF EXISTS 'bookuser'@'localhost';
DROP DATABASE IF EXISTS book_review_app;
CREATE USER 'bookuser'@'localhost' IDENTIFIED BY 'bookpass123';
CREATE DATABASE book_review_app;
GRANT ALL PRIVILEGES ON book_review_app.* TO 'bookuser'@'localhost';
FLUSH PRIVILEGES;
```

### Backend Issues

1. Check if the port 5000 is available:
```bash
sudo lsof -i :5000
```

2. If the port is in use, you can change it in the `.env` file:
```
PORT=5001
```

### Frontend Issues

1. If you get module not found errors:
```bash
rm -rf node_modules
npm install
```

2. If the frontend can't connect to the backend:
- Check if the backend is running
- Verify the API URL in your frontend code
- Check CORS settings in the backend

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
