import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  IconButton,
  Box,
  InputAdornment,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import StoreIcon from '@mui/icons-material/Store';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // AI Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userInfo);
  }, []);

  const fetchBooks = async (query = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/books${query ? `?search=${query}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleEditBook = (event, bookId) => {
    event.stopPropagation();
    navigate(`/books/${bookId}/edit`);
  };

  const handleDeleteClick = (event, book) => {
    event.stopPropagation();
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/books/${bookToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(books.filter(b => b.id !== bookToDelete.id));
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    } catch (err) {
      setError('Failed to delete book');
      console.error('Error deleting book:', err);
    }
  };

  const canModifyBook = (book) => {
    return user?.role === 'admin' || book.createdBy === user?.id;
  };

  const handleShare = async (event, bookId) => {
    event.stopPropagation();
    const bookUrl = `${window.location.origin}/books/${bookId}`;
    try {
      await navigator.clipboard.writeText(bookUrl);
      alert('Book link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      const textArea = document.createElement('textarea');
      textArea.value = bookUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Book link copied to clipboard!');
    }
  };

  const handleStoreClick = (event, storeLink) => {
    event.stopPropagation();
    if (storeLink) {
      window.open(storeLink, '_blank');
    }
  };

  const formatLastLogin = (lastLoginAt) => {
    if (!lastLoginAt) return 'This is your first login! Welcome!';
    
    const loginDate = new Date(lastLoginAt);
    const now = new Date();
    const diffTime = Math.abs(now - loginDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Last login: Today at ${loginDate.toLocaleTimeString()}`;
    } else if (diffDays === 1) {
      return `Last login: Yesterday at ${loginDate.toLocaleTimeString()}`;
    } else {
      return `Last login: ${loginDate.toLocaleDateString()} at ${loginDate.toLocaleTimeString()}`;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // AI Suggestions handler
  const handleAISuggestions = async () => {
    setSuggestLoading(true);
    setSuggestions([]);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/suggest-books',
        { books: books.map(b => b.title) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestions(response.data.suggestions.split('\n').filter(Boolean));
    } catch (err) {
      setSuggestions(['Failed to get suggestions.']);
    } finally {
      setSuggestLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Greeting Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {getGreeting()}, {user?.username}! 📚
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          {formatLastLogin(user?.lastLoginAt)}
        </Typography>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Ready to discover your next great read? Browse through your collection or add a new book to get started.
        </Typography>
      </Paper>

      {/* AI Suggestions Section */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleAISuggestions}
          disabled={suggestLoading}
        >
          {suggestLoading ? "Getting Suggestions..." : "AI Book Suggestions"}
        </Button>
      </Box>
      {suggestions.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            AI Book Suggestions
          </Typography>
          {suggestions.map((s, i) => (
            <Typography key={i} variant="body2">
              {s}
            </Typography>
          ))}
        </Paper>
      )}

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          sx={{ flexGrow: 1, mr: 2 }}
          variant="outlined"
          placeholder="Search books..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/books/add')}
        >
          Add Book
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
              onClick={() => handleBookClick(book.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={book.coverImage || '/default-book-cover.jpg'}
                alt={book.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {book.authors?.map(author => author.name).join(', ')}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {book.genres?.map(genre => genre.name).join(', ')}
                </Typography>
                {book.createdBy === user?.id && (
                  <Typography variant="caption" color="text.secondary">
                    Added by you
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
                <Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleShare(e, book.id)}
                    title="Share book"
                    color="primary"
                  >
                    <ShareIcon />
                  </IconButton>
                  {book.storeLink && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleStoreClick(e, book.storeLink)}
                      title="Visit store"
                      color="secondary"
                    >
                      <StoreIcon />
                    </IconButton>
                  )}
                </Box>
                {canModifyBook(book) && (
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleEditBook(e, book.id)}
                      title="Edit book"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteClick(e, book)}
                      title="Delete book"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Loading books...</Typography>
        </Box>
      )}

      {!loading && books.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>No books found</Typography>
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{bookToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;