import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import axios from "axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    storeLink: "",
    authors: [],
    genres: [],
    publishDate: "", // <-- Add this line
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [imageTab, setImageTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [authorsOpen, setAuthorsOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch book details
        const bookRes = await axios.get(
          `http://localhost:5000/api/books/${id}`,
          { headers }
        );

        // Check if user has permission to edit this book
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const canEdit =
          currentUser.role === "admin" ||
          bookRes.data.createdBy === currentUser.id;

        if (!canEdit) {
          setError("You do not have permission to edit this book");
          setLoading(false);
          setTimeout(() => navigate("/dashboard"), 2000);
          return;
        }

        setFormData({
          title: bookRes.data.title,
          description: bookRes.data.description,
          coverImage: bookRes.data.coverImage,
          storeLink: bookRes.data.storeLink || "",
          authors: bookRes.data.authors.map((a) => a.id),
          genres: bookRes.data.genres.map((g) => g.id),
          publishDate: bookRes.data.publishDate || "", // <-- Add this line
        });

        // Fetch authors and genres
        const [authorsRes, genresRes] = await Promise.all([
          axios.get("http://localhost:5000/api/authors", { headers }),
          axios.get("http://localhost:5000/api/genres", { headers }),
        ]);

        setAuthors(authorsRes.data);
        setGenres(genresRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch book data");
        setLoading(false);
      }
    };

    if (user !== null) {
      fetchData();
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      const uploadFormData = new FormData();
      uploadFormData.append("coverImage", file);

      const response = await axios.post(
        "http://localhost:5000/api/books/upload-cover",
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        coverImage: response.data.imageUrl,
      }));
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setImageTab(newValue);
    if (newValue === 0) {
      setSelectedFile(null);
    } else {
      setFormData((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/books/${id}`,
        {
          ...formData,
          authors: JSON.stringify(formData.authors),
          genres: JSON.stringify(formData.genres),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating book:", err);
      setError("Failed to update book");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Book
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Book Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Book Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cover Image
            </Typography>
            <Tabs value={imageTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Image URL" />
              <Tab label="Upload File" />
            </Tabs>

            {imageTab === 0 && (
              <TextField
                fullWidth
                label="Cover Image URL"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/book-cover.jpg"
              />
            )}

            {imageTab === 1 && (
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={
                    uploading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <CloudUploadIcon />
                    )
                  }
                  disabled={uploading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {uploading ? "Uploading..." : "Choose Image File"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {selectedFile.name}
                  </Typography>
                )}
              </Box>
            )}

            {formData.coverImage && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={
                    formData.coverImage
                      ? formData.coverImage
                      : "/default-book-cover.jpg"
                  }
                  alt="Cover preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "300px",
                    display: "block",
                  }}
                  onError={(e) => {
                    if (!e.target._hasError) {
                      e.target._hasError = true;
                      e.target.src = "/default-book-cover.jpg";
                    }
                  }}
                />
              </Box>
            )}
          </Box>

          <TextField
            margin="normal"
            fullWidth
            label="Store Link (Optional)"
            name="storeLink"
            value={formData.storeLink}
            onChange={handleChange}
            placeholder="https://amazon.com/book-link or https://goodreads.com/book"
            helperText="Add a link to where this book can be purchased or found"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Authors</InputLabel>
            <Select
              multiple
              open={authorsOpen}
              onOpen={() => setAuthorsOpen(true)}
              onClose={() => setAuthorsOpen(false)}
              value={formData.authors}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  authors: e.target.value,
                }));
                setAuthorsOpen(false); // Close after selection
              }}
              input={<OutlinedInput label="Authors" />}
              name="authors"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((authorId) => (
                    <Chip
                      key={authorId}
                      label={authors.find((a) => a.id === authorId)?.name}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {authors.map((author) => (
                <MenuItem key={author.id} value={author.id}>
                  {author.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            label="Book Publish Date"
            type="date"
            name="publishDate"
            InputLabelProps={{ shrink: true }}
            value={formData.publishDate}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Genres</InputLabel>
            <Select
              multiple
              open={genresOpen}
              onOpen={() => setGenresOpen(true)}
              onClose={() => setGenresOpen(false)}
              value={formData.genres}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  genres: e.target.value,
                }));
                setGenresOpen(false); // Close after selection
              }}
              input={<OutlinedInput label="Genres" />}
              name="genres"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((genreId) => (
                    <Chip
                      key={genreId}
                      label={genres.find((g) => g.id === genreId)?.name}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                !formData.title ||
                !formData.description ||
                formData.authors.length === 0 ||
                formData.genres.length === 0
              }
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditBook;
