import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, TextField, IconButton, List, ListItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('currentUserId') || '');
  const [friendRecommendations, setFriendRecommendations] = useState([]);
  const [yourFriends, setYourFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchFriendRecommendations();
      fetchFriendRequests(); // Fetch all requests
      fetchCurrentUser();
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/user`, {
        headers: { 'auth-token': token },
      });
      const userId = response.data.user._id;
      setCurrentUserId(userId);
      localStorage.setItem('currentUserId', userId);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchFriendRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/request/fetchall`, {
        headers: { 'auth-token': token },
      });

      // Process all friend requests (sent and received)
      const friendRequestsWithDetails = await Promise.all(
        [...response.data.sentRequests, ...response.data.receivedRequests].map(async (request) => {
          const userDetails = await fetchUserDetails(request.senderId !== currentUserId ? request.senderId : request.receiverId);
          return { ...request, name: userDetails.name, city: userDetails.city };
        })
      );

      // Separate the requests based on their status
      const pendingRequests = friendRequestsWithDetails.filter(request => request.status === 'Pending');
      const acceptedRequests = friendRequestsWithDetails.filter(request => request.status === 'Accepted');

      // Set the states based on the status
      setFriendRequests(pendingRequests);
      setYourFriends(acceptedRequests);
      // setFriendRecommendations(otherRequests);

    } catch (error) {
      console.error('Error fetching all friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/request/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchFriendRecommendations = async (query = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Fetch friend recommendations
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/friends`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: query },
      });
      // Fetch existing friend requests (both sent and received)
      const requestsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/request/fetchall`, {
        headers: { 'auth-token': token },
      });

      // Extract the user IDs from the requests (sent and received) that have a valid status (pending or accepted)
      const validRequestUserIds = [
        ...requestsResponse.data.sentRequests,
        ...requestsResponse.data.receivedRequests,
      ]
        .filter(request => request.status === 'Pending' || request.status === 'Accepted')
        .map(request => (request.senderId !== currentUserId ? request.senderId : request.receiverId));

      // Step 1: Convert validRequestUserIds to a Set for faster lookups (optional but improves performance)
      const validRequestUserIdsSet = new Set(validRequestUserIds);

      // Step 2: Filter out recommendations where the user is already in validRequestUserIdsSet
      const filteredRecommendations = response.data.filter(friend => {
        // Check if the friend's ID is in validRequestUserIdsSet
        const isAlreadyRequested = validRequestUserIdsSet.has(friend._id);
        return !isAlreadyRequested;  // Exclude if the friend has a valid request
      });

      // Set the filtered friend recommendations
      setFriendRecommendations(filteredRecommendations);

    } catch (error) {
      console.error('Error fetching friend recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/request/handle`, { requestId, action }, {
        headers: { 'auth-token': token },
      });
      // If the request is accepted, add the user to your friends list
      if (action === 'accept') {
        const acceptedRequest = friendRequests.find(request => request.requestId === requestId);
        const newFriend = {
          _id: acceptedRequest.senderId !== currentUserId ? acceptedRequest.senderId : acceptedRequest.receiverId,
          name: acceptedRequest.name,
          city: acceptedRequest.city,
        };
        setYourFriends(prevFriends => [...prevFriends, newFriend]);
      }

      // Filter out the accepted/rejected request from the list
      setFriendRequests(friendRequests.filter(request => request.requestId !== requestId));
      fetchFriendRecommendations();
    } catch (error) {
      console.error('Error handling friend request:', error);
    }
  };

  const handleAddFriend = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/request/send`, { receiverId: id }, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
      });
      console.log("Friend request sent successfully.")
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
    fetchFriendRequests(); // Re-fetch requests
    fetchFriendRecommendations();
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

  const handleUnfriend = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/request/unfriend/${id}`, {
        headers: {
          "auth-token": token
        }
      });
      await fetchFriendRecommendations();
      setYourFriends(yourFriends.filter(friend => friend._id !== id));
    } catch (error) {
      console.error('Error unfriending user:', error);
    }
  };

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
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '65vh' }}>
            <CardContent sx={{ height: '100%', overflow: 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Friend Requests
              </Typography>

              <List>
                {friendRequests.length > 0 ? (
                  friendRequests.map((request) => (
                    <ListItem
                      key={request._id || `${request.senderId}-${request.receiverId}`}
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <Box>
                        <Typography>{request.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          City: {request.city}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Status: {request.status}
                        </Typography>
                      </Box>
                      <Box>
                        {request.senderId !== currentUserId && (
                          <IconButton
                            color="success"
                            onClick={() => handleRequestResponse(request.requestId, "accept")}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        )}
                        <IconButton
                          color="warning"
                        >
                          <PendingActionsIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleRequestResponse(request.requestId, "reject")}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ ml: 2, fontStyle: 'italic' }}
                  >
                    No Friend Requests Yet
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Friend Recommendations Section with Search Bar */}
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
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
                    <ListItem key={friend.receiverId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography>{friend.name}</Typography>
                        <Typography variant="body2" color="textSecondary">City: {friend.city}</Typography>
                      </Box>
                      <IconButton onClick={() => {
                        handleUnfriend(friend.senderId);
                      }} color="error">
                        <RemoveCircleIcon />
                      </IconButton>
                    </ListItem>
                  )) : (
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2, fontStyle: "italic" }}>No friends added yet</Typography>
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