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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import axios from 'axios';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [error, setError] = useState('');

  const fetchAuthors = async (query = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/authors${query ? `?search=${query}` : ''}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAuthors(response.data);
    } catch (err) {
      console.error('Error fetching authors:', err);
      setError('Failed to fetch authors');
    }
  };

  const fetchGenres = async (query = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/genres${query ? `?search=${query}` : ''}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGenres(response.data);
    } catch (err) {
      console.error('Error fetching genres:', err);
      setError('Failed to fetch genres');
    }
  };

  useEffect(() => {
    if (tab === 0) {
      fetchAuthors(searchQuery);
    } else {
      fetchGenres(searchQuery);
    }
  }, [tab, searchQuery]);

  const handleAdd = () => {
    setEditItem(null);
    setNewItemName('');
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewItemName(item.name);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = tab === 0 ? 'authors' : 'genres';
      await axios.delete(
        `http://localhost:5000/api/${endpoint}/${item.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (tab === 0) {
        setAuthors(authors.filter(a => a.id !== item.id));
      } else {
        setGenres(genres.filter(g => g.id !== item.id));
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    }
  };

  const handleSubmit = async () => {
    if (!newItemName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = tab === 0 ? 'authors' : 'genres';
      
      if (editItem) {
        const response = await axios.put(
          `http://localhost:5000/api/${endpoint}/${editItem.id}`,
          { name: newItemName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (tab === 0) {
          setAuthors(authors.map(a => a.id === editItem.id ? response.data : a));
        } else {
          setGenres(genres.map(g => g.id === editItem.id ? response.data : g));
        }
      } else {
        const response = await axios.post(
          `http://localhost:5000/api/${endpoint}`,
          { name: newItemName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (tab === 0) {
          setAuthors([...authors, response.data]);
        } else {
          setGenres([...genres, response.data]);
        }
      }
      setDialogOpen(false);
      setNewItemName('');
      setEditItem(null);
    } catch (err) {
      console.error('Error submitting item:', err);
      setError('Failed to save item');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Manage Authors and Genres
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
            <Tab label="Authors" />
            <Tab label="Genres" />
          </Tabs>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder={`Search ${tab === 0 ? 'authors' : 'genres'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchQuery('')} edge="end">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Add {tab === 0 ? 'Author' : 'Genre'}
              </Button>
            </Box>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <List>
              {(tab === 0 ? authors : genres).map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {editItem ? 'Edit' : 'Add'} {tab === 0 ? 'Author' : 'Genre'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editItem ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 