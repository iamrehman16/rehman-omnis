import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Fab,
  Badge,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Collapse,
  Chip,
  Divider,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  ExpandMore,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import TypingIndicator from "./TypingIndicator";
import ReadReceiptIndicator from "./ReadReceiptIndicator";

const FloatingChat = () => {
  const { user: currentUser } = useAuth();
  const {
    conversations,
    totalUnreadCount,
    userProfiles,
    getConversation,
    getConversationMessages,
    getConversationTypingStatus,
    getOtherParticipant,
    subscribeToConversationMessages,
    subscribeToConversationTyping,
    unsubscribeFromConversation,
    loadConversationMessages,
    markMessagesAsRead,
    sendMessage,
    updateTypingStatus,
  } = useChat();

  // Local UI state
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Get current conversation and related data
  const selectedConversation = selectedConversationId
    ? getConversation(selectedConversationId)
    : null;
  const selectedUser = selectedConversation
    ? getOtherParticipant(selectedConversation)
    : null;
  const messages = selectedConversationId
    ? getConversationMessages(selectedConversationId)
    : [];
  const typingStatus = selectedConversationId
    ? getConversationTypingStatus(selectedConversationId)
    : {};

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;

    return messageTime.toLocaleDateString();
  };

  // Truncate message for preview
  const truncateMessage = (message, maxLength = 30) => {
    if (!message) return "No messages yet";
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  // Handle conversation selection
  const handleConversationSelect = async (conversation) => {
    try {
      setLoading(true);
      setSelectedConversationId(conversation.id);

      // Load messages and set up listeners
      await loadConversationMessages(conversation.id);
      subscribeToConversationMessages(conversation.id);
      subscribeToConversationTyping(conversation.id);

      // Mark messages as read after a short delay to ensure listeners are set up
      setTimeout(async () => {
        await markMessagesAsRead(conversation.id);
      }, 100);

      setLoading(false);
    } catch (error) {
      console.error("Error selecting conversation:", error);
      setLoading(false);
    }
  };

  // Handle going back to conversation list
  const handleBackToList = () => {
    if (selectedConversationId) {
      unsubscribeFromConversation(selectedConversationId);
    }
    setSelectedConversationId(null);
    setNewMessage("");
  };

  // Handle message input change
  const handleMessageChange = (event) => {
    const value = event.target.value;
    setNewMessage(value);

    // Handle typing indicators
    if (selectedConversationId) {
      updateTypingStatus(selectedConversationId, value.trim().length > 0);
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (
      !newMessage.trim() ||
      !selectedConversation ||
      !currentUser ||
      sending
    ) {
      return;
    }

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage("");

    // Stop typing indicator when sending message
    if (selectedConversation && currentUser) {
      updateTypingStatus(selectedConversation.id, false);
    }

    try {
      const success = await sendMessage(selectedConversation.id, messageText);

      if (!success) {
        setNewMessage(messageText);
        console.error("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  // Handle key down for sending messages
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // // Format timestamp
  // const formatTimestamp = (timestamp) => {
  //   if (!timestamp) return '';
  //   return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // };

  // Get read status for a message
  const getMessageReadStatus = (message) => {
    if (!message.isOwn || !message.timestamp) return "sent";
    if (!message.readBy || !selectedConversation) return "delivered";

    const otherParticipantId = selectedConversation.participants?.find(
      (id) => id !== currentUser?.uid
    );
    if (!otherParticipantId) return "delivered";

    const isReadByOther = message.readBy && message.readBy[otherParticipantId];

    // Debug logging - only log when status changes or for debugging
    if (message.id && (isReadByOther || Math.random() < 0.1)) {
      // Log 10% of the time or when read
      console.log("Message read status check:", {
        messageId: message.id,
        messageText: message.message?.substring(0, 20) + "...",
        isOwn: message.isOwn,
        readBy: message.readBy,
        otherParticipantId,
        isReadByOther: !!isReadByOther,
        readByOtherTimestamp: isReadByOther,
        status: isReadByOther ? "read" : "delivered",
      });
    }

    return isReadByOther ? "read" : "delivered";
  };

  // Get other participant's typing status
  const getOtherParticipantTyping = () => {
    if (!selectedConversation || !currentUser || !typingStatus) return false;
    const otherParticipantId = selectedConversation.participants?.find(
      (id) => id !== currentUser.uid
    );
    return otherParticipantId ? typingStatus[otherParticipantId] : false;
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup any active conversation subscriptions
      if (selectedConversationId) {
        unsubscribeFromConversation(selectedConversationId);
      }
    };
  }, [selectedConversationId, unsubscribeFromConversation]);

  // Cleanup when closing chat
  useEffect(() => {
    if (!isExpanded) {
      handleBackToList();
    }
  }, [isExpanded]);

  // Don't render if user is not logged in
  if (!currentUser) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Interface */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        {/* Chat Interface */}
        <Collapse in={isExpanded}>
          <Paper
            elevation={8}
            sx={{
              width: 350,
              height: 500,
              mb: 1,
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {selectedConversation ? (
                <>
                  <IconButton
                    size="small"
                    onClick={handleBackToList}
                    sx={{ color: "white", mr: 1 }}
                  >
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flex: 1,
                    }}
                  >
                    <Avatar
                      src={selectedUser?.photoURL}
                      alt={selectedUser?.displayName}
                      sx={{ width: 32, height: 32 }}
                    >
                      {selectedUser?.displayName?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontSize: "0.9rem" }}>
                      {selectedUser?.displayName}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                  Messages
                </Typography>
              )}
              <IconButton
                size="small"
                onClick={() => setIsExpanded(false)}
                sx={{ color: "white" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Content Area */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {selectedConversation ? (
                /* Chat View */
                <>
                  {/* Messages Area */}
                  <Box
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    {loading ? (
                      <Box
                        sx={{ display: "flex", justifyContent: "center", p: 2 }}
                      >
                        <CircularProgress size={24} />
                      </Box>
                    ) : messages.length === 0 ? (
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          color: "text.secondary",
                        }}
                      >
                        <Typography variant="body2">
                          Start a conversation with {selectedUser?.displayName}
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <Box
                            key={message.id}
                            sx={{
                              display: "flex",
                              justifyContent: message.isOwn
                                ? "flex-end"
                                : "flex-start",
                              mb: 0.5,
                            }}
                          >
                            <Paper
                              elevation={1}
                              sx={{
                                p: 1,
                                maxWidth: "75%",
                                backgroundColor: message.isOwn
                                  ? "primary.main"
                                  : "grey.100",
                                color: message.isOwn
                                  ? "primary.contrastText"
                                  : "text.primary",
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "0.85rem", mb: 0.5 }}
                              >
                                {message.message}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    opacity: 0.7,
                                    fontSize: "0.65rem",
                                  }}
                                >
                                  {message.timestamp
                                    ? formatTimestamp(message.timestamp)
                                    : "Sending..."}
                                </Typography>

                                {message.isOwn && message.timestamp && (
                                  <ReadReceiptIndicator
                                    status={getMessageReadStatus(message)}
                                  />
                                )}
                              </Box>
                            </Paper>
                          </Box>
                        ))}

                        {/* Typing indicator */}
                        <TypingIndicator
                          isVisible={getOtherParticipantTyping()}
                          userName={selectedUser?.displayName}
                        />

                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </Box>

                  {/* Message Input */}
                  <Box
                    sx={{
                      p: 1,
                      borderTop: 1,
                      borderColor: "divider",
                      display: "flex",
                      gap: 1,
                      alignItems: "flex-end",
                    }}
                  >
                    <TextField
                      fullWidth
                      multiline
                      maxRows={3}
                      placeholder={`Message ${selectedUser?.displayName}...`}
                      value={newMessage}
                      onChange={handleMessageChange}
                      onKeyDown={handleKeyDown}
                      variant="outlined"
                      size="small"
                      disabled={sending}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontSize: "0.85rem",
                        },
                      }}
                    />
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      color="primary"
                      size="small"
                      sx={{
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                        "&:disabled": {
                          backgroundColor: "grey.300",
                          color: "grey.500",
                        },
                      }}
                    >
                      {sending ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SendIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </>
              ) : (
                /* Conversations List View */
                <Box sx={{ overflow: "auto" }}>
                  {conversations.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        No conversations yet
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {conversations.map((conversation, index) => {
                        const otherUserId = conversation.participants?.find(
                          (id) => id !== currentUser.uid
                        );
                        const userProfile = userProfiles?.get(otherUserId) || {
                          displayName: "Loading...",
                          photoURL: null,
                        };
                        const unreadCount =
                          conversation.unreadCount?.[currentUser.uid] || 0;
                        const isTyping =
                          conversation.typingStatus?.[otherUserId] || false;

                        return (
                          <React.Fragment key={conversation.id}>
                            <ListItem disablePadding>
                              <ListItemButton
                                onClick={() =>
                                  handleConversationSelect(conversation)
                                }
                                sx={{ py: 1.5 }}
                              >
                                <ListItemAvatar>
                                  <Badge
                                    badgeContent={unreadCount}
                                    color="primary"
                                    max={99}
                                    invisible={unreadCount === 0}
                                  >
                                    <Avatar
                                      src={userProfile.photoURL}
                                      alt={userProfile.displayName}
                                      sx={{ width: 40, height: 40 }}
                                    >
                                      {userProfile.displayName
                                        ?.charAt(0)
                                        ?.toUpperCase() || "U"}
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
                                        variant="subtitle2"
                                        sx={{
                                          fontWeight:
                                            unreadCount > 0 ? "bold" : "normal",
                                          flex: 1,
                                        }}
                                      >
                                        {userProfile.displayName}
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
                                          sx={{
                                            height: 16,
                                            fontSize: "0.7rem",
                                          }}
                                        />
                                      ) : (
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          sx={{
                                            fontWeight:
                                              unreadCount > 0
                                                ? "medium"
                                                : "normal",
                                            fontSize: "0.8rem",
                                          }}
                                        >
                                          {truncateMessage(
                                            conversation.lastMessage
                                          )}
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
              )}
            </Box>
          </Paper>
        </Collapse>

        {/* Floating Action Button */}
        <Tooltip title={isExpanded ? "Close Messages" : "Open Messages"}>
          <Badge
            badgeContent={totalUnreadCount}
            color="error"
            max={99}
            invisible={totalUnreadCount === 0}
          >
            <Fab
              color="primary"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                width: 56,
                height: 56,
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              {isExpanded ? <ExpandMore /> : <ChatIcon />}
            </Fab>
          </Badge>
        </Tooltip>
      </Box>
    </>
  );
};

export default FloatingChat;
