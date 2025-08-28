import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ChatManagement from '../ChatManagement';
import { useAuth } from '../../../context/AuthContext';
import chatService from '../../../services/chat.service';
import userService from '../../../services/user.service';

// Mock the dependencies
vi.mock('../../../context/AuthContext');
vi.mock('../../../services/chat.service');
vi.mock('../../../services/user.service');
vi.mock('../ChatModal', () => ({
  default: ({ open, onClose, contributor, conversationId }) => (
    open ? (
      <div data-testid="chat-modal">
        <div>Chat with {contributor?.displayName}</div>
        <div>Conversation ID: {conversationId}</div>
        <button onClick={onClose}>Close Chat</button>
      </div>
    ) : null
  )
}));

describe('ChatManagement', () => {
  const mockCurrentUser = {
    uid: 'contributor-1',
    role: 'contributor',
    displayName: 'Test Contributor'
  };

  const mockConversations = [
    {
      id: 'conv-1',
      studentId: 'student-1',
      contributorId: 'contributor-1',
      lastMessage: 'Hello, I need help with React',
      lastMessageTime: new Date('2024-01-15T10:30:00Z'),
      unreadCount: { 'contributor-1': 2, 'student-1': 0 },
      typingStatus: { 'student-1': false, 'contributor-1': false }
    },
    {
      id: 'conv-2',
      studentId: 'student-2',
      contributorId: 'contributor-1',
      lastMessage: 'Thanks for the help!',
      lastMessageTime: new Date('2024-01-15T09:15:00Z'),
      unreadCount: { 'contributor-1': 0, 'student-1': 0 },
      typingStatus: { 'student-2': true, 'contributor-1': false }
    }
  ];

  const mockStudentProfiles = {
    'student-1': {
      uid: 'student-1',
      displayName: 'Alice Johnson',
      photoURL: 'https://example.com/alice.jpg',
      email: 'alice@example.com'
    },
    'student-2': {
      uid: 'student-2',
      displayName: 'Bob Smith',
      photoURL: null,
      email: 'bob@example.com'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    useAuth.mockReturnValue({
      user: mockCurrentUser
    });

    chatService.subscribeToConversations.mockImplementation((userId, callback) => {
      // Simulate real-time update
      setTimeout(() => {
        callback({ success: true, data: mockConversations });
      }, 100);
      
      return vi.fn(); // Return unsubscribe function
    });

    chatService.markMessagesAsRead.mockResolvedValue({ success: true });

    userService.getUserProfile.mockImplementation((userId) => {
      const profile = mockStudentProfiles[userId];
      return Promise.resolve({
        success: true,
        data: profile
      });
    });
  });

  it('renders chat management interface for contributors', async () => {
    render(<ChatManagement open={true} onClose={vi.fn()} />);

    expect(screen.getByText('Chat Management')).toBeInTheDocument();
    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
  });

  it('does not render for non-contributors', () => {
    useAuth.mockReturnValue({
      user: { ...mockCurrentUser, role: 'student' }
    });

    const { container } = render(<ChatManagement open={true} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when closed', () => {
    const { container } = render(<ChatManagement open={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays loading state initially', () => {
    render(<ChatManagement open={true} onClose={vi.fn()} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays conversations list after loading', async () => {
    render(<ChatManagement open={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });

    expect(screen.getByText('Hello, I need help with React')).toBeInTheDocument();
    expect(screen.getByText('Thanks for the help!')).toBeInTheDocument();
  });

  it('displays unread message badges', async () => {
    render(<ChatManagement open={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Check for unread badge (conversation 1 has 2 unread messages)
    const badges = screen.getAllByText('2');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('displays typing indicators', async () => {
    render(<ChatManagement open={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });

    // Check for typing indicator (student-2 is typing)
    expect(screen.getByText('typing...')).toBeInTheDocument();
  });

  it('opens chat modal when conversation is selected', async () => {
    render(<ChatManagement open={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Click on Alice's conversation
    fireEvent.click(screen.getByText('Alice Johnson'));

    await waitFor(() => {
      expect(screen.getByTestId('chat-modal')).toBeInTheDocument();
      expect(screen.getByText('Chat with Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Conversation ID: conv-1')).toBeInTheDocument();
    });

    // Verify that markMessagesAsRead was called
    expect(chatService.markMessagesAsRead).toHaveBeenCalledWith('conv-1', 'contributor-1');
  });

  it('closes chat modal when close button is clicked', async () => {
    render(<ChatManagement open={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Open chat modal
    fireEvent.click(screen.getByText('Alice Johnson'));

    await waitFor(() => {
      expect(screen.getByTestId('chat-modal')).toBeInTheDocument();
    });

    // Close chat modal
    fireEvent.click(screen.getByText('Close Chat'));

    await waitFor(() => {
      expect(screen.queryByTestId('chat-modal')).not.toBeInTheDocument();
    });
  });

  it('displays empty state when no conversations exist', async () => {
    chatService.subscribeToConversations.mockImplementation((userId, callback) => {
      setTimeout(() => {
        callback({ success: true, data: [] });
      }, 100);
      return vi.fn();
    });

    render(<ChatManagement open={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('No active conversations yet')).toBeInTheDocument();
      expect(screen.getByText('Students will appear here when they start chatting with you')).toBeInTheDocument();
    });
  });

  it('displays error state when loading fails', async () => {
    chatService.subscribeToConversations.mockImplementation((userId, callback) => {
      setTimeout(() => {
        callback({ success: false, message: 'Failed to load conversations' });
      }, 100);
      return vi.fn();
    });

    render(<ChatManagement open={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load conversations')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    render(<ChatManagement open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('CloseIcon'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('formats timestamps correctly', async () => {
    render(<ChatManagement open={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Check that timestamps are formatted (exact format depends on current time)
    const timeElements = screen.getAllByText(/ago|Just now/);
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('truncates long messages in preview', async () => {
    const longMessageConversations = [{
      ...mockConversations[0],
      lastMessage: 'This is a very long message that should be truncated because it exceeds the maximum length allowed for message previews in the conversation list'
    }];

    chatService.subscribeToConversations.mockImplementation((userId, callback) => {
      setTimeout(() => {
        callback({ success: true, data: longMessageConversations });
      }, 100);
      return vi.fn();
    });

    render(<ChatManagement open={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Check that message is truncated with ellipsis
    expect(screen.getByText(/This is a very long message that should be truncated.../)).toBeInTheDocument();
  });

  it('cleans up subscriptions on unmount', () => {
    const mockUnsubscribe = vi.fn();
    chatService.subscribeToConversations.mockReturnValue(mockUnsubscribe);

    const { unmount } = render(<ChatManagement open={true} onClose={vi.fn()} />);
    
    unmount();
    
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});