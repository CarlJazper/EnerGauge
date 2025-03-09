import React from "react";
import { 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  Container,
  useTheme,
  IconButton,
  Tooltip 
} from "@mui/material";
import ForecastData from "../User/UserForecast";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { styled } from '@mui/material/styles';

// Styled components
const DashboardContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(to right bottom, #ffffff, #fafafa)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const DashboardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  color: theme.palette.primary.main,
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 2,
  },
}));

const Dashboard = () => {
  const theme = useTheme();

  const downloadCSV = async () => {
    try {
      const response = await fetch('http://localhost:5000/download/csv', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status}`);
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'forecast_data.csv';
      link.click();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch('http://localhost:5000/download/pdf', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'forecast_data.pdf';
      link.click();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <DashboardContainer maxWidth="xl">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <StyledPaper elevation={0}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 4 
            }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary 
                }}
              >
                EnergyGauge
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Download CSV">
                  <IconButton 
                    onClick={downloadCSV}
                    sx={{ 
                      backgroundColor: theme.palette.primary.light,
                      '&:hover': { 
                        backgroundColor: theme.palette.primary.main,
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <TableChartIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download PDF">
                  <IconButton 
                    onClick={downloadPDF}
                    sx={{ 
                      backgroundColor: theme.palette.secondary.light,
                      '&:hover': { 
                        backgroundColor: theme.palette.secondary.main,
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <ForecastData />
          </StyledPaper>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;
