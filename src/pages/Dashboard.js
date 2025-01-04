import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CircularProgress, TextField, IconButton, List, ListItem, Button, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To get the current route
  const [searchQuery, setSearchQuery] = useState('');
  const [friendRecommendations, setFriendRecommendations] = useState([]);
  const [yourFriends, setYourFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]); // New state for pending friends
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchFriendRecommendations();
      setYourFriends(sampleFriends);
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const fetchFriendRecommendations = async (query = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/friends', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: query },
      });
      setFriendRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching friend recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.length > 0) {
      fetchFriendRecommendations(searchQuery); // Fetch filtered recommendations
    }
  };
  const handleReset = () => {
    setSearchQuery('');
    fetchFriendRecommendations();
  };

  const handleRequestResponse = (id, response) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  const handleAddFriend = (id) => {
    // Find the friend to add from the friendRecommendations list
    const friendToAdd = friendRecommendations.find((friend) => friend._id === id);

    if (friendToAdd) {
      // Move the friend to the pending friends list
      setPendingFriends([...pendingFriends, friendToAdd]);

      // Remove the friend from the recommendations list
      setFriendRecommendations(friendRecommendations.filter((friend) => friend._id !== id));
    }
  };

  const handleUnfriend = (id) => {
    setYourFriends(yourFriends.filter((friend) => friend._id !== id));
  };

  const handleCancelPending = (id) => {
    setPendingFriends(pendingFriends.filter((friend) => friend._id !== id));
    // Optionally, you can add the friend back to friendRecommendations
  };

  // Sample array of 8-10 friends for demonstration
  const sampleFriends = [
    { _id: '1', name: 'Alice', city: 'New York' },
    { _id: '2', name: 'Bob', city: 'Los Angeles' },
    { _id: '3', name: 'Charlie', city: 'Chicago' },
    { _id: '4', name: 'David', city: 'Miami' },
    { _id: '5', name: 'Eva', city: 'San Francisco' },
    { _id: '6', name: 'Frank', city: 'Seattle' },
    { _id: '7', name: 'Grace', city: 'Austin' },
    { _id: '8', name: 'Helen', city: 'Boston' },
    { _id: '9', name: 'Ian', city: 'Denver' },
    { _id: '10', name: 'Jack', city: 'Dallas' },
  ];

  const isPendingRequestsRoute = location.pathname === '/pending-requests';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 1 }}>
        Welcome to FriendCircle
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: 'italic', textAlign: 'center', mb: 3, color: 'text.secondary' }}>
        Friends Circle is a dynamic platform where you can seamlessly manage your connections. Effortlessly send, accept, or reject friend requests, explore mutual connections, and search for users to grow your network.
      </Typography>

      <Grid container spacing={2} sx={{ height: 'calc(100vh-100px)' }}>
        {/* Friend Requests or Pending Requests Section */}
        <Grid item xs={12} size={4}>
          <Card sx={{ height: '65vh' }}>
            <CardContent sx={{ height: '100%', overflow: 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {isPendingRequestsRoute ? 'Pending Requests' : 'Friend Requests'}
              </Typography>
              <List>
                {(isPendingRequestsRoute ? friendRequests : []).map((request) => (
                  <ListItem key={request.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography>{request.name}</Typography>
                      <Typography variant="body2" color="textSecondary">City: {request.city}</Typography>
                    </Box>
                    <Box>
                      <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleRequestResponse(request.id, true)}>Accept</Button>
                      <Button variant="outlined" color="error" onClick={() => handleRequestResponse(request.id, false)}>Reject</Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Friend Recommendations Section with Search Bar */}
        <Grid item xs={12} size={4}>
          <Card sx={{ height: '65vh' }}>
            <CardContent sx={{ height: '100%', overflow: 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Friend Recommendations</Typography>

              {/* Search Bar inside Friend Recommendations */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  variant="outlined"
                  label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {searchQuery && (
                          <IconButton onClick={handleReset}>
                            <ClearIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Display filtered Friend Recommendations */}
              <List>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  friendRecommendations.map((friend) => (
                    <ListItem key={friend._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography>{friend.name}</Typography>
                        <Typography variant="body2" color="textSecondary">City: {friend.city}</Typography>
                      </Box>
                      <IconButton onClick={() => handleAddFriend(friend._id)} color='primary'>
                        <PersonAddIcon />
                      </IconButton>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Your Friends Section */}
        <Grid item xs={12} size={4}>
          <Card sx={{ height: '65vh' }}>
            <CardContent sx={{ height: '100%', overflow: 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Your Friends List</Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {yourFriends.length > 0 ? yourFriends.map((friend) => (
                    <ListItem key={friend._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography>{friend.name}</Typography>
                        <Typography variant="body2" color="textSecondary">City: {friend.city}</Typography>
                      </Box>
                      <IconButton onClick={() => handleUnfriend(friend._id)} color="error">
                        <RemoveCircleIcon />
                      </IconButton>
                    </ListItem>
                  )) : (
                    <Typography variant="body2" color="text.secondary">No friends added yet</Typography>
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
