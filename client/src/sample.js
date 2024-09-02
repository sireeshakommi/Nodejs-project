import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TextField,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sample = () => {
    const [data, setData] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const navigate = useNavigate();

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/signup');
            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Update user function
    const updateUser = async (userId, updatedData) => {
        try {
            // Retrieve token from localStorage
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found.');
            }
            console.log('Token for update:', token); // Debugging
    
            // Perform the PUT request to update user data
            const response = await axios.put(`http://localhost:3001/api/signup/${userId}`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${token}` // Ensure token is included with 'Bearer' prefix
                }
            });
    
            // Check response status if needed (usually 200 OK for successful updates)
            if (response.status === 200) {
                setSnackbarMessage('Updated successfully');
                setSnackbarSeverity('success'); // Set severity to 'success'
                setSnackbarOpen(true);
                fetchData(); // Refresh data
            } else {
                throw new Error('Unexpected response status: ' + response.status);
            }
    
        } catch (error) {
            // Log detailed error information
            console.error('Error details:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
    
            // Handle different error statuses
            if (error.response?.status === 401) {
                // Handle unauthorized access (e.g., token expired or invalid)
                setSnackbarMessage('Session expired or invalid token, please log in again');
                localStorage.removeItem('authToken'); // Clear invalid token
                navigate('/login'); // Redirect to login page
            } else if (error.response?.status === 403) {
                // Handle forbidden access (e.g., insufficient permissions)
                setSnackbarMessage('Access forbidden: you do not have permission to perform this action');
                setSnackbarSeverity('error'); // Set severity to 'error'
                setSnackbarOpen(true);
            } else {
                // Handle other types of errors
                setSnackbarMessage('Error updating user: ' + (error.response?.data?.message || error.message));
                setSnackbarSeverity('error'); // Set severity to 'error'
                setSnackbarOpen(true);
            }
        }
    };
    
    
    
    // Delete user function
    const deleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('Token for delete:', token);
            await axios.delete(`http://localhost:3001/api/signup/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSnackbarMessage('Deleted successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchData();
        } catch (error) {
            console.error('Error details:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);

            if (error.response?.status === 401) {
                setSnackbarMessage('Session expired, please log in again');
                localStorage.removeItem('authToken');
                navigate('/login');
            } else {
                setSnackbarMessage('Error deleting user: ' + (error.response?.data?.message || error.message));
                setSnackbarSeverity('error');
            }
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setOpenConfirmDialog(true);
    };

    const handleDeleteConfirm = () => {
        deleteUser(itemToDelete._id);
        setOpenConfirmDialog(false);
    };

    const handleEditClick = (item) => {
        setEditItem(item);
        setFirstName(item.firstName);
        setLastName(item.lastName);
        setEmail(item.email);
        setPassword(item.password);
        setOpenDialog(true);
    };

    const handleUpdate = () => {
        updateUser(editItem._id, {
            firstName,
            lastName,
            email,
            password
        });
        setOpenDialog(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ p: 5, minHeight: '100vh', ml: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 1200, mb: 2, ml: 10, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/signup')}
                    sx={{ flex: 1, maxWidth: { xs: '100%', sm: 200 } }}
                >
                    Add User
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/login')}
                    sx={{ flex: 1, maxWidth: { xs: '100%', sm: 200 } }}
                >
                    Login
                </Button>
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer component={Paper} sx={{ minWidth: 600 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>SNo</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Password</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.firstName}</TableCell>
                                    <TableCell>{item.lastName}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.password}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEditClick(item)} color="primary" sx={{ mr: 1 }}>
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDeleteClick(item)} color="secondary">
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="edit-dialog-title">
                <DialogTitle id="edit-dialog-title">Edit Item</DialogTitle>
                <DialogContent>
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
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">Update</Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} aria-labelledby="confirm-dialog-title">
                <DialogTitle id="confirm-dialog-title">Confirm Delete</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Sample;
