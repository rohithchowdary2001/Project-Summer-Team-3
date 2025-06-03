import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import axios from 'axios';

const AdminPanel = () => {
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [openAddBook, setOpenAddBook] = useState(false);
  const [bookData, setBookData] = useState({
    title: '',
    description: '',
    authors: [],
    genres: [],
    coverImage: null
  });

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
  }, []);

  const fetchAuthors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/authors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/genres', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleAddAuthor = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/authors', {
        name: newAuthor
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewAuthor('');
      fetchAuthors();
    } catch (error) {
      console.error('Error adding author:', error);
    }
  };

  const handleAddGenre = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/genres', {
        name: newGenre
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewGenre('');
      fetchGenres();
    } catch (error) {
      console.error('Error adding genre:', error);
    }
  };

  const handleDeleteAuthor = async (authorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/authors/${authorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  const handleDeleteGenre = async (genreId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/genres/${genreId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGenres();
    } catch (error) {
      console.error('Error deleting genre:', error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBookData({
        ...bookData,
        coverImage: file
      });
    }
  };

  const handleAddBook = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', bookData.title);
      formData.append('description', bookData.description);
      formData.append('authors', JSON.stringify(bookData.authors));
      formData.append('genres', JSON.stringify(bookData.genres));
      if (bookData.coverImage) {
        formData.append('coverImage', bookData.coverImage);
      }

      await axios.post('http://localhost:5000/api/books', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setOpenAddBook(false);
      setBookData({
        title: '',
        description: '',
        authors: [],
        genres: [],
        coverImage: null
      });
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Manage Authors
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Add new author"
              />
              <Button
                variant="contained"
                onClick={handleAddAuthor}
                disabled={!newAuthor.trim()}
              >
                <AddIcon />
              </Button>
            </Box>
            <List>
              {authors.map((author) => (
                <ListItem key={author.id}>
                  <ListItemText primary={author.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteAuthor(author.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Manage Genres
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                placeholder="Add new genre"
              />
              <Button
                variant="contained"
                onClick={handleAddGenre}
                disabled={!newGenre.trim()}
              >
                <AddIcon />
              </Button>
            </Box>
            <List>
              {genres.map((genre) => (
                <ListItem key={genre.id}>
                  <ListItemText primary={genre.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteGenre(genre.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddBook(true)}
            >
              Add New Book
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openAddBook} onClose={() => setOpenAddBook(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Title"
              value={bookData.title}
              onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={bookData.description}
              onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
            />

            <Autocomplete
              multiple
              options={authors.map(author => author.name)}
              value={bookData.authors}
              onChange={(_, newValue) => setBookData({ ...bookData, authors: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="Authors" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} />
                ))
              }
            />

            <Autocomplete
              multiple
              options={genres.map(genre => genre.name)}
              value={bookData.genres}
              onChange={(_, newValue) => setBookData({ ...bookData, genres: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="Genres" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} />
                ))
              }
            />

            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload Cover Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            {bookData.coverImage && (
              <Typography variant="body2" color="text.secondary">
                Selected file: {bookData.coverImage.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddBook(false)}>Cancel</Button>
          <Button
            onClick={handleAddBook}
            variant="contained"
            disabled={!bookData.title || !bookData.authors.length || !bookData.genres.length}
          >
            Add Book
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel; 