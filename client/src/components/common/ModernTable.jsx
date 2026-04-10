import { useState } from "react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const ModernTable = ({
  title,
  columns = [],
  data,
  rows, // Support both data and rows props
  searchable = true,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Use rows if provided, otherwise use data
  const tableData = rows || data || [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Card>
      <CardContent>
        {/* Header */}
        {(title || searchable) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            {title && (
              <Typography variant="h6" fontWeight={600}>
                {title}
              </Typography>
            )}
            {searchable && (
              <TextField
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Box>
        )}

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      width:
                        column.width ||
                        (column.flex ? `${column.flex * 150}px` : "auto"),
                    }}
                  >
                    {column.headerName || column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No data found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <TableRow
                    key={row.id || row._id || rowIndex}
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {column.renderCell
                          ? column.renderCell({ row, value: row[column.field] })
                          : column.render
                            ? column.render(row)
                            : row[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </CardContent>
    </Card>
  );
};

export default ModernTable;
