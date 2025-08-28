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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          You must be logged in to access the admin panel.
        </Alert>
      </Container>
    );
  }

  if (!isAdmin() || !canViewAdminPanel()) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <AdminPanelSettings color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Admin Panel
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users, contributors, and system statistics
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab
            icon={<Dashboard />}
            label="Dashboard"
            sx={{ textTransform: "none" }}
          />
          <Tab
            icon={<PersonAdd />}
            label="Pending Requests"
            sx={{ textTransform: "none" }}
          />
          <Tab
            icon={<People />}
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
