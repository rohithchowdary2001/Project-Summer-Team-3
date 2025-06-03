 # Book Review Application Flow Diagrams

## 1. User Authentication Flow
```mermaid
graph TD
    A[User] --> B{Has Account?}
    B -->|No| C[Register]
    B -->|Yes| D[Login]
    C --> E[Enter Details]
    E --> F[Submit Registration]
    F --> G{Success?}
    G -->|Yes| H[Dashboard]
    G -->|No| E
    D --> I[Enter Credentials]
    I --> J[Submit Login]
    J --> K{Success?}
    K -->|Yes| H
    K -->|No| I
```

## 2. Book Management Flow
```mermaid
graph TD
    A[User] --> B[View Books]
    B --> C{Action?}
    C -->|Add Book| D[Add Book Form]
    C -->|View Details| E[Book Details]
    C -->|Search| F[Search Results]
    D --> G[Enter Book Info]
    G --> H[Upload Cover]
    H --> I[Set Reading Status]
    I --> J[Add Review]
    J --> K[Submit]
    K --> B
    E --> L[View Reviews]
    E --> M[Add Review]
    E --> N[Toggle Favorite]
```

## 3. Review Management Flow
```mermaid
graph TD
    A[User] --> B[Select Book]
    B --> C[Add Review]
    C --> D[Enter Rating]
    D --> E[Enter Review Text]
    E --> F[Set Read Date]
    F --> G[Submit Review]
    G --> H[Book Details]
    H --> I[View All Reviews]
    I --> J[Edit Review]
    I --> K[Delete Review]
```

## 4. Reading Progress Flow
```mermaid
graph TD
    A[User] --> B[Select Book]
    B --> C{Reading Status}
    C -->|Not Started| D[0% Progress]
    C -->|In Progress| E[Show Progress Bar]
    C -->|Completed| F[100% Progress]
    E --> G[Update Progress]
    G --> H{Progress = 100%?}
    H -->|Yes| I[Auto Complete]
    H -->|No| E
```

## 5. Favorites Management Flow
```mermaid
graph TD
    A[User] --> B[View Books]
    B --> C[Toggle Favorite]
    C --> D{Is Favorite?}
    D -->|Yes| E[Remove from Favorites]
    D -->|No| F[Add to Favorites]
    E --> G[Update Favorites List]
    F --> G
    G --> H[View Favorites]
```

## 6. Application Architecture
```mermaid
graph TD
    A[Frontend - React] --> B[Backend - Node.js]
    B --> C[Database - MySQL]
    A --> D[Authentication]
    A --> E[Book Management]
    A --> F[Review System]
    A --> G[Favorites]
    B --> H[API Routes]
    H --> I[Auth Routes]
    H --> J[Book Routes]
    H --> K[Review Routes]
    H --> L[Favorite Routes]
```

## 7. Data Flow
```mermaid
graph LR
    A[User Input] --> B[React Components]
    B --> C[API Requests]
    C --> D[Node.js Backend]
    D --> E[MySQL Database]
    E --> D
    D --> F[API Response]
    F --> B
    B --> G[UI Update]
```

## 8. Component Hierarchy
```mermaid
graph TD
    A[App] --> B[Navbar]
    A --> C[Routes]
    C --> D[Login]
    C --> E[Register]
    C --> F[Dashboard]
    C --> G[BookList]
    C --> H[BookDetail]
    C --> I[AddBook]
    C --> J[AddReview]
    C --> K[Favorites]
    G --> L[BookCard]
    H --> M[ReviewList]
    H --> N[ReviewForm]
```

## 9. Authentication State Flow
```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    Unauthenticated --> Login: Login Success
    Unauthenticated --> Register: Register Success
    Login --> Authenticated: Valid Credentials
    Register --> Authenticated: Valid Registration
    Authenticated --> Unauthenticated: Logout
    Authenticated --> [*]: Session Expired
```

## 10. Error Handling Flow
```mermaid
graph TD
    A[User Action] --> B{Validation}
    B -->|Pass| C[Process Request]
    B -->|Fail| D[Show Error]
    C --> E{API Call}
    E -->|Success| F[Update UI]
    E -->|Error| G[Handle Error]
    G --> H[Show Error Message]
    H --> A
    D --> A
```

## 11. Database Schema Flow
```mermaid
erDiagram
    USERS ||--o{ BOOKS : creates
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ FAVORITES : has
    BOOKS ||--o{ REVIEWS : has
    BOOKS ||--o{ FAVORITES : has

    USERS {
        int id PK
        string name
        string email
        string password
        datetime created_at
    }

    BOOKS {
        int id PK
        int user_id FK
        string title
        string author
        string cover_image_url
        int reading_status
        int progress
        datetime created_at
    }

    REVIEWS {
        int id PK
        int user_id FK
        int book_id FK
        string review_text
        int rating
        date read_date
        datetime created_at
    }

    FAVORITES {
        int id PK
        int user_id FK
        int book_id FK
        datetime created_at
    }
```

## 12. API Endpoints Flow
```mermaid
graph TD
    A[API Routes] --> B[Auth Routes]
    A --> C[Book Routes]
    A --> D[Review Routes]
    A --> E[Favorite Routes]

    B --> B1[POST /api/auth/register]
    B --> B2[POST /api/auth/login]
    B --> B3[GET /api/auth/me]

    C --> C1[GET /api/books]
    C --> C2[POST /api/books]
    C --> C3[GET /api/books/:id]
    C --> C4[PUT /api/books/:id]
    C --> C5[DELETE /api/books/:id]

    D --> D1[GET /api/reviews]
    D --> D2[POST /api/reviews]
    D --> D3[PUT /api/reviews/:id]
    D --> D4[DELETE /api/reviews/:id]

    E --> E1[GET /api/favorites]
    E --> E2[POST /api/favorites/:bookId]
    E --> E3[DELETE /api/favorites/:bookId]
```

These flow diagrams provide a comprehensive view of the application's functionality and architecture. They cover:
- User authentication and registration
- Book management and review system
- Reading progress tracking
- Favorites management
- Application architecture
- Data flow
- Component hierarchy
- Authentication state management
- Error handling
- Database schema
- API endpoints

Each diagram focuses on a specific aspect of the application, making it easier to understand the different workflows and their interactions.