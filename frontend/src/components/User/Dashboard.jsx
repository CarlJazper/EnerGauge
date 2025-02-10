import React, { useState, useEffect } from 'react';
import Loader from '../layouts/Loader';
import { Typography} from '@mui/material';


const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
  
    <Typography sx={{ fontSize:'20px',textAlign:'center',pt:'15rem' }}>
      This is a User Dashboard
    </Typography>
   
  );
};

export default Home;
