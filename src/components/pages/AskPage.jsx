import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Paper,
  Rating,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Chat,
  School,
  Search,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/user.service";
import resourcesService from "../../services/resources.service";
import BecomeContributorModal from "../user/BecomeContributorModal";
import ChatModal from "../common/ChatModal";



const AskPage = () => {
  const { user } = useAuth();
  const [contributors, setContributors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [becomeContributorOpen, setBecomeContributorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBecomingContributor, setIsBecomingContributor] = useState(false);
  const [userRole, setUserRole] = useState("student");
  const [canApplyForContributor, setCanApplyForContributor] = useState(false);
  const [totalResources, setTotalResources] = useState(0);

  useEffect(() => {
    loadContributors(); // This will also trigger loadResourceCount
    if (user) {
      loadUserRole();
    }
  }, [user]);

  const loadContributors = async () => {
    setLoading(true);
    try {
      const result = await userService.getContributors();
      if (result.success) {
        setContributors(result.data);
        // Load resource count after contributors are loaded (for fallback calculation)
        setTimeout(() => loadResourceCount(), 100);
      } else {
        console.error("Error loading contributors:", result.message);
        setContributors([]);
      }
    } catch (error) {
      console.error("Error loading contributors:", error);
      setContributors([]);
    } finally {
      setLoading(false);
    }
  };

  const loadResourceCount = async () => {
    try {
      console.log("Loading resources for stats...");
      const result = await resourcesService.getResources();
      console.log("Resources result:", result);
      
      if (result.success && result.data) {
        console.log("Resources data:", result.data);
        console.log("Resources count:", result.data.length);
        setTotalResources(result.data.length);
      } else {
        console.error("Error loading resources:", result.message);
        // Fallback: calculate from contributors' resource counts
        const contributorResourceCount = contributors.reduce((sum, c) => sum + (c.resourceCount || 0), 0);
        console.log("Using fallback contributor resource count:", contributorResourceCount);
        setTotalResources(contributorResourceCount);
      }
    } catch (error) {
      console.error("Error loading resources:", error);
      // Fallback: calculate from contributors' resource counts
      const contributorResourceCount = contributors.reduce((sum, c) => sum + (c.resourceCount || 0), 0);
      console.log("Using fallback contributor resource count:", contributorResourceCount);
      setTotalResources(contributorResourceCount);
    }
  };

  const loadUserRole = async () => {
    try {
      const result = await userService.getUserProfile(user.uid);
      if (result.success) {
        setUserRole(result.data.role || "student");
      }

      // Check if user can apply for contributor
      const eligibilityResult = await userService.canApplyForContributor(user.uid);
      if (eligibilityResult.success) {
        setCanApplyForContributor(eligibilityResult.canApply);
      }
    } catch (error) {
      console.error("Error loading user role:", error);
    }
  };

  const filteredContributors = contributors.filter(
    (contributor) =>
      contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleStartChat = (contributor) => {
    setSelectedContributor(contributor);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedContributor(null);
  };

  const handleBecomeContributor = async (specialties, bio) => {
    if (!user) return;

    setIsBecomingContributor(true);
    try {
      const result = await userService.requestContributorRole(
        user.uid,
        specialties,
        bio
      );
      if (result.success) {
        setUserRole("pending_contributor");
        alert(result.message || "Your contributor request has been submitted! An admin will review it soon.");
      } else {
        alert(result.message || "Failed to become a contributor");
      }
    } catch (error) {
      console.error("Error becoming contributor:", error);
      alert("Error becoming contributor");
    } finally {
      setIsBecomingContributor(false);
    }
  };

  const getSpecialtyColor = (specialty) => {
    const colors = {
      "Computer Science": "primary",
      Mathematics: "secondary",
      Physics: "info",
      Chemistry: "success",
      "English Literature": "warning",
      History: "error",
      Statistics: "secondary",
      Biology: "success",
      "Environmental Science": "info",
      Economics: "warning",
      "Business Studies": "primary",
    };
    return colors[specialty] || "default";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Connect with Contributors
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2, maxWidth: 600, mx: "auto" }}
          >
            Get help from experienced students and subject experts. Start a
            conversation and learn together!
          </Typography>

          {/* Premium Stats Cards */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mb: 4,
              flexWrap: "wrap",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                minWidth: 140,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <Typography
                variant="h3"
                sx={{ 
                  fontWeight: "bold",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {contributors.length}+
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 500,
                }}
              >
                Contributors
              </Typography>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                minWidth: 140,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <Typography
                variant="h3"
                sx={{ 
                  fontWeight: "bold",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {totalResources}+
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 500,
                }}
              >
                Resources
              </Typography>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                minWidth: 140,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <Typography
                variant="h3"
                sx={{ 
                  fontWeight: "bold",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                24/7
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 500,
                }}
              >
                Available
              </Typography>
            </Paper>
          </Box>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 500, mx: "auto", mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search contributors by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "background.paper",
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Contributors Grid */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Featured Contributors
          </Typography>
          {user && canApplyForContributor && (
            <Button
              variant="outlined"
              onClick={() => setBecomeContributorOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Become a Contributor
            </Button>
          )}
          {user && userRole === "pending_contributor" && (
            <Chip
              label="Application Pending"
              color="warning"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          )}
          {user && userRole === "rejected_contributor" && (
            <Chip
              label="Application Rejected"
              color="error"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading contributors...</Typography>
          </Box>
        ) : contributors.length === 0 ? (
          <Alert severity="info">
            No contributors available yet. Be the first to become a contributor and help other students!
          </Alert>
        ) : filteredContributors.length === 0 ? (
          <Alert severity="info">
            No contributors found matching your search criteria.
          </Alert>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {filteredContributors.map((contributor) => (
              <Card
                key={contributor.id}
                sx={{
                  width: 280,
                  height: 340,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Header */}
                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Avatar
                      src={contributor.avatar}
                      sx={{
                        width: 50,
                        height: 50,
                        mx: "auto",
                        mb: 1,
                        bgcolor: "primary.main",
                        fontSize: "1.2rem",
                      }}
                    >
                      {contributor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                    >
                      {contributor.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <Rating
                        value={contributor.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="caption" color="text.secondary">
                        ({contributor.totalRatings})
                      </Typography>
                    </Box>
                  </Box>

                  {/* Specialties */}
                  <Box
                    sx={{
                      mb: 2,
                      minHeight: 60,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        justifyContent: "center",
                        maxWidth: "100%",
                      }}
                    >
                      {contributor.specialties.map((specialty) => (
                        <Chip
                          key={specialty}
                          label={specialty}
                          size="small"
                          color={getSpecialtyColor(specialty)}
                          variant="outlined"
                          sx={{
                            fontSize: "0.7rem",
                            height: 24,
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Stats */}
                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      <School
                        fontSize="small"
                        sx={{ verticalAlign: "middle", mr: 0.5 }}
                      />
                      {contributor.resourceCount} resources shared
                    </Typography>
                  </Box>

                  {/* Bio */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      fontSize: "0.8rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textAlign: "center",
                      flexGrow: 1,
                      lineHeight: 1.4,
                    }}
                  >
                    {contributor.bio}
                  </Typography>

                  {/* Chat Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<Chat fontSize="small" />}
                    onClick={() => handleStartChat(contributor)}
                    sx={{ borderRadius: 2, mt: "auto" }}
                  >
                    Chat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Chat Modal */}
      <ChatModal
        open={chatOpen}
        onClose={handleCloseChat}
        contributor={selectedContributor}
      />

      {/* Become Contributor Modal */}
      <BecomeContributorModal
        open={becomeContributorOpen}
        onClose={() => setBecomeContributorOpen(false)}
        onSubmit={handleBecomeContributor}
        isSubmitting={isBecomingContributor}
      />
    </Container>
  );
};

export default AskPage;
