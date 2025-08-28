import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  TextField,
  InputAdornment,
  TablePagination
} from '@mui/material';
import { Search } from '@mui/icons-material';
import userService from '../../services/user.service';
import BecomeContributorModal from '../user/BecomeContributorModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [contributorModalOpen, setContributorModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmittingContributor, setIsSubmittingContributor] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || 'student').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(0); // Reset to first page when filtering
  }, [users, searchTerm]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.searchUsers('');
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const user = users.find(u => u.id === userId);
    
    // If changing to contributor, open modal to collect details
    if (newRole === 'contributor' && user?.role !== 'contributor') {
      setSelectedUser({ id: userId, ...user });
      setContributorModalOpen(true);
      return;
    }

    // For other role changes, proceed normally
    setUpdating(prev => ({ ...prev, [userId]: true }));
    try {
      const result = await userService.updateUserRole(userId, newRole);
      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        alert(`User role updated to ${newRole} successfully!`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    } finally {
      setUpdating(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleContributorSubmit = async (specialties, bio) => {
    if (!selectedUser) return;

    setIsSubmittingContributor(true);
    try {
      // First update the role
      const roleResult = await userService.updateUserRole(selectedUser.id, 'contributor');
      if (!roleResult.success) {
        alert(roleResult.message);
        return;
      }

      // Then update the contributor profile with specialties and bio
      const profileResult = await userService.updateContributorProfile(selectedUser.id, {
        specialties,
        bio
      });

      if (profileResult.success) {
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? { ...user, role: 'contributor' } : user
        ));
        alert('User successfully made contributor with profile details!');
        setContributorModalOpen(false);
        setSelectedUser(null);
      } else {
        alert(profileResult.message);
      }
    } catch (error) {
      console.error('Error making user contributor:', error);
      alert('Failed to make user contributor');
    } finally {
      setIsSubmittingContributor(false);
    }
  };

  const handleContributorModalClose = () => {
    setContributorModalOpen(false);
    setSelectedUser(null);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'contributor': return 'primary';
      case 'pending_contributor': return 'warning';
      case 'rejected_contributor': return 'secondary';
      case 'student': return 'default';
      default: return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        User Management
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        Admin Panel: Be careful when changing user roles. This affects their permissions and visibility.
      </Alert>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Current Role</TableCell>
              <TableCell>Change Role</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={user.photoURL}
                      sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                    >
                      {user.displayName?.[0]}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user.displayName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={(user.role?.replace('_', ' ') || 'student').replace('rejected contributor', 'rejected')} 
                    color={getRoleColor(user.role)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select
                        value={user.role || 'student'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updating[user.id]}
                      >
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="contributor">Contributor</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                    {updating[user.id] && (
                      <CircularProgress size={16} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {filteredUsers.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No users found matching your search criteria.
          </Typography>
        </Box>
      )}

      {/* Contributor Details Modal */}
      <BecomeContributorModal
        open={contributorModalOpen}
        onClose={handleContributorModalClose}
        onSubmit={handleContributorSubmit}
        isSubmitting={isSubmittingContributor}
        isAdminMode={true}
      />
    </Box>
  );
};

export default UserManagement;