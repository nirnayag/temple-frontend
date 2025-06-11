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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useMemo, useState } from "react";

// Dummy data for illustration
const generateDummyData = () =>
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Devotee ${i + 1}`,
    email: `devotee${i + 1}@example.com`,
  }));

export default function ViewAllListDialoge({
  open,
  onClose,
  getData,
  EditData,
  deleteData,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPagesData] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    setPagesData(generateDummyData()); // Replace this with your API call
  }, []);

  const filteredData = useMemo(() => {
    return pageData.filter((devotee) =>
      devotee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, pageData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  function handleEdit() {}

  function handleDelete() {}

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#fffaf2",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          m: { xs: 1, sm: 2 }, // margin around dialog on small screens
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(to right, #e67e22, #d35400)",
          color: "white",
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          View pageData
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#fff8ed" }}>
        {/* Search */}
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

        {/* Table */}
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650, backgroundColor: "#fff" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Phone</strong>
                </TableCell>
                <TableCell>
                  <strong>Membership</strong>
                </TableCell>
                <TableCell>
                  <strong>Member Since</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((devotee) => (
                <TableRow key={devotee.id}>
                  <TableCell>{devotee.name}</TableCell>
                  <TableCell>{devotee.email}</TableCell>
                  <TableCell>{devotee.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        backgroundColor: "#2196f3",
                        color: "#fff",
                        borderRadius: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      {devotee.membership || "regular"}
                    </Typography>
                  </TableCell>
                  <TableCell>{devotee.memberSince || "N/A"}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(devotee)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(devotee.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      No pageData found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Pagination */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
          color="warning"
        />
      </DialogContent>

      {/* Actions */}
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
