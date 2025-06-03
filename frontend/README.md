# Book Review App Frontend

The frontend application for the Book Review App, built with React and Material-UI.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will start on http://localhost:3000

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
└── src/
    ├── components/
    │   ├── auth/
    │   │   ├── Login.js
    │   │   └── Register.js
    │   ├── books/
    │   │   ├── BookList.js
    │   │   ├── BookDetail.js
    │   │   └── AddBook.js
    │   ├── reviews/
    │   │   └── AddReview.js
    │   ├── favorites/
    │   │   └── Favorites.js
    │   ├── Navbar.js
    │   └── Dashboard.js
    ├── context/
    │   └── AuthContext.js
    ├── App.js
    └── index.js
```

## Components

### Authentication Components

#### Login
- Handles user login
- Form fields: email and password
- Redirects to dashboard on successful login

#### Register
- Handles user registration
- Form fields: name, email, and password
- Redirects to login on successful registration

### Book Components

#### BookList
- Displays grid of all books
- Shows book cover, title, author, and average rating
- Clickable cards to view book details

#### BookDetail
- Shows detailed information about a book
- Displays book cover, title, author
- Shows all reviews for the book
- Allows adding/removing from favorites
- Option to write a review

#### AddBook
- Form to add new books
- Fields: title, author, cover image
- File upload for book cover

### Review Components

#### AddReview
- Form to write a book review
- Fields: rating (0-5), read date, review text
- Rating component with half-star precision

### Favorite Components

#### Favorites
- Displays user's favorite books
- Grid layout with book cards
- Option to remove from favorites
- Clickable cards to view book details

### Navigation

#### Navbar
- Responsive navigation bar
- Shows different options based on authentication status
- Links to all main sections of the app

### Dashboard

#### Dashboard
- Main landing page for authenticated users
- Overview of recent activity
- Quick access to main features

## State Management

The application uses React Context for state management:

### AuthContext
- Manages user authentication state
- Provides login/logout functionality
- Stores user information and JWT token

## API Integration

The frontend communicates with the backend API using Axios:

- Base URL: http://localhost:5000
- Authentication headers are automatically added to requests
- Error handling with toast notifications

## Styling

The application uses Material-UI for styling:
- Responsive design
- Consistent theme across components
- Custom styling using the `sx` prop
- Dark/light mode support

## Features

1. User Authentication
   - Login/Register forms
   - Protected routes
   - Persistent sessions

2. Book Management
   - View all books
   - Book details
   - Add new books
   - Upload cover images

3. Review System
   - Write reviews
   - Rate books
   - View all reviews
   - Sort and filter reviews

4. Favorites
   - Add/remove favorites
   - View favorite books
   - Quick access to favorite books

## Error Handling

- Form validation
- API error handling
- Toast notifications for success/error messages
- Loading states for async operations

## Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly interfaces

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

### Code Style

- ESLint configuration included
- Prettier formatting
- Component-based architecture
- Functional components with hooks

## Deployment

1. Build the application:
```bash
npm run build
```

2. The build folder contains the production-ready files
3. Deploy the contents of the build folder to your hosting service

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 