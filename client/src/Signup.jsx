import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState(''); // State to hold the error message
    const [openSnackbar, setOpenSnackbar] = useState(false); // State to manage the snackbar visibility
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return;
        }
        try {
            await axios.post('http://localhost:3001/api/signup', {
                firstName,
                lastName,
                email,
                password
            });

            // Reset form fields
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');

            // Redirect to the data table page after successful signup
            navigate('/Sample');
        } catch (error) {
            console.log('Error while signing up:', error.response?.data?.message || error.message);
            setError(error.response?.data?.message || 'An error occurred'); // Set the error message
            setOpenSnackbar(true); // Show the snackbar
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false); // Close the snackbar
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
                    Sign Up
                </Typography>
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
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
                    onChange={handlePasswordChange}
                    error={!!passwordError}
                    helperText={passwordError}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Sign UP
                </Button>
            </Box>

            {/* Snackbar to display error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Adjusted the 'top' and 'right' to lowercase
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Signup;