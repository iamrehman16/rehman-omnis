import { 
  doc, 
  getDoc, 
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

class ChatService {
  constructor() {
    this.conversationsCollection = 'conversations';
    this.messagesCollection = 'messages';
    this.typingTimeouts = new Map(); // Store typing timeouts for debouncing
  }

  // Create or get existing conversation between student and contributor
  async getOrCreateConversation(studentId, contributorId) {
    try {
      // Validate input parameters
      if (!studentId || !contributorId) {
        return {
          success: false,
          error: 'validation-error',
          message: 'Student ID and Contributor ID are required'
        };
      }

      if (studentId === contributorId) {
        return {
          success: false,
          error: 'validation-error',
          message: 'Cannot create conversation with yourself'
        };
      }

      // Check if conversation already exists
      const conversationsQuery = query(
        collection(db, this.conversationsCollection),
        where('participants', 'array-contains', studentId)
      );

      const querySnapshot = await getDocs(conversationsQuery);
      let existingConversation = null;

      // Look for existing conversation with both participants
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(contributorId)) {
          existingConversation = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            lastMessageTime: data.lastMessageTime?.toDate()
          };
        }
      });

      if (existingConversation) {
        return {
          success: true,
          data: existingConversation,
          message: 'Existing conversation found'
        };
      }

      // Create new conversation
      const conversationData = {
        participants: [studentId, contributorId],
        studentId: studentId,
        contributorId: contributorId,
        lastMessage: '',
        lastMessageTime: null,
        lastMessageSender: '',
        unreadCount: {
          [studentId]: 0,
          [contributorId]: 0
        },
        typingStatus: {
          [studentId]: false,
          [contributorId]: false
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const conversationRef = await addDoc(
        collection(db, this.conversationsCollection),
        conversationData
      );

      const newConversation = {
        id: conversationRef.id,
        ...conversationData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return {
        success: true,
        data: newConversation,
        message: 'New conversation created successfully'
      };

    } catch (error) {
      console.error('Error creating/getting conversation:', error);
      return {
        success: false,
        error: error.code || 'unknown-error',
        message: this.getErrorMessage(error.code) || 'Failed to create conversation'
      };
    }
  }

  // Send a message in a conversation
  async sendMessage(conversationId, senderId, message, senderName) {
    try {
      // Validate input parameters
      if (!conversationId || !senderId || !message || !senderName) {
        return {
          success: false,
          error: 'validation-error',
          message: 'All message parameters are required'
        };
      }

      // Validate message content
      const trimmedMessage = message.trim();
      if (trimmedMessage.length === 0) {
        return {
          success: false,
          error: 'validation-error',
          message: 'Message cannot be empty'
        };
      }

      if (trimmedMessage.length > 1000) {
        return {
          success: false,
          error: 'validation-error',
          message: 'Message cannot exceed 1000 characters'
        };
      }

      // Verify conversation exists and user is participant
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        return {
          success: false,
          error: 'not-found',
          message: 'Conversation not found'
        };
      }

      const conversationData = conversationDoc.data();
      if (!conversationData.participants.includes(senderId)) {
        return {
          success: false,
          error: 'permission-denied',
          message: 'You are not a participant in this conversation'
        };
      }

      // Create message data
      const messageData = {
        conversationId: conversationId,
        senderId: senderId,
        senderName: senderName,
        message: trimmedMessage,
        timestamp: serverTimestamp(),
        readBy: {
          [senderId]: serverTimestamp() // Mark as read by sender immediately
        },
        messageType: 'text',
        edited: false,
        editedAt: null
      };

      // Add message to messages collection
      const messageRef = await addDoc(
        collection(db, this.messagesCollection),
        messageData
      );

      // Update conversation with last message info and increment unread count
      const otherParticipantId = conversationData.participants.find(id => id !== senderId);
      const updateData = {
        lastMessage: trimmedMessage,
        lastMessageTime: serverTimestamp(),
        lastMessageSender: senderId,
        updatedAt: serverTimestamp(),
        [`unreadCount.${otherParticipantId}`]: increment(1)
      };

      await updateDoc(conversationRef, updateData);

      return {
        success: true,
        data: {
          id: messageRef.id,
          ...messageData,
          timestamp: new Date()
        },
        message: 'Message sent successfully'
      };

    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error.code || 'unknown-error',
        message: this.getErrorMessage(error.code) || 'Failed to send message'
      };
    }
  }

  // Mark messages as read by a user
  async markMessagesAsRead(conversationId, userId) {
    try {
      // Validate input parameters
      if (!conversationId || !userId) {
        return {
          success: false,
          error: 'validation-error',
          message: 'Conversation ID and User ID are required'
        };
      }

      // Verify conversation exists and user is participant
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        return {
          success: false,
          error: 'not-found',
          message: 'Conversation not found'
        };
      }

      const conversationData = conversationDoc.data();
      if (!conversationData.participants.includes(userId)) {
        return {
          success: false,
          error: 'permission-denied',
          message: 'You are not a participant in this conversation'
        };
      }

      // Get unread messages for this user (messages where readBy field doesn't exist for this user or is null)
      const messagesQuery = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        where('senderId', '!=', userId) // Only mark messages from other users as read
      );

      const unreadMessages = await getDocs(messagesQuery);
      
      // Update read status for each unread message (only if not already read)
      const updatePromises = [];
      unreadMessages.forEach((messageDoc) => {
        const messageData = messageDoc.data();
        // Only update if the user hasn't already read this message
        if (!messageData.readBy || !messageData.readBy[userId]) {
          const messageRef = doc(db, this.messagesCollection, messageDoc.id);
          updatePromises.push(
            updateDoc(messageRef, {
              [`readBy.${userId}`]: serverTimestamp()
            })
          );
        }
      });

      await Promise.all(updatePromises);

      // Reset unread count for this user in conversation
      await updateDoc(conversationRef, {
        [`unreadCount.${userId}`]: 0,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        data: {
          messagesMarkedAsRead: unreadMessages.size
        },
        message: 'Messages marked as read successfully'
      };

    } catch (error) {
      console.error('Error marking messages as read:', error);
      return {
        success: false,
        error: error.code || 'unknown-error',
        message: this.getErrorMessage(error.code) || 'Failed to mark messages as read'
      };
    }
  }

  // Get message history for a conversation
  async getConversationMessages(conversationId, userId, limitCount = 50) {
    try {
      // Validate input parameters
      if (!conversationId || !userId) {
        return {
          success: false,
          error: 'validation-error',
          message: 'Conversation ID and User ID are required'
        };
      }

      // Verify conversation exists and user is participant
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        return {
          success: false,
          error: 'not-found',
          message: 'Conversation not found'
        };
      }

      const conversationData = conversationDoc.data();
      if (!conversationData.participants.includes(userId)) {
        return {
          success: false,
          error: 'permission-denied',
          message: 'You are not a participant in this conversation'
        };
      }

      // Get messages for the conversation in chronological order
      // Note: Using orderBy with where requires a composite index
      // For now, we'll get all messages and sort them client-side
      const messagesQuery = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(messagesQuery);
      const messages = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate()
        });
      });

      // Sort messages by timestamp client-side (oldest first)
      messages.sort((a, b) => {
        if (!a.timestamp && !b.timestamp) return 0;
        if (!a.timestamp) return -1;
        if (!b.timestamp) return 1;
        return a.timestamp.getTime() - b.timestamp.getTime();
      });

      return {
        success: true,
        data: {
          conversation: {
            id: conversationDoc.id,
            ...conversationData,
            createdAt: conversationData.createdAt?.toDate(),
            updatedAt: conversationData.updatedAt?.toDate(),
            lastMessageTime: conversationData.lastMessageTime?.toDate()
          },
          messages: messages
        },
        message: 'Conversation messages retrieved successfully'
      };

    } catch (error) {
      console.error('Error getting conversation messages:', error);
      return {
        success: false,
        error: error.code || 'unknown-error',
        message: this.getErrorMessage(error.code) || 'Failed to get conversation messages'
      };
    }
  }

  // Get recent conversations for a user
  async getRecentConversations(userId, limitCount = 20) {
    try {
      // Validate input parameters
      if (!userId) {
        return {
          success: false,
          error: 'validation-error',
          message: 'User ID is required'
        };
      }

      const conversationsQuery = query(
        collection(db, this.conversationsCollection),
        where('participants', 'array-contains', userId),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(conversationsQuery);
      const conversations = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        conversations.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          lastMessageTime: data.lastMessageTime?.toDate()
        });
      });

      // Sort conversations by updatedAt client-side (newest first)
      conversations.sort((a, b) => {
        if (!a.updatedAt && !b.updatedAt) return 0;
        if (!a.updatedAt) return 1;
        if (!b.updatedAt) return -1;
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      });

      return {
        success: true,
        data: conversations,
        message: 'Conversations retrieved successfully'
      };

    } catch (error) {
      console.error('Error getting recent conversations:', error);
      return {
        success: false,
        error: error.code || 'unknown-error',
        message: this.getErrorMessage(error.code) || 'Failed to get conversations'
      };
    }
  }

  // Update typing status for a user in a conversation
  async updateTypingStatus(conversationId, userId, isTyping) {
    try {
      // Validate input parameters
      if (!conversationId || !userId || typeof isTyping !== 'boolean') {
        return {
          success: false,
          error: 'validation-error',
          message: 'Conversation ID, User ID, and typing status are required'
        };
      }

      // Verify conversation exists and user is participant
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        return {
          success: false,
          error: 'not-found',
          message: 'Conversation not found'
        };
      }

      const conversationData = conversationDoc.data();
      if (!conversationData.participants.includes(userId)) {
        return {
          success: false,
          error: 'permission-denied',
          message: 'You are not a participant in this conversation'
        };
      }

      // Update typing status
      await updateDoc(conversationRef, {
        [`typingStatus.${userId}`]: isTyping,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Typing status updated successfully'
      };

    } catch (error) {
      console.error('Error updating typing status:', error);
      return {
        success: false,
        error: error.code || 'unknown-error',
        message: this.getErrorMessage(error.code) || 'Failed to update typing status'
      };
    }
  }

  // Debounced typing status update with automatic stop after 3 seconds
  updateTypingStatusDebounced(conversationId, userId, isTyping = true) {
    const timeoutKey = `${conversationId}-${userId}`;
    
    // Clear existing timeout
    if (this.typingTimeouts.has(timeoutKey)) {
      clearTimeout(this.typingTimeouts.get(timeoutKey));
      this.typingTimeouts.delete(timeoutKey);
    }

    if (isTyping) {
      // Set typing to true immediately
      this.updateTypingStatus(conversationId, userId, true);
      
      // Set timeout to automatically set typing to false after 3 seconds
      const timeout = setTimeout(() => {
        this.updateTypingStatus(conversationId, userId, false);
        this.typingTimeouts.delete(timeoutKey);
      }, 3000);
      
      this.typingTimeouts.set(timeoutKey, timeout);
    } else {
      // Set typing to false immediately
      this.updateTypingStatus(conversationId, userId, false);
    }
  }

  // Clear typing timeout for cleanup
  clearTypingTimeout(conversationId, userId) {
    const timeoutKey = `${conversationId}-${userId}`;
    if (this.typingTimeouts.has(timeoutKey)) {
      clearTimeout(this.typingTimeouts.get(timeoutKey));
      this.typingTimeouts.delete(timeoutKey);
    }
  }

  // Subscribe to real-time messages for a conversation
  subscribeToMessages(conversationId, callback) {
    try {
      if (!conversationId || !callback) {
        throw new Error('Conversation ID and callback are required');
      }

      const messagesQuery = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId)
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          messages.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate()
          });
        });
        
        // Sort messages by timestamp client-side (oldest first)
        messages.sort((a, b) => {
          if (!a.timestamp && !b.timestamp) return 0;
          if (!a.timestamp) return -1;
          if (!b.timestamp) return 1;
          return a.timestamp.getTime() - b.timestamp.getTime();
        });
        
        // Debug logging for message subscription updates
        console.log('Real-time message update:', {
          conversationId,
          messageCount: messages.length,
          messagesWithReadBy: messages.filter(m => m.readBy && Object.keys(m.readBy).length > 1).length,
          sampleReadBy: messages.slice(-3).map(m => ({ id: m.id, readBy: m.readBy }))
        });
        
        callback({ success: true, data: messages });
      }, (error) => {
        console.error('Error in messages subscription:', error);
        callback({ 
          success: false, 
          error: error.code || 'unknown-error',
          message: this.getErrorMessage(error.code) || 'Failed to subscribe to messages'
        });
      });

      return unsubscribe;

    } catch (error) {
      console.error('Error setting up messages subscription:', error);
      callback({ 
        success: false, 
        error: 'subscription-error',
        message: 'Failed to set up real-time message subscription'
      });
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Subscribe to real-time conversations for a user
  subscribeToConversations(userId, callback) {
    try {
      if (!userId || !callback) {
        throw new Error('User ID and callback are required');
      }

      const conversationsQuery = query(
        collection(db, this.conversationsCollection),
        where('participants', 'array-contains', userId)
      );

      const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
        const conversations = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          conversations.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            lastMessageTime: data.lastMessageTime?.toDate()
          });
        });
        
        // Sort conversations by updatedAt client-side (newest first)
        conversations.sort((a, b) => {
          if (!a.updatedAt && !b.updatedAt) return 0;
          if (!a.updatedAt) return 1;
          if (!b.updatedAt) return -1;
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        });
        
        callback({ success: true, data: conversations });
      }, (error) => {
        console.error('Error in conversations subscription:', error);
        callback({ 
          success: false, 
          error: error.code || 'unknown-error',
          message: this.getErrorMessage(error.code) || 'Failed to subscribe to conversations'
        });
      });

      return unsubscribe;

    } catch (error) {
      console.error('Error setting up conversations subscription:', error);
      callback({ 
        success: false, 
        error: 'subscription-error',
        message: 'Failed to set up real-time conversation subscription'
      });
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Subscribe to typing status for a conversation
  subscribeToTypingStatus(conversationId, callback) {
    try {
      if (!conversationId || !callback) {
        throw new Error('Conversation ID and callback are required');
      }

      const conversationRef = doc(db, this.conversationsCollection, conversationId);

      const unsubscribe = onSnapshot(conversationRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          callback({ 
            success: true, 
            data: {
              typingStatus: data.typingStatus || {},
              updatedAt: data.updatedAt?.toDate()
            }
          });
        } else {
          callback({ 
            success: false, 
            error: 'not-found',
            message: 'Conversation not found'
          });
        }
      }, (error) => {
        console.error('Error in typing status subscription:', error);
        callback({ 
          success: false, 
          error: error.code || 'unknown-error',
          message: this.getErrorMessage(error.code) || 'Failed to subscribe to typing status'
        });
      });

      return unsubscribe;

    } catch (error) {
      console.error('Error setting up typing status subscription:', error);
      callback({ 
        success: false, 
        error: 'subscription-error',
        message: 'Failed to set up real-time typing status subscription'
      });
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Error message mapping
  getErrorMessage(errorCode) {
    const errorMessages = {
      'permission-denied': 'You do not have permission to perform this action',
      'not-found': 'The requested resource was not found',
      'unavailable': 'Service is temporarily unavailable. Please try again later',
      'cancelled': 'Operation was cancelled',
      'deadline-exceeded': 'Operation timed out. Please try again',
      'resource-exhausted': 'Too many requests. Please try again later',
      'failed-precondition': 'Operation failed due to invalid state',
      'aborted': 'Operation was aborted due to a conflict',
      'out-of-range': 'Operation was attempted past the valid range',
      'unimplemented': 'Operation is not implemented or supported',
      'internal': 'Internal server error occurred',
      'data-loss': 'Unrecoverable data loss or corruption',
      'unauthenticated': 'Request does not have valid authentication credentials',
      'validation-error': 'Invalid input provided',
      'unknown-error': 'An unexpected error occurred'
    };
    
    return errorMessages[errorCode] || 'An unexpected error occurred';
  }
}

// Export singleton instance
export default new ChatService();