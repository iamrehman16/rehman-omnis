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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { 
  LogoutOutlined, 
  PersonOutline, 
  AdminPanelSettings,
  Menu as MenuIcon,
  School,
  QuestionAnswer,
  Info,
  Close
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import RoleBasedAccess from "../common/RoleBasedAccess";

const Header = ({ currentTab, onTabChange, onProfileClick }) => {
  const { user, logout, getUserRole, isAdmin, canAccessAdminPages } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileNavigation = (value) => {
    onTabChange(null, value);
    handleMobileMenuClose();
  };

  const navigationItems = [
    { label: 'Resources', value: 'resources', icon: <School /> },
    { label: 'Ask', value: 'ask', icon: <QuestionAnswer /> },
    { label: 'About', value: 'about', icon: <Info /> },
    ...(getUserRole() === 'admin' ? [{ label: 'Admin', value: 'admin', icon: <AdminPanelSettings /> }] : [])
  ];

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        sx={{ bgcolor: "white", color: "text.primary" }}
      >
        <Toolbar sx={{ 
          justifyContent: "space-between",
          px: { xs: 1, sm: 2 },
          minHeight: { xs: 56, sm: 64 }
        }}>
          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo and Brand */}
         <Box sx={{ 
           display: "flex", 
           alignItems: "center", 
           gap: { xs: 1, sm: 2 },
           flex: 1,
           justifyContent: { xs: 'center', md: 'flex-start' }
         }}>
          <Box
            component="img"
            src="/omnis-logo.png"
            alt="Omnis Logo"
            sx={{
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <Typography
            variant="h5"
            sx={{ 
              fontWeight: "bold", 
              color: "text.primary",
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              display: { xs: 'block', sm: 'block' }
            }}
          >
            Omnis
          </Typography>
        </Box>

          {/* Desktop Navigation Tabs */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' },
            justifyContent: "center",
            mx: 2
          }}>
            <Tabs
              value={currentTab}
              onChange={onTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  minWidth: 120,
                  px: 2,
                },
              }}
            >
              <Tab label="Resources" value="resources" />
              <Tab label="Ask" value="ask" />
              <Tab label="About" value="about" />
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
          <Box sx={{ flex: '0 0 auto' }}>
            <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
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

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src="/omnis-logo.png"
              alt="Omnis Logo"
              sx={{
                width: 32,
                height: 32,
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Omnis
            </Typography>
          </Box>
          <IconButton onClick={handleMobileMenuClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.value} disablePadding>
              <ListItemButton
                selected={currentTab === item.value}
                onClick={() => handleMobileNavigation(item.value)}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: currentTab === item.value ? 600 : 400
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mt: 'auto' }} />
        
        {/* User Info in Mobile Menu */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={user?.photoURL}
              sx={{
                bgcolor: "primary.main",
                width: 40,
                height: 40,
                fontSize: "1rem",
              }}
            >
              {getUserInitials(user?.displayName, user?.email)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
                {user?.displayName || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip 
              label={getRoleLabel(userRole)} 
              size="small" 
              color={getRoleColor(userRole)}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PersonOutline />}
              onClick={() => {
                handleProfileClick();
                handleMobileMenuClose();
              }}
              sx={{ justifyContent: 'flex-start' }}
            >
              Profile
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutOutlined />}
              onClick={() => {
                handleLogoutClick();
                handleMobileMenuClose();
              }}
              sx={{ justifyContent: 'flex-start' }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>

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
