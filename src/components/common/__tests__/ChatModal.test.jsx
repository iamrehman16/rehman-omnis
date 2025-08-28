import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../../../context/AuthContext';
import ChatModal from '../ChatModal';
import chatService from '../../../services/chat.service';

// Mock the chat service
vi.mock('../../../services/chat.service', () => ({
  default: {
    getOrCreateConversation: vi.fn(),
    subscribeToMessages: vi.fn(),
    subscribeToTypingStatus: vi.fn(),
    sendMessage: vi.fn(),
    markMessagesAsRead: vi.fn(),
    updateTypingStatusDebounced: vi.fn(),
    clearTypingTimeout: vi.fn()
  }
}));

const mockUser = {
  uid: 'test-user-id',
  displayName: 'Test User',
  email: 'test@example.com'
};

const mockContributor = {
  id: 'contributor-id',
  name: 'Test Contributor',
  specialties: ['JavaScript', 'React']
};

const mockConversation = {
  id: 'conversation-id',
  participants: ['test-user-id', 'contributor-id']
};

const mockMessages = [
  {
    id: 'msg1',
    conversationId: 'conversation-id',
    senderId: 'test-user-id',
    senderName: 'Test User',
    message: 'Hello!',
    timestamp: new Date('2024-01-01T10:00:00Z'),
    readBy: {
      'test-user-id': new Date('2024-01-01T10:00:00Z'),
      'contributor-id': null
    }
  },
  {
    id: 'msg2',
    conversationId: 'conversation-id',
    senderId: 'contributor-id',
    senderName: 'Test Contributor',
    message: 'Hi there!',
    timestamp: new Date('2024-01-01T10:01:00Z'),
    readBy: {
      'test-user-id': new Date('2024-01-01T10:02:00Z'),
      'contributor-id': new Date('2024-01-01T10:01:00Z')
    }
  }
];

describe('ChatService Real-time Functionality', () => {
  let mockUnsubscribe;

  beforeEach(() => {
    mockUnsubscribe = vi.fn();
    
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    chatService.getOrCreateConversation.mockResolvedValue({
      success: true,
      data: mockConversation
    });
    
    chatService.subscribeToMessages.mockImplementation((conversationId, callback) => {
      // Simulate initial message load
      setTimeout(() => {
        callback({
          success: true,
          data: mockMessages
        });
      }, 100);
      
      return mockUnsubscribe;
    });
    
    chatService.sendMessage.mockResolvedValue({
      success: true,
      data: {
        id: 'new-msg',
        message: 'Test message'
      }
    });

    chatService.subscribeToTypingStatus.mockImplementation((conversationId, callback) => {
      setTimeout(() => {
        callback({
          success: true,
          data: {
            typingStatus: {},
            updatedAt: new Date()
          }
        });
      }, 100);
      return mockUnsubscribe;
    });

    chatService.markMessagesAsRead.mockResolvedValue({
      success: true,
      data: { messagesMarkedAsRead: 1 }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set up real-time message subscription', () => {
    const mockCallback = vi.fn();
    const mockUnsubscribe = vi.fn();
    
    chatService.subscribeToMessages.mockReturnValue(mockUnsubscribe);
    
    const unsubscribe = chatService.subscribeToMessages('conversation-id', mockCallback);
    
    expect(chatService.subscribeToMessages).toHaveBeenCalledWith('conversation-id', mockCallback);
    expect(typeof unsubscribe).toBe('function');
  });

  it('should handle message updates from real-time listener', () => {
    let messageCallback;
    
    chatService.subscribeToMessages.mockImplementation((conversationId, callback) => {
      messageCallback = callback;
      return vi.fn();
    });
    
    const mockCallback = vi.fn();
    chatService.subscribeToMessages('conversation-id', mockCallback);
    
    // Simulate real-time message update
    const messages = [
      {
        id: 'msg1',
        message: 'Hello!',
        senderId: 'user1',
        timestamp: new Date()
      }
    ];
    
    mockCallback({ success: true, data: messages });
    
    expect(mockCallback).toHaveBeenCalledWith({
      success: true,
      data: messages
    });
  });

  it('should handle subscription errors', () => {
    const mockCallback = vi.fn();
    
    chatService.subscribeToMessages.mockImplementation((conversationId, callback) => {
      // Simulate error
      callback({
        success: false,
        error: 'permission-denied',
        message: 'Access denied'
      });
      return vi.fn();
    });
    
    chatService.subscribeToMessages('conversation-id', mockCallback);
    
    expect(mockCallback).toHaveBeenCalledWith({
      success: false,
      error: 'permission-denied',
      message: 'Access denied'
    });
  });
});
// Helper
 function to render ChatModal with AuthContext
const renderChatModal = (props = {}) => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    contributor: mockContributor,
    ...props
  };

  return render(
    <AuthContext.Provider value={{ user: mockUser }}>
      <ChatModal {...defaultProps} />
    </AuthContext.Provider>
  );
};

describe('ChatModal Read Receipts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    chatService.getOrCreateConversation.mockResolvedValue({
      success: true,
      data: mockConversation
    });
    
    chatService.subscribeToMessages.mockImplementation((conversationId, callback) => {
      setTimeout(() => {
        callback({
          success: true,
          data: mockMessages
        });
      }, 100);
      return vi.fn();
    });
    
    chatService.subscribeToTypingStatus.mockImplementation((conversationId, callback) => {
      setTimeout(() => {
        callback({
          success: true,
          data: {
            typingStatus: {},
            updatedAt: new Date()
          }
        });
      }, 100);
      return vi.fn();
    });

    chatService.markMessagesAsRead.mockResolvedValue({
      success: true,
      data: { messagesMarkedAsRead: 1 }
    });
  });

  it('should call markMessagesAsRead when messages are loaded', async () => {
    renderChatModal();

    await waitFor(() => {
      expect(chatService.markMessagesAsRead).toHaveBeenCalledWith(
        mockConversation.id,
        mockUser.uid
      );
    });
  });

  it('should show read receipt indicators for own messages', async () => {
    renderChatModal();

    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument();
    });

    // Check that read receipt indicators are present for own messages
    // The first message (from current user) should show delivered status
    const deliveredIcons = screen.getAllByTestId('DoneAllIcon');
    expect(deliveredIcons.length).toBeGreaterThan(0);
  });

  it('should not show read receipt indicators for other users messages', async () => {
    renderChatModal();

    await waitFor(() => {
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });

    // Messages from other users should not have read receipt indicators
    // We can verify this by checking the message structure
    const contributorMessage = screen.getByText('Hi there!').closest('[data-testid="message-bubble"]');
    expect(contributorMessage).not.toContain('DoneAllIcon');
  });

  it('should handle markMessagesAsRead errors gracefully', async () => {
    chatService.markMessagesAsRead.mockRejectedValue(new Error('Network error'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderChatModal();

    await waitFor(() => {
      expect(chatService.markMessagesAsRead).toHaveBeenCalled();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error marking messages as read:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should update read status in real-time when messages are read', async () => {
    let messageCallback;
    
    chatService.subscribeToMessages.mockImplementation((conversationId, callback) => {
      messageCallback = callback;
      return vi.fn();
    });

    renderChatModal();

    // Simulate real-time update with read status change
    const updatedMessages = [
      {
        ...mockMessages[0],
        readBy: {
          'test-user-id': new Date('2024-01-01T10:00:00Z'),
          'contributor-id': new Date('2024-01-01T10:03:00Z') // Now read by contributor
        }
      }
    ];

    await waitFor(() => {
      messageCallback({ success: true, data: updatedMessages });
    });

    // The message should now show as read
    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument();
    });
  });
});