import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Rating,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { toast } from 'react-toastify';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [readDate, setReadDate] = useState(new Date());
  const [rating, setRating] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [readingStatus, setReadingStatus] = useState('not_started');
  const navigate = useNavigate();

  // Update progress when reading status changes
  useEffect(() => {
    if (readingStatus === 'completed') {
      setProgress(100);
    } else if (readingStatus === 'not_started') {
      setProgress(0);
    }
  }, [readingStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('read_date', readDate.toISOString().split('T')[0]);
    formData.append('rating', rating);
    formData.append('progress', progress);
    formData.append('review_text', reviewText);
    formData.append('reading_status', readingStatus);
    if (coverImage) {
      formData.append('cover_image', coverImage);
    }

    try {
      await axios.post('http://localhost:5000/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Book added successfully!');
      navigate('/books');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Error adding book');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleProgressChange = (event, newValue) => {
    setProgress(newValue);
    if (newValue === 100) {
      setReadingStatus('completed');
    } else if (newValue > 0) {
      setReadingStatus('in_progress');
    }
  };

  const handleReadingStatusChange = (event) => {
    const newStatus = event.target.value;
    setReadingStatus(newStatus);
    if (newStatus === 'completed') {
      setProgress(100);
    } else if (newStatus === 'not_started') {
      setProgress(0);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Add New Book
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Book Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <input
                    accept="image/*"
                    type="file"
                    id="cover-image"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="cover-image">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                    >
                      Upload Cover Image
                    </Button>
                  </label>
                  {coverImage && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {coverImage.name}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Reading Status</InputLabel>
                  <Select
                    value={readingStatus}
                    label="Reading Status"
                    onChange={handleReadingStatusChange}
                  >
                    <MenuItem value="not_started">Not Started</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  precision={0.5}
                />
              </Grid>
              {readingStatus === 'in_progress' && (
                <Grid item xs={12}>
                  <Typography gutterBottom>Reading Progress</Typography>
                  <Slider
                    value={progress}
                    onChange={handleProgressChange}
                    aria-labelledby="progress-slider"
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={100}
                  />
                  <Typography variant="body2" color="text.secondary" align="center">
                    {progress}% Complete
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  multiline
                  rows={4}
                  label="Review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about the book..."
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3 }}
                >
                  Add Book
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default AddBook; 