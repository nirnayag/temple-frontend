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
import DevoteeDialogForm from "components/devotees/DevoteeDialogForm";
import { useDeleteDevotee } from "tanstack/Queries/devotees_tanstack";
import { toast } from "react-toastify";

export default function ViewAllListDialoge({
  open,
  onClose,
  usePaginatedHook,
  dataKey,
  handleEditData,
  handleDelete,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPagesData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [openDevoteeForm, setOpenDevoteeForm] = useState(false);
  const [editDevoteeFormData, setEditDevoteeFormData] = useState([]);
  const [openeditEventForm, setOpenEditEventForm] = useState(false);

  const { data, isLoading, isError } = usePaginatedHook({
    page: currentPage,
    limit: itemsPerPage,
    enabled: open,
  });
  function handleDevoteeDelete(id) {
    if (window.confirm("Are you sure you want to delete this devotee?")) {
      handleDelete(
        { id },
        {
          onSuccess: () => {
            toast.success("Devotee has been deleted");
          },
        }
      );
    }
  }

  useEffect(() => {
    setPagesData(data?.devotees);
    setTotalPages(data?.totalPages);
  }, [data]);

  function handleEdit() {}

  if (isError) {
    return <p>Error in paginated component</p>;
  }

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
                {data?.devotees?.length >= 1 &&
                  Object.keys(data?.devotees[0])?.map((key, index) => {
                    let allowedHeadings = [
                      "email",
                      "name",
                      "mobileNumber",
                      "_id",
                      "membershipType",
                      "memberSince",
                    ];

                    if (allowedHeadings.includes(key)) {
                      return (
                        <TableCell>
                          <strong>{key}</strong>
                        </TableCell>
                      );
                    }
                  })}
                <TableCell>
                  <strong>Edit</strong>
                </TableCell>
                <TableCell>
                  <strong>Delete</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.devotees.map((devotee) => (
                <TableRow key={devotee._id}>
                  <TableCell>{devotee._id}</TableCell>
                  <TableCell>{devotee.name}</TableCell>
                  <TableCell>{devotee.email}</TableCell>
                  <TableCell>{devotee.mobileNumber || "N/A"}</TableCell>
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
                      {devotee.membershipType || "regular"}
                    </Typography>
                  </TableCell>
                  <TableCell>{devotee.memberSince || "N/A"}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary">
                      <EditIcon
                        onClick={() => {
                          setOpenDevoteeForm(true);
                          setEditDevoteeFormData(devotee);
                        }}
                      />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error">
                      <DeleteIcon
                        onClick={() => {
                          handleDevoteeDelete(devotee._id);
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {data?.devotees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      No pageData found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {data?.devotees.length === 0 && (
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
      <DevoteeDialogForm
        open={openDevoteeForm}
        onClose={() => {
          setOpenDevoteeForm(false);
        }}
        devoteeDataforEdit={editDevoteeFormData}
      />
    </Dialog>
  );
}
