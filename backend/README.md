# Book Review App Backend

The backend server for the Book Review Application, built with Node.js, Express, and MySQL.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
DB_NAME=book_review_app
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
PORT=5000
```

3. Create the MySQL database:
```sql
CREATE DATABASE book_review_app;
```

4. Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:5000

## Project Structure

```
backend/
├── config/
│   └── database.js      # Database configuration
├── middleware/
│   └── auth.js         # Authentication middleware
├── models/
│   ├── User.js         # User model
│   ├── Book.js         # Book model
│   ├── Review.js       # Review model
│   ├── Favorite.js     # Favorite model
│   └── index.js        # Model associations
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── books.js        # Book routes
│   ├── reviews.js      # Review routes
│   └── favorites.js    # Favorite routes
├── uploads/            # Book cover images
├── .env               # Environment variables
├── package.json       # Project dependencies
└── server.js         # Main application file
```

## API Documentation

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Books

#### Get All Books
- **GET** `/api/books`
- **Response:** Array of books with reviews

#### Get Book by ID
- **GET** `/api/books/:id`
- **Response:** Book details with reviews

#### Create Book
- **POST** `/api/books`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `FormData`
  - title: string
  - author: string
  - cover_image: file (optional)

#### Update Book
- **PUT** `/api/books/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `FormData`
  - title: string (optional)
  - author: string (optional)
  - cover_image: file (optional)

#### Delete Book
- **DELETE** `/api/books/:id`
- **Headers:** `Authorization: Bearer <token>`

### Reviews

#### Get All Reviews
- **GET** `/api/reviews`

#### Get Reviews by Book
- **GET** `/api/reviews/book/:bookId`

#### Get Reviews by User
- **GET** `/api/reviews/user/:userId`

#### Create Review
- **POST** `/api/reviews`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "book_id": 1,
    "review_text": "Great book!",
    "rating": 4.5,
    "read_date": "2024-03-20"
  }
  ```

#### Update Review
- **PUT** `/api/reviews/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "review_text": "Updated review",
    "rating": 5,
    "read_date": "2024-03-21"
  }
  ```

#### Delete Review
- **DELETE** `/api/reviews/:id`
- **Headers:** `Authorization: Bearer <token>`

### Favorites

#### Get User's Favorites
- **GET** `/api/favorites`
- **Headers:** `Authorization: Bearer <token>`

#### Add to Favorites
- **POST** `/api/favorites/:bookId`
- **Headers:** `Authorization: Bearer <token>`

#### Remove from Favorites
- **DELETE** `/api/favorites/:bookId`
- **Headers:** `Authorization: Bearer <token>`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Books Table
```sql
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    cover_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    review_text TEXT NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    read_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
```

### Favorites Table
```sql
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, book_id)
);
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "message": "Error message",
  "error": "Detailed error information (in development)"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- File uploads are restricted to image files
- Input validation is implemented for all routes
- CORS is enabled for the frontend domain 