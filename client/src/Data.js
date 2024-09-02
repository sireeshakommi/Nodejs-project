import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';

const Data = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch users from the API
    axios.get('http://localhost:3001/api/signup')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, password: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = () => {
    if (selectedUser) {
      axios.put(`http://localhost:3001/api/signup/${selectedUser._id}`, formData)
        .then(response => {
          // Update the users list with the updated user
          const updatedUsers = users.map(user =>
            user._id === response.data._id ? response.data : user
          );
          setUsers(updatedUsers);
          handleClose();
        })
        .catch(error => {
          console.error('Error updating user:', error);
        });
    }
  };

  return (
    <div>
      <h2>Update User</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handleUpdateClick(user)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Data;