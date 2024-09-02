import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    // const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // Can be 'success' or 'error'
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/api/login', { email, password });

            // Assuming the token is in response.data.token
            const token = response.data.token;

            // Store the token in localStorage
            localStorage.setItem('authToken', token);
            console.log(token)
            // Set success message and severity, then open Snackbar
            setSnackbarMessage('Login successful!');
            // setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Redirect to the home page after a delay
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.log('Error while logging in:', error.response?.data?.message || error.message);
            setSnackbarMessage(error.response?.data?.message || 'An error occurred');
            // setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor="#f5f5f5"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 4,
                    bgcolor: 'white',
                    boxShadow: 3,
                    borderRadius: 2,
                    minWidth: 300,
                }}
            >
                <Typography variant="h5" gutterBottom textAlign="center">
                    Login
                </Typography>
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
            </Box>

            {/* Snackbar to display messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar}  sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Login;