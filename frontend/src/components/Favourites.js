import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import StoreIcon from '@mui/icons-material/Store';
import axios from 'axios';

const Favourites = () => {
  const navigate = useNavigate();
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userInfo);
  }, []);

  const fetchFavoriteBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/books/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavoriteBooks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch favorite books');
      console.error('Error fetching favorite books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteBooks();
  }, []);

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
      setFavoriteBooks(favoriteBooks.filter(b => b.id !== bookToDelete.id));
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    } catch (err) {
      setError('Failed to delete book');
      console.error('Error deleting book:', err);
    }
  };

  const handleRemoveFromFavorites = async (event, bookId) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/books/${bookId}/status`, {
        isWishlisted: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavoriteBooks(favoriteBooks.filter(b => b.id !== bookId));
    } catch (err) {
      setError('Failed to remove from favorites');
      console.error('Error removing from favorites:', err);
    }
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

  const canModifyBook = (book) => {
    return user?.role === 'admin' || book.createdBy === user?.id;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          My Favourite Books
        </Typography>
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
        {favoriteBooks.map((book) => (
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
              <CardContent sx={{ flexGrow: 1 }}>
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
                  {canModifyBook(book) && (
                    <>
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
                    </>
                  )}
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleRemoveFromFavorites(e, book.id)}
                  title="Remove from favorites"
                  color="error"
                >
                  <FavoriteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Loading favorite books...</Typography>
        </Box>
      )}

      {!loading && favoriteBooks.length === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No favorite books yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start adding books to your favorites by clicking the heart icon on any book!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Browse Books
          </Button>
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

export default Favourites; 