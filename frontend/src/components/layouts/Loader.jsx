import React from 'react';
import { Box } from '@mui/material';

const Loader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background to overlay content
      }}
    >
      <img
        src="/assets/loading.gif" // Your GIF in the public/assets folder
        alt="Loading..."
        style={{ width: '100px', height: '100px' }} // Adjust size of the gif
      />
    </Box>
  );
};

export default Loader;
