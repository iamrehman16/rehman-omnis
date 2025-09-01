import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard,
  People,
  PersonAdd,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/user.service";
import AdminStats from "../admin/AdminStats";
import PendingRequests from "../admin/PendingRequests";
import UserRoleManager from "../admin/UserRoleManager";
import AdminInitializer from "../admin/AdminInitializer";

const AdminPage = () => {
  const { user, isAdmin, canViewAdminPanel } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
        <Alert severity="error">
          You must be logged in to access the admin panel.
        </Alert>
      </Container>
    );
  }

  if (!isAdmin() || !canViewAdminPanel()) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
        <Alert severity="error">
          Access denied. You don't have admin privileges. Current role: {user?.role || 'unknown'}
        </Alert>
        <AdminInitializer />
      </Container>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return <AdminStats />;
      case 1:
        return <PendingRequests />;
      case 2:
        return <UserRoleManager />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: { xs: 1, sm: 2 }, 
          mb: 2 
        }}>
          <AdminPanelSettings 
            color="primary" 
            sx={{ 
              fontSize: { xs: 32, sm: 40 },
              alignSelf: { xs: 'flex-start', sm: 'auto' }
            }} 
          />
          <Box>
            <Typography
              variant="h4"
              sx={{ 
                fontWeight: "bold", 
                color: "primary.main",
                fontSize: { xs: '1.8rem', sm: '2.125rem' }
              }}
            >
              Admin Panel
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              Manage users, contributors, and system statistics
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              minWidth: { xs: 120, sm: 160 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }
          }}
        >
          <Tab
            icon={<Dashboard sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
            label="Dashboard"
            sx={{ textTransform: "none" }}
          />
          <Tab
            icon={<PersonAdd sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
            label="Pending Requests"
            sx={{ textTransform: "none" }}
          />
          <Tab
            icon={<People sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
            label="User Management"
            sx={{ textTransform: "none" }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>{renderTabContent()}</Box>
    </Container>
  );
};

export default AdminPage;
