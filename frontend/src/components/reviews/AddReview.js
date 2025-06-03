import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Rating
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { toast } from 'react-toastify';

function AddReview() {
  const [book, setBook] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [readDate, setReadDate] = useState(new Date());
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/reviews', {
        book_id: id,
        review_text: reviewText,
        rating,
        read_date: readDate.toISOString().split('T')[0]
      });
      toast.success('Review added successfully!');
      navigate(`/books/${id}`);
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Error adding review');
    }
  };

  if (!book) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Write a Review
          </Typography>
          <Typography variant="h6" gutterBottom>
            {book.title} by {book.author}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ my: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                precision={0.5}
              />
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Read Date"
                value={readDate}
                onChange={(newValue) => {
                  setReadDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    required
                  />
                )}
              />
            </LocalizationProvider>

            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Submit Review
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default AddReview; 