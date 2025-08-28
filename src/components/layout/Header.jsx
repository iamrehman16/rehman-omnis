import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import { LogoutOutlined, PersonOutline, AdminPanelSettings } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import RoleBasedAccess from "../common/RoleBasedAccess";

const Header = ({ currentTab, onTabChange, onProfileClick }) => {
  const { user, logout, getUserRole, isAdmin, canAccessAdminPages } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    handleMenuClose();
  };

  const handleProfileClick = () => {
    onProfileClick();
    handleMenuClose();
  };

  // Get user role for display
  const userRole = getUserRole();
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'contributor': return 'primary';
      case 'pending_contributor': return 'warning';
      default: return 'default';
    }
  };
  
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'contributor': return 'Contributor';
      case 'pending_contributor': return 'Pending';
      case 'rejected_contributor': return 'Student';
      default: return 'Student';
    }
  };

  const handleLogoutConfirm = async () => {
    await logout();
    setLogoutDialogOpen(false);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const getUserInitials = (displayName, email) => {
    if (displayName) {
      return displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
    }
    return email ? email[0].toUpperCase() : "U";
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        sx={{ bgcolor: "white", color: "text.primary" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo and Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                O
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              Omnis
            </Typography>
          </Box>

          {/* Navigation Tabs */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Tabs
              value={currentTab}
              onChange={onTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  minWidth: 120,
                },
              }}
            >
              <Tab label="Resources" value="resources" />
              <Tab label="Ask" value="ask" />
              {getUserRole() === 'admin' && (
                <Tab 
                  label="Admin" 
                  value="admin" 
                  icon={<AdminPanelSettings />}
                  iconPosition="start"
                />
              )}
            </Tabs>

          </Box>

          {/* User Avatar */}
          <Box>
            <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                }}
                src={user?.photoURL}
              >
                {getUserInitials(user?.displayName, user?.email)}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.displayName || "User"}
            </Typography>
            <Chip 
              label={getRoleLabel(userRole)} 
              size="small" 
              color={getRoleColor(userRole)}
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfileClick} sx={{ gap: 1, py: 1.5 }}>
          <PersonOutline fontSize="small" />
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogoutClick} sx={{ gap: 1, py: 1.5 }}>
          <LogoutOutlined fontSize="small" />
          Logout
        </MenuItem>
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="primary"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
