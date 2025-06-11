import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Slider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [userStatus, setUserStatus] = useState({
    readingStatus: 'not_started',
    readingProgress: 0,
    hasPhysicalCopy: false,
    isWishlisted: false,
  });
  const [reviewContent, setReviewContent] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  const fetchBookDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBook(response.data);
      if (response.data.userStatus) {
        setUserStatus(response.data.userStatus);
      }
      setReviews(response.data.reviews || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch book details');
      console.error('Error fetching book details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const handleStatusUpdate = async (updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/books/${id}/status`,
        { ...userStatus, ...updates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserStatus(response.data);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/books/${id}/reviews`,
        { content: reviewContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([...reviews, response.data]);
      setReviewContent('');
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/books/${id}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  const handleDeleteBook = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book');
    }
  };

  const canModifyBook = () => {
    return user?.role === 'admin' || book?.createdBy === user?.id;
  };

  const handleShare = async () => {
    const bookUrl = `${window.location.origin}/books/${id}`;
    try {
      await navigator.clipboard.writeText(bookUrl);
      // You could add a snackbar/toast notification here
      alert('Book link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback: select the text
      const textArea = document.createElement('textarea');
      textArea.value = bookUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Book link copied to clipboard!');
    }
  };

  const handleStoreClick = () => {
    if (book?.storeLink) {
      window.open(book.storeLink, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading book details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Book not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Book Details */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box
              component="img"
              src={book.coverImage || '/default-book-cover.jpg'}
              alt={book.title}
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                mb: 2
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                {book.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handleShare}
                  title="Share book"
                  color="primary"
                >
                  <ShareIcon />
                </IconButton>
                {book.storeLink && (
                  <IconButton
                    onClick={handleStoreClick}
                    title="Visit store"
                    color="secondary"
                  >
                    <StoreIcon />
                  </IconButton>
                )}
                {canModifyBook() && (
                  <>
                    <IconButton
                      onClick={() => navigate(`/books/${id}/edit`)}
                      title="Edit book"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialogOpen(true)}
                      title="Delete book"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              By {book.authors?.map(author => author.name).join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Genres: {book.genres?.map(genre => genre.name).join(', ')}
            </Typography>
            {book.createdBy === user?.id && (
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Added by you
              </Typography>
            )}
            <Typography variant="body1" paragraph>
              {book.description}
            </Typography>
          </Paper>
        </Grid>

        {/* Reading Status and Progress */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Reading Status
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={userStatus.readingStatus}
                label="Status"
                onChange={(e) => handleStatusUpdate({ readingStatus: e.target.value })}
              >
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <Typography gutterBottom>Reading Progress</Typography>
            <Slider
              value={userStatus.readingProgress}
              onChange={(e, value) => handleStatusUpdate({ readingProgress: value })}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={100}
            />

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userStatus.hasPhysicalCopy}
                    onChange={(e) => handleStatusUpdate({ hasPhysicalCopy: e.target.checked })}
                  />
                }
                label="I own this book"
              />
              <IconButton
                onClick={() => handleStatusUpdate({ isWishlisted: !userStatus.isWishlisted })}
                color={userStatus.isWishlisted ? 'error' : 'default'}
              >
                {userStatus.isWishlisted ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>
          </Paper>

          {/* Reviews Section */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Reviews
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Write your review..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleReviewSubmit}
                  disabled={!reviewContent.trim()}
                >
                  Post Review
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {reviews.map((review) => (
              <Card key={review.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2">
                        {review.user.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {(review.user.id === user?.id || user?.role === 'admin') && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteReview(review.id)}
                        title={user?.role === 'admin' && review.user.id !== user?.id ? 'Delete review (Admin)' : 'Delete your review'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {review.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}

            {reviews.length === 0 && (
              <Typography color="text.secondary">
                No reviews yet. Be the first to review!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{book.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteBook} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookDetails; 