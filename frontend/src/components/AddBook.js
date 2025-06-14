import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Chip,
  OutlinedInput,
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

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    storeLink: "",
    authors: [],
    genres: [],
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");
  const [imageTab, setImageTab] = useState(0); // 0 for URL, 1 for upload
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [authorsOpen, setAuthorsOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [authorsRes, genresRes] = await Promise.all([
          axios.get("http://localhost:5000/api/authors", { headers }),
          axios.get("http://localhost:5000/api/genres", { headers }),
        ]);

        setAuthors(authorsRes.data);
        setGenres(genresRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch authors and genres");
      }
    };

    fetchData();
  }, []);

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
      const formData = new FormData();
      formData.append("coverImage", file);

      const response = await axios.post(
        "http://localhost:5000/api/books/upload-cover",
        formData,
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
      // Switching to URL tab, clear file selection
      setSelectedFile(null);
    } else {
      // Switching to upload tab, clear URL
      setFormData((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/books",
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
      console.error("Error adding book:", err);
      setError("Failed to add book");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add New Book
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

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={
                !formData.title ||
                !formData.description ||
                formData.authors.length === 0 ||
                formData.genres.length === 0
              }
            >
              Add Book
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddBook;
