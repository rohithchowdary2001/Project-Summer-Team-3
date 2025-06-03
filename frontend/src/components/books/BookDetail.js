import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  IconButton
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function BookDetail() {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Error fetching book details');
    }
  };

  const handleFavorite = async () => {
    try {
      const isFavorite = book.favoritedBy?.some(fav => fav.id === user.id);
      if (isFavorite) {
        await axios.delete(`http://localhost:5000/api/favorites/${id}`);
        toast.success('Removed from favorites');
      } else {
        await axios.post(`http://localhost:5000/api/favorites/${id}`);
        toast.success('Added to favorites');
      }
      fetchBook();
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Error updating favorite');
    }
  };

  const handleAddReview = () => {
    navigate(`/books/${id}/review`);
  };

  if (!book) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const averageRating = book.reviews?.length
    ? book.reviews.reduce((acc, review) => acc + review.rating, 0) / book.reviews.length
    : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                {book.cover_image_url && (
                  <Box
                    component="img"
                    src={book.cover_image_url}
                    alt={book.title}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: 400,
                      objectFit: 'contain'
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      {book.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      by {book.author}
                    </Typography>
                  </Box>
                  <IconButton onClick={handleFavorite} size="large">
                    {book.favoritedBy?.some(fav => fav.id === user.id) ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Box>

                <Box sx={{ my: 2 }}>
                  <Rating value={averageRating} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({book.reviews?.length || 0} reviews)
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddReview}
                  sx={{ mt: 2 }}
                >
                  Write a Review
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" gutterBottom>
              Reviews
            </Typography>

            {book.reviews?.length > 0 ? (
              book.reviews.map((review) => (
                <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">
                      {review.User.name}
                    </Typography>
                    <Rating value={review.rating} readOnly />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Read on {new Date(review.read_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    {review.review_text}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography color="text.secondary">
                No reviews yet. Be the first to review this book!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default BookDetail; 