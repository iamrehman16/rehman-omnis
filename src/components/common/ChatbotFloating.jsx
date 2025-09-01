import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Collapse,
  Tooltip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  SmartToy as BotIcon,
  Close as CloseIcon,
  Send as SendIcon,
  ExpandMore,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import chatbotService from '../../services/chatbot.service';
import resourcesService from '../../services/resources.service';
import MessageWithHighlights from './MessageWithHighlights';

const ChatbotFloating = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedContext, setSelectedContext] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Semester options 1-8 plus general
  const contexts = [
    { value: 'general', label: 'General Questions' },
    { value: 'semester-1', label: 'Semester 1' },
    { value: 'semester-2', label: 'Semester 2' },
    { value: 'semester-3', label: 'Semester 3' },
    { value: 'semester-4', label: 'Semester 4' },
    { value: 'semester-5', label: 'Semester 5' },
    { value: 'semester-6', label: 'Semester 6' },
    { value: 'semester-7', label: 'Semester 7' },
    { value: 'semester-8', label: 'Semester 8' },
  ];

  useEffect(() => {
    const checkSimpleChat = () => {
      const simpleChat = document.getElementById('simple-chat');
      const fab = document.getElementById('ai-fab');
      if (simpleChat?.classList.contains('open')) {
        fab.style.display = 'none';
      } else {
        fab.style.display = 'flex';
      }
    };
  
    checkSimpleChat(); // initial check
    window.addEventListener('click', checkSimpleChat); // run on interactions
  
    return () => window.removeEventListener('click', checkSimpleChat);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Reset messages when context changes
  const handleContextChange = (event) => {
    setSelectedContext(event.target.value);
    setMessages([]); // Clear conversation when context changes
    setError(null);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    setError(null);
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    try {
      // Convert messages to conversation history format for API
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Fetch semester resources for context (if semester is selected)
      let semesterResources = null;
      if (selectedContext.startsWith('semester-')) {
        const semesterNumber = parseInt(selectedContext.split('-')[1]);
        console.log('🔍 Fetching resources for semester:', semesterNumber);
        try {
          const resourcesResult = await resourcesService.getResourcesBySemester(semesterNumber);
          console.log('📚 Resources fetch result:', resourcesResult);
          if (resourcesResult.success) {
            semesterResources = resourcesResult.data;
            console.log('✅ Found resources:', semesterResources.length);
            console.log('📋 Resource details:', semesterResources.map(r => ({ 
              title: r.title || r.name, 
              subject: r.subject, 
              type: r.type,
              hasSummary: !!r.summary 
            })));
          } else {
            console.log('❌ Failed to fetch resources:', resourcesResult.message);
          }
        } catch (error) {
          console.warn('Failed to fetch semester resources:', error);
        }
      } else {
        console.log('🔍 Context is not semester-specific:', selectedContext);
      }
      
      // Send to chatbot service with resources context
      const response = await chatbotService.sendMessage(userMessage, selectedContext, conversationHistory, semesterResources);
      
      // If API fails, show error instead of falling back to mock
      if (!response.success) {
        console.error('Chatbot API error:', response.error);
        setError(`API Error: ${response.error}`);
        return;
      }
      
      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.message,
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        setError(response.error || 'Failed to get response');
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (messageText, messageId) => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedMessageId(messageId);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 80, sm: 96 }, // Position above the existing chat button
        right: { xs: 8, sm: 24 },
        zIndex: 1001, // Higher z-index than FloatingChat
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1,
      }}
    >
      {/* Chat Interface */}
      <Collapse in={isExpanded}>
      <Paper
            elevation={8}
            sx={{
              zIndex:3400,
              width: { xs: '100%', sm: 350 },
              height: { xs: '90vh', sm: 500 },
              maxWidth: { xs: '100%', sm: '350px' },
              maxHeight: { xs: '90vh', sm: '500px' },
              mb: 1,
              borderRadius: { xs: 1, sm: 2 },
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              // Mobile positioning to prevent overflow
              ...(isExpanded && {
                position: { xs: 'fixed', sm: 'relative' },
                top: { xs: 0, sm: 'auto' },
                left: { xs: 0, sm: 'auto' },
                right: { xs: 0, sm: 'auto' },
                bottom: { xs: 0, sm: 'auto' },
                m: { xs: 1, sm: 0 }, // small margin on mobile
              }),
            }}
          >

          {/* Header */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BotIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              <Typography 
                variant="h6" 
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                AI Assistant
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Context Selection */}
          <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: 1, borderColor: 'divider' }}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                Context
              </InputLabel>
              <Select
                value={selectedContext}
                onChange={handleContextChange}
                label="Context"
                sx={{
                  fontSize: { xs: '0.85rem', sm: '0.875rem' },
                  '& .MuiSelect-select': {
                    py: { xs: 1, sm: 1.5 }
                  }
                }}
              >
                {contexts.map((context) => (
                  <MenuItem 
                    key={context.value} 
                    value={context.value}
                    sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}
                  >
                    {context.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Chat Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: { xs: 1.5, sm: 2 },
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}

            {/* Welcome Message */}
            {messages.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: { xs: 1, sm: 1.5 },
                    maxWidth: { xs: '90%', sm: '85%' },
                    backgroundColor: 'grey.100',
                    borderRadius: 2,
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}
                  >
                    Hi! I'm your AI assistant. I can help you with questions about your courses and academic information. 
                    {selectedContext !== 'general' && (
                      <span> Currently focused on <strong>{contexts.find(c => c.value === selectedContext)?.label}</strong>.</span>
                    )}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Chat Messages */}
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: { xs: 1, sm: 1.5 },
                    maxWidth: { xs: '90%', sm: '85%' },
                    background: msg.isUser ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' : 'grey.100',
                    color: msg.isUser ? 'white' : 'text.primary',
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  {msg.isUser ? (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.85rem' }, 
                        mb: 0.5 
                      }}
                    >
                      {msg.text}
                    </Typography>
                  ) : (
                    <Box sx={{ '& .MuiTypography-root': { fontSize: { xs: '0.8rem', sm: '0.85rem' } } }}>
                      <MessageWithHighlights text={msg.text} />
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.7,
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    
                    {/* Copy button for bot messages only */}
                    {!msg.isUser && (
                      <Tooltip title={copiedMessageId === msg.id ? 'Copied!' : 'Copy message'}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopyMessage(msg.text, msg.id)}
                          sx={{
                            opacity: 0.7,
                            '&:hover': {
                              opacity: 1,
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                            p: { xs: 0.25, sm: 0.5 },
                          }}
                        >
                          <CopyIcon sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Paper>
              </Box>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    backgroundColor: 'grey.100',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CircularProgress size={16} />
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    Thinking...
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Placeholder when no messages */}
            {messages.length === 0 && !isLoading && (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="body2">
                  Start a conversation by typing a message below
                </Typography>
              </Box>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Message Input */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              display: 'flex',
              gap: 1,
              alignItems: 'flex-end',
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                },
                '& .MuiInputBase-input': {
                  py: { xs: 1, sm: 1.5 }
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                color: 'white',
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
                },
                '&:disabled': {
                  backgroundColor: 'grey.300',
                  color: 'grey.500',
                  background: 'none',
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SendIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        </Paper>
      </Collapse>

      {/* Floating Action Button */}
      <Tooltip title={isExpanded ? 'Close AI Assistant' : 'Open AI Assistant'}>
        <Fab
         id="ai-fab"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            boxShadow: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
              boxShadow: 6,
            },
          }}
        >
          {isExpanded ? (
            <ExpandMore sx={{ fontSize: { xs: 20, sm: 24 } }} />
          ) : (
            <BotIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          )}
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default ChatbotFloating;