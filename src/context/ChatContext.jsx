import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import chatService from '../services/chat.service';
import userService from '../services/user.service';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user: currentUser } = useAuth();
  
  // Core chat state
  const [conversations, setConversations] = useState([]);
  const [userProfiles, setUserProfiles] = useState(new Map());
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [activeConversations, setActiveConversations] = useState(new Map()); // conversationId -> messages
  const [typingStatus, setTypingStatus] = useState(new Map()); // conversationId -> typingStatus
  
  // Real-time listeners
  const unsubscribeConversationsRef = useRef(null);
  const messageListenersRef = useRef(new Map()); // conversationId -> unsubscribe function
  const typingListenersRef = useRef(new Map()); // conversationId -> unsubscribe function

  // Load user profile with caching
  const loadUserProfile = useCallback(async (userId) => {
    // Check current state directly to avoid stale closure
    setUserProfiles(currentProfiles => {
      if (currentProfiles.has(userId)) {
        return currentProfiles; // Already loaded, no change needed
      }
      
      // Start loading the profile
      (async () => {
        try {
          const result = await userService.getUserProfile(userId);
          if (result.success) {
            const profile = result.data;
            setUserProfiles(prev => new Map(prev.set(userId, profile)));
          } else {
            // Set default profile if loading fails
            const defaultProfile = {
              displayName: 'Unknown User',
              photoURL: null,
              email: ''
            };
            setUserProfiles(prev => new Map(prev.set(userId, defaultProfile)));
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Set default profile if loading fails
          const defaultProfile = {
            displayName: 'Unknown User',
            photoURL: null,
            email: ''
          };
          setUserProfiles(prev => new Map(prev.set(userId, defaultProfile)));
        }
      })();
      
      return currentProfiles; // Return current state unchanged for now
    });
  }, []);

  // Initialize conversations listener
  const initializeConversations = useCallback(async () => {
    if (!currentUser?.uid) return;

    try {
      // Set up real-time listener for conversations
      const unsubscribe = chatService.subscribeToConversations(
        currentUser.uid,
        async (result) => {
          if (result.success) {
            const conversationsData = result.data;
            
            // Calculate total unread count
            const totalUnread = conversationsData.reduce((total, conv) => {
              return total + (conv.unreadCount?.[currentUser.uid] || 0);
            }, 0);
            
            console.log('Conversations updated via real-time listener:', {
              conversationCount: conversationsData.length,
              totalUnread,
              conversationsWithUnread: conversationsData.filter(c => (c.unreadCount?.[currentUser.uid] || 0) > 0).length
            });
            
            setConversations(conversationsData);
            setTotalUnreadCount(totalUnread);
            
            // Load user profiles for all conversations
            const otherUserIds = conversationsData
              .map(conv => conv.participants?.find(id => id !== currentUser.uid))
              .filter(id => id);
            
            // Load profiles for all other users (loadUserProfile handles caching internally)
            otherUserIds.forEach(userId => loadUserProfile(userId));
          }
        }
      );

      unsubscribeConversationsRef.current = unsubscribe;
    } catch (error) {
      console.error('Error initializing conversations:', error);
    }
  }, [currentUser?.uid, loadUserProfile]);

  // Subscribe to messages for a specific conversation
  const subscribeToConversationMessages = useCallback((conversationId) => {
    if (messageListenersRef.current.has(conversationId)) {
      return; // Already subscribed
    }

    const unsubscribe = chatService.subscribeToMessages(
      conversationId,
      (result) => {
        if (result.success) {
          const transformedMessages = result.data.map(message => ({
            ...message,
            isOwn: message.senderId === currentUser?.uid
          }));
          
          // Debug logging for message updates
          console.log('Messages updated via real-time listener:', {
            conversationId,
            messageCount: transformedMessages.length,
            messages: transformedMessages.map(m => ({
              id: m.id,
              message: m.message?.substring(0, 20) + '...',
              senderId: m.senderId,
              readBy: m.readBy,
              isOwn: m.isOwn
            }))
          });
          
          setActiveConversations(prev => new Map(prev.set(conversationId, transformedMessages)));
        }
      }
    );

    messageListenersRef.current.set(conversationId, unsubscribe);
  }, [currentUser?.uid]);

  // Subscribe to typing status for a specific conversation
  const subscribeToConversationTyping = useCallback((conversationId) => {
    if (typingListenersRef.current.has(conversationId)) {
      return; // Already subscribed
    }

    const unsubscribe = chatService.subscribeToTypingStatus(
      conversationId,
      (result) => {
        if (result.success) {
          setTypingStatus(prev => new Map(prev.set(conversationId, result.data.typingStatus || {})));
        }
      }
    );

    typingListenersRef.current.set(conversationId, unsubscribe);
  }, []);

  // Unsubscribe from conversation messages
  const unsubscribeFromConversation = useCallback((conversationId) => {
    // Unsubscribe from messages
    const messageUnsubscribe = messageListenersRef.current.get(conversationId);
    if (messageUnsubscribe) {
      messageUnsubscribe();
      messageListenersRef.current.delete(conversationId);
    }

    // Unsubscribe from typing
    const typingUnsubscribe = typingListenersRef.current.get(conversationId);
    if (typingUnsubscribe) {
      typingUnsubscribe();
      typingListenersRef.current.delete(conversationId);
    }

    // Remove from active conversations
    setActiveConversations(prev => {
      const newMap = new Map(prev);
      newMap.delete(conversationId);
      return newMap;
    });

    // Remove typing status
    setTypingStatus(prev => {
      const newMap = new Map(prev);
      newMap.delete(conversationId);
      return newMap;
    });
  }, []);

  // Load conversation messages
  const loadConversationMessages = useCallback(async (conversationId) => {
    try {
      const result = await chatService.getConversationMessages(conversationId, currentUser.uid);
      if (result.success) {
        const transformedMessages = result.data.messages.map(message => ({
          ...message,
          isOwn: message.senderId === currentUser?.uid
        }));
        
        setActiveConversations(prev => new Map(prev.set(conversationId, transformedMessages)));
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Error loading conversation messages:', error);
      return null;
    }
  }, [currentUser?.uid]);

  // Mark messages as read - rely on real-time listener for state updates
  const markMessagesAsRead = useCallback(async (conversationId) => {
    if (!currentUser?.uid) return;

    console.log('Marking messages as read:', { conversationId, userId: currentUser.uid });

    try {
      // Make the API call - let real-time listeners handle state updates
      const result = await chatService.markMessagesAsRead(conversationId, currentUser.uid);
      
      if (result.success) {
        console.log('Successfully marked messages as read on server:', result.data);
      } else {
        console.error('Failed to mark messages as read on server:', result.message);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [currentUser?.uid]);

  // Send message
  const sendMessage = useCallback(async (conversationId, message) => {
    if (!currentUser?.uid || !message.trim()) return false;

    try {
      const result = await chatService.sendMessage(
        conversationId,
        currentUser.uid,
        message.trim(),
        currentUser.displayName || currentUser.email
      );

      return result.success;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, [currentUser]);

  // Update typing status
  const updateTypingStatus = useCallback((conversationId, isTyping) => {
    if (!currentUser?.uid) return;
    
    if (isTyping) {
      chatService.updateTypingStatusDebounced(conversationId, currentUser.uid, true);
    } else {
      chatService.updateTypingStatusDebounced(conversationId, currentUser.uid, false);
    }
  }, [currentUser?.uid]);

  // Get conversation by ID
  const getConversation = useCallback((conversationId) => {
    return conversations.find(conv => conv.id === conversationId);
  }, [conversations]);

  // Get messages for a conversation
  const getConversationMessages = useCallback((conversationId) => {
    return activeConversations.get(conversationId) || [];
  }, [activeConversations]);

  // Get typing status for a conversation
  const getConversationTypingStatus = useCallback((conversationId) => {
    return typingStatus.get(conversationId) || {};
  }, [typingStatus]);

  // Get other participant in a conversation
  const getOtherParticipant = useCallback((conversation) => {
    if (!conversation || !currentUser?.uid) return null;
    const otherUserId = conversation.participants?.find(id => id !== currentUser.uid);
    return otherUserId ? userProfiles.get(otherUserId) : null;
  }, [currentUser?.uid, userProfiles]);

  // Initialize when user is available
  useEffect(() => {
    if (currentUser?.uid) {
      initializeConversations();
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeConversationsRef.current) {
        unsubscribeConversationsRef.current();
      }
      
      // Cleanup all message listeners
      messageListenersRef.current.forEach(unsubscribe => unsubscribe());
      messageListenersRef.current.clear();
      
      // Cleanup all typing listeners
      typingListenersRef.current.forEach(unsubscribe => unsubscribe());
      typingListenersRef.current.clear();
    };
  }, [currentUser?.uid, initializeConversations]);

  const value = {
    // State
    conversations,
    userProfiles,
    totalUnreadCount,
    
    // Actions
    loadUserProfile,
    subscribeToConversationMessages,
    subscribeToConversationTyping,
    unsubscribeFromConversation,
    loadConversationMessages,
    markMessagesAsRead,
    sendMessage,
    updateTypingStatus,
    
    // Getters
    getConversation,
    getConversationMessages,
    getConversationTypingStatus,
    getOtherParticipant
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};