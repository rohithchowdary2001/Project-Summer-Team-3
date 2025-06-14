import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import axios from "axios";

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState("");
  const [newAuthorDob, setNewAuthorDob] = useState("");
  const [newAuthorCountry, setNewAuthorCountry] = useState("");
  const [newAuthorDeath, setNewAuthorDeath] = useState("");

  // Fetch authors, genres, users
  const fetchAuthors = async (query = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/authors${query ? `?search=${query}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAuthors(response.data);
    } catch (err) {
      console.error("Error fetching authors:", err);
      setError("Failed to fetch authors");
    }
  };

  const fetchGenres = async (query = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/genres${query ? `?search=${query}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGenres(response.data);
    } catch (err) {
      console.error("Error fetching genres:", err);
      setError("Failed to fetch genres");
    }
  };

  const fetchUsers = async (query = "") => {
    try {
      const token = localStorage.getItem("token");
      const url = query
        ? `http://localhost:5000/api/users?search=${encodeURIComponent(query)}`
        : "http://localhost:5000/api/users";
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (tab === 0) {
      fetchAuthors(searchQuery);
    } else if (tab === 1) {
      fetchGenres(searchQuery);
    }
    // For users, only fetch on search button or Enter
  }, [tab, searchQuery]);

  // CRUD handlers for authors/genres
  const handleAdd = () => {
    setEditItem(null);
    setNewItemName("");
    setDialogOpen(true);
  };

// In your AdminDashboard.js

const handleEdit = (author) => {
  setEditItem(author);
  setNewItemName(author.name || "");
  setNewAuthorDob(author.dob || "");
  setNewAuthorCountry(author.countryOfBirth || "");
  setNewAuthorDeath(author.dateOfDeath || "");
  setDialogOpen(true);
};

  const handleDelete = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = tab === 0 ? "authors" : "genres";
      await axios.delete(`http://localhost:5000/api/${endpoint}/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (tab === 0) {
        setAuthors(authors.filter((a) => a.id !== item.id));
      } else {
        setGenres(genres.filter((g) => g.id !== item.id));
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item");
    }
  };

const handleSubmit = async () => {
  if (!newItemName.trim()) return;

  try {
    const token = localStorage.getItem("token");
    const endpoint = tab === 0 ? "authors" : "genres";

    if (editItem) {
      const payload =
        tab === 0
          ? {
              name: newItemName,
              dob: newAuthorDob,
              countryOfBirth: newAuthorCountry,
              dateOfDeath: newAuthorDeath,
            }
          : { name: newItemName };

      const response = await axios.put(
        `http://localhost:5000/api/${endpoint}/${editItem.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (tab === 0) {
        setAuthors(
          authors.map((a) => (a.id === editItem.id ? response.data : a))
        );
      } else {
        setGenres(
          genres.map((g) => (g.id === editItem.id ? response.data : g))
        );
      }
    } else {
      const payload =
        tab === 0
          ? {
              name: newItemName,
              dob: newAuthorDob,
              countryOfBirth: newAuthorCountry,
              dateOfDeath: newAuthorDeath,
            }
          : { name: newItemName };

      const response = await axios.post(
        `http://localhost:5000/api/${endpoint}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (tab === 0) {
        setAuthors([...authors, response.data]);
      } else {
        setGenres([...genres, response.data]);
      }
    }
    setDialogOpen(false);
    setNewItemName("");
    setEditItem(null);
    setNewAuthorDob("");
    setNewAuthorCountry("");
    setNewAuthorDeath("");
  } catch (err) {
    console.error("Error submitting item:", err);
    setError("Failed to save item");
  }
};

  // User delete handler
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(userSearch);
    } catch (error) {
      alert("Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  // User search handler (only fetch on button click or Enter)
  const handleUserSearch = () => {
    fetchUsers(userSearch);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
            <Tab label="Authors" />
            <Tab label="Genres" />
            <Tab label="Users" />
          </Tabs>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Show search/add only for Authors and Genres */}
            {(tab === 0 || tab === 1) && (
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder={`Search ${tab === 0 ? "authors" : "genres"}...`}
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
                        <IconButton
                          onClick={() => setSearchQuery("")}
                          edge="end"
                        >
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
                  Add {tab === 0 ? "Author" : "Genre"}
                </Button>
              </Box>
            )}

            {/* Show search bar for Users */}
            {tab === 2 && (
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    fetchUsers(e.target.value); // Fetch users as you type
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: userSearch && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setUserSearch("");
                            fetchUsers(""); // Reset to all users when cleared
                          }}
                          edge="end"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleUserSearch}
                  startIcon={<SearchIcon />}
                >
                  Search
                </Button>
              </Box>
            )}

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            {/* Authors List */}
            {tab === 0 && (
              <List>
                {authors.map((item) => (
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
            )}

            {/* Genres List */}
            {tab === 1 && (
              <List>
                {genres.map((item) => (
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
            )}

            {/* Users List */}
            {tab === 2 && (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Manage Users
                </Typography>
                <List>
                  {users.map((user) => (
                    <ListItem key={user.id}>
                      <ListItemText
                        primary={user.username || user.name || user.email}
                        secondary={user.role}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === "admin"}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog for add/edit author/genre */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {editItem ? "Edit" : "Add"} {tab === 0 ? "Author" : "Genre"}
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
          {tab === 0 && (
            <>
              <TextField
                margin="dense"
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newAuthorDob}
                onChange={(e) => setNewAuthorDob(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Country of Birth"
                fullWidth
                value={newAuthorCountry}
                onChange={(e) => setNewAuthorCountry(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Date of Death"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newAuthorDeath}
                onChange={(e) => setNewAuthorDeath(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editItem ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
