import React from 'react';
import { List, ListItem, Button, Typography, Box, CircularProgress } from '@mui/material';

const FriendRecommendationsList = ({ recommendations, loading, handleAddFriend, isYourFriendsRoute }) => (
  <Box sx={{ height: '100%', overflow: 'auto' }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      {isYourFriendsRoute ? 'Your Friends List' : 'Friend Recommendations'}
    </Typography>
    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    ) : (
      <List>
        {recommendations.map((friend) => (
          <ListItem
            key={friend._id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography>{friend.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                City: {friend.city}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color={isYourFriendsRoute ? 'secondary' : 'primary'}
              onClick={() => handleAddFriend(friend._id, isYourFriendsRoute)}
            >
              {isYourFriendsRoute ? 'Unfriend' : 'Add Friend'}
            </Button>
          </ListItem>
        ))}
      </List>
    )}
  </Box>
);

export default FriendRecommendationsList;
