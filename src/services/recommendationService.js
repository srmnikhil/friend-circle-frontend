import axios from 'axios';

// Function to fetch friend recommendations
const getFriendRecommendations = async () => {
  try {
    const response = await axios.get('/api/recommendations', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Or wherever your token is stored
      }
    });
    
    // Extracting the data from the response
    return response.data.recommendations.map(recommendation => ({
      id: recommendation.user._id,
      name: recommendation.user.name,
      city: recommendation.user.city,
      mutualConnectionsCount: recommendation.mutualConnectionsCount
    }));
  } catch (error) {
    console.error('Error fetching friend recommendations:', error);
    throw error;
  }
};

export default getFriendRecommendations;
