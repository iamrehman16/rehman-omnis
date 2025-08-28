import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chat.service';
import TypingIndicator from './TypingIndicator';
import ReadReceiptIndicator from './ReadReceiptIndicator';

const ChatModal = ({ open, onClose, contributor, conversationId = null }) => {
  const { user: currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [typingStatus, setTypingStatus] = useState({});
  
  // Refs for real-time listeners and auto-scroll
  const unsubscribeMessagesRef = useRef(null);
  const unsubscribeTypingRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Initialize conversation and set up real-time listeners
  useEffect(() => {
    if (open && (contributor || conversationId) && currentUser) {
      initializeChat();
    }
    
    return () => {
      // Cleanup listeners when modal closes or component unmounts
      if (unsubscribeMessagesRef.current) {
        unsubscribeMessagesRef.current();
        unsubscribeMessagesRef.current = null;
      }
      if (unsubscribeTypingRef.current) {
        unsubscribeTypingRef.current();
        unsubscribeTypingRef.current = null;
      }
      // Clear any pending typing timeouts
      if (conversation && currentUser) {
        chatService.clearTypingTimeout(conversation.id, currentUser.uid);
      }
    };
  }, [open, contributor, conversationId, currentUser]);

  // Mark messages as read when modal opens/closes
  useEffect(() => {
    if (open && conversation && currentUser) {
      // Mark as read when modal opens
      const markAsReadOnOpen = async () => {
        try {
          const result = await chatService.markMessagesAsRead(conversation.id, currentUser.uid);
          if (!result.success) {
            console.error('Failed to mark messages as read on open:', result.message);
          }
        } catch (error) {
          console.error('Error marking messages as read on open:', error);
        }
      };
      
      // Small delay to ensure conversation is fully loaded
      const timeoutId = setTimeout(markAsReadOnOpen, 200);
      
      return () => {
        clearTimeout(timeoutId);
        // When modal is closing, ensure all messages are marked as read
        if (conversation && currentUser) {
          chatService.markMessagesAsRead(conversation.id, currentUser.uid);
        }
      };
    }
  }, [open, conversation, currentUser]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      let convId;
      
      if (conversationId) {
        // Use existing conversation ID (for ChatManagement and FloatingChat)
        result = await chatService.getConversationMessages(conversationId, currentUser.uid);
        if (result.success) {
          setConversation(result.data.conversation);
          // Load existing messages immediately
          const transformedMessages = result.data.messages.map(message => ({
            ...message,
            isOwn: message.senderId === currentUser?.uid
          }));
          setMessages(transformedMessages);
          convId = conversationId;
        } else if (result.error === 'not-found' && contributor) {
          // Fallback: if conversation not found but we have contributor info, create new conversation
          result = await chatService.getOrCreateConversation(
            currentUser.uid,
            contributor.id || contributor.uid
          );
          if (result.success) {
            setConversation(result.data);
            convId = result.data.id;
          }
        }
      } else {
        // Get or create conversation (original behavior from Ask page)
        result = await chatService.getOrCreateConversation(
          currentUser.uid,
          contributor.id || contributor.uid
        );
        if (result.success) {
          setConversation(result.data);
          convId = result.data.id;
          
          // Load message history for existing conversations
          if (result.data.lastMessage) {
            const messagesResult = await chatService.getConversationMessages(convId, currentUser.uid);
            if (messagesResult.success) {
              const transformedMessages = messagesResult.data.messages.map(message => ({
                ...message,
                isOwn: message.senderId === currentUser?.uid
              }));
              setMessages(transformedMessages);
            }
          }
        }
      }

      if (result.success && convId) {
        // Set up real-time message listener
        unsubscribeMessagesRef.current = chatService.subscribeToMessages(
          convId,
          handleMessagesUpdate
        );

        // Set up real-time typing status listener
        unsubscribeTypingRef.current = chatService.subscribeToTypingStatus(
          convId,
          handleTypingStatusUpdate
        );

        // Mark messages as read immediately when chat opens
        const markAsReadImmediately = async () => {
          try {
            const markResult = await chatService.markMessagesAsRead(convId, currentUser.uid);
            if (!markResult.success) {
              console.error('Failed to mark messages as read:', markResult.message);
            }
          } catch (error) {
            console.error('Error marking messages as read:', error);
          }
        };
        
        // Call immediately and also with a small delay as backup
        markAsReadImmediately();
        setTimeout(markAsReadImmediately, 100);
      } else {
        setError(result.message || 'Failed to initialize chat');
      }
    } catch (err) {
      console.error('Error initializing chat:', err);
      // Provide more specific error message
      const errorMessage = err.message || 'Failed to initialize chat';
      if (errorMessage.includes('failed-precondition') || errorMessage.includes('invalid state')) {
        setError('Database configuration issue. Please try again in a moment.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMessagesUpdate = (result) => {
    if (result.success) {
      // Transform messages to include isOwn property
      const transformedMessages = result.data.map(message => ({
        ...message,
        isOwn: message.senderId === currentUser?.uid
      }));
      
      // Force re-render by creating new array reference
      setMessages([...transformedMessages]);
      
      // Auto-mark messages as read when they are received and chat is open
      if (conversation && currentUser && open) {
        const unreadMessages = transformedMessages.filter(
          msg => !msg.isOwn && (!msg.readBy || !msg.readBy[currentUser.uid])
        );
        
        if (unreadMessages.length > 0) {
          // Debounce the mark as read call
          setTimeout(() => {
            chatService.markMessagesAsRead(conversation.id, currentUser.uid);
          }, 100);
        }
      }
    } else {
      console.error('Error in messages subscription:', result.error);
      setError(result.message || 'Failed to load messages');
    }
  };

  const handleTypingStatusUpdate = (result) => {
    if (result.success) {
      setTypingStatus(result.data.typingStatus || {});
    } else {
      console.error('Error in typing status subscription:', result.error);
    }
  };

  const handleMessageChange = (event) => {
    const value = event.target.value;
    setNewMessage(value);
    
    // Handle typing indicators
    if (conversation && currentUser) {
      if (value.trim().length > 0) {
        // User is typing - update with debouncing
        chatService.updateTypingStatusDebounced(conversation.id, currentUser.uid, true);
      } else {
        // User cleared input - stop typing immediately
        chatService.updateTypingStatusDebounced(conversation.id, currentUser.uid, false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation || !currentUser || sending) {
      return;
    }

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    // Stop typing indicator when sending message
    if (conversation && currentUser) {
      chatService.updateTypingStatusDebounced(conversation.id, currentUser.uid, false);
    }

    try {
      const result = await chatService.sendMessage(
        conversation.id,
        currentUser.uid,
        messageText,
        currentUser.displayName || currentUser.email
      );

      if (!result.success) {
        // If sending failed, restore the message to input
        setNewMessage(messageText);
        setError(result.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setNewMessage(messageText); // Restore message on error
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get read status for a message
  const getMessageReadStatus = (message) => {
    // Only show read receipts for own messages that have been sent
    if (!message.isOwn || !message.timestamp) return 'sent';
    
    if (!message.readBy || !conversation) return 'delivered';
    
    const otherParticipantId = conversation.participants?.find(id => id !== currentUser?.uid);
    if (!otherParticipantId) return 'delivered';
    
    // Check if the other participant has read this message
    const isReadByOther = message.readBy && message.readBy[otherParticipantId];
    

    
    if (isReadByOther) {
      return 'read';
    } else {
      // Message has been sent and has a timestamp, so it's at least delivered
      return 'delivered';
    }
  };

  // Mark messages as read when modal is opened or messages are viewed
  useEffect(() => {
    if (conversation && currentUser && open && messages.length > 0) {
      // Mark messages as read when they are viewed
      const markAsRead = async () => {
        try {
          const result = await chatService.markMessagesAsRead(conversation.id, currentUser.uid);
          if (!result.success) {
            console.error('Failed to mark messages as read:', result.message);
          }
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      };
      
      // Mark as read immediately when chat opens, then debounce subsequent calls
      const timeoutId = setTimeout(markAsRead, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [conversation, currentUser, open, messages.length]);

  // Get the other participant's typing status
  const getOtherParticipantTyping = () => {
    if (!conversation || !currentUser || !typingStatus) return false;
    
    const otherParticipantId = conversation.participants?.find(id => id !== currentUser.uid);
    return otherParticipantId ? typingStatus[otherParticipantId] : false;
  };

  if (!contributor) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: '80vh',
            maxHeight: '600px',
            display: 'flex',
            flexDirection: 'column'
          }
        }
      }}
    >
      {/* Header with contributor information */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Avatar
          src={contributor.avatar || contributor.photoURL}
          alt={contributor.name || contributor.displayName}
          sx={{ width: 40, height: 40 }}
        >
          {(contributor.name || contributor.displayName)?.charAt(0)}
        </Avatar>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="div">
            {contributor.name || contributor.displayName}
          </Typography>
          {contributor.specialties && contributor.specialties.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              {contributor.specialties.slice(0, 3).map((specialty, index) => (
                <Chip
                  key={index}
                  label={specialty}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 20 }}
                />
              ))}
            </Box>
          )}
        </Box>
        
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Message display area */}
      <DialogContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 0,
          overflow: 'hidden'
        }}
      >
        {error && (
          <Alert severity="error" sx={{ m: 2, mb: 1 }}>
            {error}
          </Alert>
        )}
        
        <Box
          ref={messagesContainerRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 2
              }}
            >
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                Loading conversation...
              </Typography>
            </Box>
          ) : messages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary'
              }}
            >
              <Typography variant="body2">
                Start a conversation with {contributor.name || contributor.displayName}
              </Typography>
            </Box>
          ) : (
            <>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  data-testid="message-bubble"
                  sx={{
                    display: 'flex',
                    justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      backgroundColor: message.isOwn ? 'primary.main' : 'grey.100',
                      color: message.isOwn ? 'primary.contrastText' : 'text.primary'
                    }}
                  >

                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {message.message}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          fontSize: '0.7rem'
                        }}
                      >
                        {message.timestamp ? formatTimestamp(message.timestamp) : 'Sending...'}
                      </Typography>
                      
                      {/* Show read receipts only for own messages */}
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
                userName={contributor.name || contributor.displayName}
              />
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </>
          )}
        </Box>
      </DialogContent>

      <Divider />

      {/* Message input area */}
      <DialogActions
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'flex-end'
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder={`Message ${contributor.name || contributor.displayName}...`}
          value={newMessage}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
          disabled={loading || sending}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || loading || sending}
          color="primary"
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark'
            },
            '&:disabled': {
              backgroundColor: 'grey.300',
              color: 'grey.500'
            }
          }}
        >
          {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default ChatModal;