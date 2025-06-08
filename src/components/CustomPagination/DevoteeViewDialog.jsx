import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  InputAdornment,
  Divider,
  Box,
  Pagination,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useMemo, useState } from "react";

// Dummy data for illustration
const generateDummyData = () =>
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Devotee ${i + 1}`,
    email: `devotee${i + 1}@example.com`,
  }));

export default function DevoteeViewDialog({ open, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [devotees, setDevotees] = useState([]);
  const itemsPerPage = 5;

  useEffect(() => {
    setDevotees(generateDummyData()); // Replace this with your API call
  }, []);

  const filteredDevotees = useMemo(() => {
    return devotees.filter((devotee) =>
      devotee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, devotees]);

  const totalPages = Math.ceil(filteredDevotees.length / itemsPerPage);
  const paginatedDevotees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDevotees.slice(start, start + itemsPerPage);
  }, [filteredDevotees, currentPage]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#fffaf2",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(to right, #e67e22, #d35400)",
          color: "white",
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          View Devotees
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#fff8ed" }}>
        <TextField
          fullWidth
          placeholder="Search by name..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="warning" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            bgcolor: "#fff",
            borderRadius: 1,
          }}
        />

        <List dense>
          {paginatedDevotees.map((devotee) => (
            <ListItem
              key={devotee.id}
              sx={{
                bgcolor: "#ffffff",
                borderRadius: 2,
                mb: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <ListItemText
                primary={
                  <Typography fontWeight="bold">{devotee.name}</Typography>
                }
                secondary={devotee.email}
              />
            </ListItem>
          ))}

          {paginatedDevotees.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
              No devotees found.
            </Typography>
          )}
        </List>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
          color="warning"
        />
      </DialogContent>

      {/* Actions (Optional) */}
      <DialogActions sx={{ px: { xs: 2, sm: 4 }, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            fontWeight: "bold",
            py: 1.5,
            fontSize: "1rem",
            borderRadius: "8px",
            borderColor: "#e67e22",
            color: "#e67e22",
            "&:hover": {
              borderColor: "#d35400",
              color: "#d35400",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
