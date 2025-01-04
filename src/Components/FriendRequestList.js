import React from 'react';
import { List, ListItem, Button, Typography, Box } from '@mui/material';

const FriendRequestList = ({ friendRequests, handleRequestResponse }) => (
  <Box sx={{ height: '100%', overflow: 'auto' }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Friend Requests
    </Typography>
    <List>
      {friendRequests.map((request) => (
        <ListItem
          key={request.id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography>{request.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              City: {request.city}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              onClick={() => handleRequestResponse(request.id, true)}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRequestResponse(request.id, false)}
            >
              Reject
            </Button>
          </Box>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default FriendRequestList;
