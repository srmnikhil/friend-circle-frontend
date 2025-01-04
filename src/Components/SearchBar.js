import React from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <TextField
      variant="outlined"
      label="Search friends"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      fullWidth
    />
    <IconButton color="primary" onClick={handleSearch} sx={{ ml: 1 }}>
      <SearchIcon />
    </IconButton>
  </Box>
);

export default SearchBar;
