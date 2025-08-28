import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  LinearProgress,
  Badge,
} from "@mui/material";
import {
  School,
  Description,
  Assignment,
  MenuBook,
  TipsAndUpdates,
  Quiz,
  CalendarToday,
  Person,
  Email,
  Star,
  Timeline,
  Verified,
  AccessTime,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/user.service";
import resourcesService from "../../services/resources.service";
import AdminInitializer from "../admin/AdminInitializer";

const ProfilePage = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userResources, setUserResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load user profile
      const profileResult = await userService.getUserProfile(user.uid);
      if (profileResult.success) {
        setUserProfile(profileResult.data);
      }

      // Load user statistics
      const statsResult = await userService.getUserStats(user.uid);
      if (statsResult.success) {
        setUserStats(statsResult.data);
      }

      // Load user's resources (only if not a student)
      if (profileResult.success && profileResult.data.role !== "student") {
        const resourcesResult = await resourcesService.getUserResources(
          user.uid
        );
        if (resourcesResult.success) {
          setUserResources(resourcesResult.data);
        }
      }

      // Load total users for community stats
      const adminStatsResult = await userService.getAdminStats();
      if (adminStatsResult.success) {
        setTotalUsers(adminStatsResult.data.users.total);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "Past Paper":
        return <Quiz />;
      case "Notes":
        return <Description />;
      case "Assignment":
        return <Assignment />;
      case "Reference Material":
        return <MenuBook />;
      case "Tips and Suggestions":
        return <TipsAndUpdates />;
      default:
        return <Description />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error";
      case "contributor":
        return "primary";
      case "pending_contributor":
        return "warning";
      case "rejected_contributor":
        return "default";
      default:
        return "success";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Verified />;
      case "contributor":
        return <Star />;
      case "pending_contributor":
        return <AccessTime />;
      default:
        return <Person />;
    }
  };

  const formatRole = (role) => {
    switch (role) {
      case "pending_contributor":
        return "Pending Contributor";
      case "rejected_contributor":
        return "Student";
      default:
        return role?.charAt(0).toUpperCase() + role?.slice(1) || "Student";
    }
  };

  const getDaysActive = () => {
    if (!userProfile?.createdAt) return 0;
    const now = new Date();
    const created = new Date(userProfile.createdAt);
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          You must be logged in to view your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: getRoleColor(userProfile?.role) + ".main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid white",
                }}
              >
                {getRoleIcon(userProfile?.role)}
              </Box>
            }
          >
            <Avatar
              src={user.photoURL}
              sx={{
                width: 100,
                height: 100,
                fontSize: "2.5rem",
                border: "4px solid white",
                boxShadow: 3,
              }}
            >
              {user.displayName?.[0] || user.email?.[0]}
            </Avatar>
          </Badge>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {user.displayName || "User"}
              </Typography>
              <Chip
                icon={getRoleIcon(userProfile?.role)}
                label={formatRole(userProfile?.role)}
                color={getRoleColor(userProfile?.role)}
                size="small"
                sx={{ fontWeight: 500 }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Email fontSize="small" color="action" />
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {userProfile?.createdAt && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Joined {userProfile.createdAt.toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Timeline fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {getDaysActive()} days active
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Compact Statistics Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Community Rank - Always visible */}
        <Grid item xs={6} sm={4} md={3}>
          <Card
            elevation={1}
            sx={{
              height: 120,
              bgcolor: "white",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent
              sx={{
                p: 2,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Person color="primary" sx={{ fontSize: 28, mb: 1 }} />
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
                #
                {totalUsers > 0
                  ? Math.floor(Math.random() * totalUsers) + 1
                  : "---"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Community Rank
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Days Active - Always visible */}
        <Grid item xs={6} sm={4} md={3}>
          <Card
            elevation={1}
            sx={{
              height: 120,
              bgcolor: "white",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent
              sx={{
                p: 2,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Timeline color="primary" sx={{ fontSize: 28, mb: 1 }} />
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
                {getDaysActive()}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Days Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Role-specific Stats */}
        {userProfile?.role !== "student" ? (
          <>
            {/* Resources Shared */}
            <Grid item xs={6} sm={4} md={3}>
              <Card
                elevation={1}
                sx={{
                  height: 120,
                  bgcolor: "white",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent
                  sx={{
                    p: 2,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <School color="primary" sx={{ fontSize: 28, mb: 1 }} />
                  <Typography
                    variant="h5"
                    color="primary.main"
                    sx={{ fontWeight: "bold", mb: 0.5 }}
                  >
                    {userStats?.totalResources || 0}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    Resources Shared
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Contributor Rating */}
            {userProfile?.role === "contributor" && (
              <Grid item xs={6} sm={4} md={3}>
                <Card
                  elevation={1}
                  sx={{
                    height: 120,
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Star color="primary" sx={{ fontSize: 28, mb: 1 }} />
                    <Typography
                      variant="h5"
                      color="primary.main"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
                      {userProfile?.rating?.toFixed(1) || "0.0"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: "center" }}
                    >
                      Rating ({userProfile?.totalRatings || 0})
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </>
        ) : (
          /* Student Learning Progress */
          <Grid item xs={6} sm={4} md={3}>
            <Card
              elevation={1}
              sx={{
                height: 120,
                bgcolor: "white",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <School color="primary" sx={{ fontSize: 28, mb: 1 }} />
                <Typography
                  variant="h5"
                  color="primary.main"
                  sx={{ fontWeight: "bold", mb: 0.5 }}
                >
                  {Math.min(getDaysActive(), 30)}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  Learning Days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Total Members - Always visible */}
        <Grid item xs={6} sm={4} md={3}>
          <Card
            elevation={1}
            sx={{
              height: 120,
              bgcolor: "white",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent
              sx={{
                p: 2,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Person color="primary" sx={{ fontSize: 28, mb: 1 }} />
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
                {totalUsers}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Total Members
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Specialties Section - Only for contributors */}
      {userProfile?.role === "contributor" &&
        userProfile?.specialties?.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Specialties
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {userProfile.specialties.map((specialty, index) => (
                <Chip
                  key={index}
                  label={specialty}
                  variant="outlined"
                  size="small"
                  color="primary"
                />
              ))}
            </Box>
          </Paper>
        )}

      {/* Resource Breakdown - Only for non-students */}
      {userProfile?.role !== "student" &&
        userStats?.resourcesByType &&
        Object.keys(userStats.resourcesByType).length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Resource Contributions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              {Object.entries(userStats.resourcesByType).map(
                ([type, count]) => (
                  <Grid item xs={6} sm={4} md={3} key={type}>
                    <Card variant="outlined" sx={{ textAlign: "center", p: 2 }}>
                      {getResourceIcon(type)}
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                        {count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type}
                      </Typography>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          </Paper>
        )}

      {/* Bio Section - Only for contributors */}
      {userProfile?.role === "contributor" && userProfile?.bio && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            About Me
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.7 }}
          >
            {userProfile.bio}
          </Typography>
        </Paper>
      )}

      {/* Recent Resources - Only for non-students */}
      {userProfile?.role !== "student" && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Recent Contributions
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {userResources.length > 0 ? (
            <Grid container spacing={2}>
              {userResources.slice(0, 6).map((resource) => (
                <Grid item xs={12} sm={6} md={4} key={resource.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        {getResourceIcon(resource.type)}
                        <Typography
                          variant="subtitle2"
                          noWrap
                          sx={{ fontWeight: 500 }}
                        >
                          {resource.name}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {resource.subject} • Semester {resource.semester}
                      </Typography>
                      <Chip
                        label={resource.type}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              You haven't shared any resources yet. Start by adding your first
              resource to help the community!
            </Alert>
          )}
        </Paper>
      )}

      {/* Admin Initializer - Temporary for setup */}
      {user?.email === "rahmanhere642@gmail.com" && (
        <Box sx={{ mt: 4 }}>
          <AdminInitializer />
        </Box>
      )}
    </Container>
  );
};

export default ProfilePage;
