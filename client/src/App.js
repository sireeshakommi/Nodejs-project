import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import Signup from './Signup';
import Sample from './sample';
import Login from './Login'

const HomePage = () => {
    const navigate = useNavigate();
    
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor="#f5f5f5"
        >
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/signup')}
                sx={{ mb: 2 }}
            >
                Add User
            </Button>
            <Sample />
        </Box>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/Sample" element={<Sample />} />
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </Router>
    );
};

export default App;