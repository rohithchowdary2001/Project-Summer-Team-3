import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Rating,
  IconButton
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

function Favorites() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites');
      setFavoriteBooks(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Error fetching favorite books');
    }
  };

  const handleRemoveFavorite = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${bookId}`);
      toast.success('Removed from favorites');
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Error removing from favorites');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              My Favorite Books
            </Typography>

            <Grid container spacing={3}>
              {favoriteBooks.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book.id}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      position: 'relative'
                    }}
                  >
                    <IconButton
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => handleRemoveFavorite(book.id)}
                    >
                      <Favorite color="error" />
                    </IconButton>

                    <Box
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 }
                      }}
                      onClick={() => navigate(`/books/${book.id}`)}
                    >
                      {book.cover_image_url && (
                        <Box
                          component="img"
                          src={book.cover_image_url}
                          alt={book.title}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                            mb: 2
                          }}
                        />
                      )}
                      <Typography variant="h6" gutterBottom>
                        {book.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        by {book.author}
                      </Typography>
                      {book.reviews && book.reviews.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Rating
                            value={
                              book.reviews.reduce((acc, review) => acc + review.rating, 0) /
                              book.reviews.length
                            }
                            precision={0.5}
                            readOnly
                          />
                          <Typography variant="body2" color="text.secondary">
                            ({book.reviews.length} reviews)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {favoriteBooks.length === 0 && (
              <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                You haven't added any books to your favorites yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Favorites; 