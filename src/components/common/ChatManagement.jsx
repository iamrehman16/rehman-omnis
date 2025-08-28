import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Typography,
  Badge,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import chatService from "../../services/chat.service";
import userService from "../../services/user.service";
import ChatModal from "./ChatModal";

const ChatManagement = ({ open, onClose }) => {
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentProfiles, setStudentProfiles] = useState(new Map());

  // Ref for real-time listener cleanup
  const unsubscribeConversationsRef = useRef(null);

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return messageTime.toLocaleDateString();
  };

  // Truncate message for preview
  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return "No messages yet";
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  // Load student profile data
  const loadStudentProfile = async (studentId) => {
    if (studentProfiles.has(studentId)) {
      return studentProfiles.get(studentId);
    }

    try {
      const result = await userService.getUserProfile(studentId);
      if (result.success) {
        const profile = result.data;
        setStudentProfiles((prev) => new Map(prev.set(studentId, profile)));
        return profile;
      }
    } catch (error) {
      console.error("Error loading student profile:", error);
    }

    // Return default profile if loading fails
    const defaultProfile = {
      displayName: "Unknown Student",
      photoURL: null,
      email: "",
    };
    setStudentProfiles((prev) => new Map(prev.set(studentId, defaultProfile)));
    return defaultProfile;
  };

  // Initialize conversations and set up real-time listener
  const initializeConversations = async () => {
    if (!currentUser?.uid) return;

    setLoading(true);
    setError(null);

    try {
      // Set up real-time listener for conversations
      const unsubscribe = chatService.subscribeToConversations(
        currentUser.uid,
        async (result) => {
          if (result.success) {
            const conversationsData = result.data;
            setConversations(conversationsData);

            // Load student profiles for all conversations
            const studentIds = conversationsData
              .map((conv) => conv.studentId)
              .filter((id) => id && !studentProfiles.has(id));

            // Load profiles in parallel
            await Promise.all(
              studentIds.map((studentId) => loadStudentProfile(studentId))
            );
          } else {
            setError(result.message || "Failed to load conversations");
          }
          setLoading(false);
        }
      );

      unsubscribeConversationsRef.current = unsubscribe;
    } catch (error) {
      console.error("Error initializing conversations:", error);
      setError("Failed to initialize chat management");
      setLoading(false);
    }
  };

  // Handle conversation selection
  const handleConversationSelect = async (conversation) => {
    try {
      // Load student profile if not already loaded
      const studentProfile = await loadStudentProfile(conversation.studentId);

      setSelectedConversation(conversation);
      setSelectedStudent(studentProfile);

      // Mark messages as read when conversation is opened
      await chatService.markMessagesAsRead(conversation.id, currentUser.uid);
    } catch (error) {
      console.error("Error selecting conversation:", error);
      setError("Failed to open conversation");
    }
  };

  // Handle chat modal close
  const handleChatModalClose = () => {
    setSelectedConversation(null);
    setSelectedStudent(null);
  };

  // Initialize when component opens
  useEffect(() => {
    if (open && currentUser?.uid) {
      initializeConversations();
    }

    // Cleanup on close or unmount
    return () => {
      if (unsubscribeConversationsRef.current) {
        unsubscribeConversationsRef.current();
        unsubscribeConversationsRef.current = null;
      }
    };
  }, [open, currentUser?.uid]);

  // Don't render if not open or user is not a contributor
  if (!open || currentUser?.role !== "contributor") {
    return null;
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "500px" },
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          zIndex: 1300,
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ChatIcon color="primary" />
            <Typography variant="h6" component="h2">
              Chat Management
            </Typography>
          </Box>
          <Tooltip title="Close">
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {loading && (
            <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Box>
          )}

          {!loading && !error && conversations.length === 0 && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <PersonIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
              />
              <Typography variant="body1" color="text.secondary">
                No active conversations yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Students will appear here when they start chatting with you
              </Typography>
            </Box>
          )}

          {!loading && !error && conversations.length > 0 && (
            <List sx={{ flex: 1, overflow: "auto", p: 0 }}>
              {conversations.map((conversation, index) => {
                const studentProfile = studentProfiles.get(
                  conversation.studentId
                ) || {
                  displayName: "Loading...",
                  photoURL: null,
                };
                const unreadCount =
                  conversation.unreadCount?.[currentUser.uid] || 0;
                const isTyping =
                  conversation.typingStatus?.[conversation.studentId] || false;

                return (
                  <React.Fragment key={conversation.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleConversationSelect(conversation)}
                        sx={{
                          py: 2,
                          px: 2,
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            badgeContent={unreadCount}
                            color="primary"
                            max={99}
                            invisible={unreadCount === 0}
                          >
                            <Avatar
                              src={studentProfile.photoURL}
                              alt={studentProfile.displayName}
                              sx={{ width: 48, height: 48 }}
                            >
                              {studentProfile.displayName
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight:
                                    unreadCount > 0 ? "bold" : "normal",
                                  flex: 1,
                                }}
                              >
                                {studentProfile.displayName}
                              </Typography>
                              {conversation.lastMessageTime && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {formatTimestamp(
                                    conversation.lastMessageTime
                                  )}
                                </Typography>
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              {isTyping ? (
                                <Chip
                                  label="typing..."
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: "0.75rem" }}
                                />
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    fontWeight:
                                      unreadCount > 0 ? "medium" : "normal",
                                  }}
                                >
                                  {truncateMessage(conversation.lastMessage)}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < conversations.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>
      </Paper>

      {/* Chat Modal for selected conversation */}
      {selectedConversation && selectedStudent && (
        <ChatModal
          open={true}
          onClose={handleChatModalClose}
          contributor={selectedStudent}
          conversationId={selectedConversation.id}
        />
      )}
    </>
  );
};

export default ChatManagement;
