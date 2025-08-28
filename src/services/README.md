# Chat Service Documentation

## Firestore Collections Structure

### Conversations Collection (`conversations`)

Each conversation document contains:

```javascript
{
  id: "auto-generated-id",
  participants: ["studentId", "contributorId"],
  studentId: "string",
  contributorId: "string", 
  lastMessage: "string",
  lastMessageTime: "timestamp",
  lastMessageSender: "string",
  unreadCount: {
    "studentId": 0,
    "contributorId": 2
  },
  typingStatus: {
    "studentId": false,
    "contributorId": true
  },
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Messages Collection (`messages`)

Each message document contains:

```javascript
{
  id: "auto-generated-id",
  conversationId: "string",
  senderId: "string", 
  senderName: "string",
  message: "string",
  timestamp: "timestamp",
  readBy: {
    "senderId": "timestamp",
    "recipientId": null
  },
  messageType: "text",
  edited: false,
  editedAt: null
}
```

## ChatService Methods

### Core CRUD Operations

- `getOrCreateConversation(studentId, contributorId)` - Create or retrieve conversation
- `sendMessage(conversationId, senderId, message, senderName)` - Send a message
- `getConversationMessages(conversationId, userId, limitCount)` - Retrieve message history
- `markMessagesAsRead(conversationId, userId)` - Mark messages as read
- `getRecentConversations(userId, limitCount)` - Get user's conversations
- `updateTypingStatus(conversationId, userId, isTyping)` - Update typing indicator

### Real-time Subscriptions

- `subscribeToMessages(conversationId, callback)` - Real-time message updates
- `subscribeToConversations(userId, callback)` - Real-time conversation updates  
- `subscribeToTypingStatus(conversationId, callback)` - Real-time typing indicators

## Requirements Coverage

### Requirement 1.3
✅ **Load existing conversation history** - Implemented via `getConversationMessages()`

### Requirement 6.2  
✅ **Load complete conversation history on reopen** - Implemented via `getConversationMessages()`

### Requirement 6.4
✅ **Restore conversation states on refresh** - Implemented via `getRecentConversations()` and `getConversationMessages()`

## Usage Examples

```javascript
import ChatService from './chat.service.js';

// Create or get conversation
const conversation = await ChatService.getOrCreateConversation('student123', 'contributor456');

// Load message history
const history = await ChatService.getConversationMessages(conversation.data.id, 'student123');

// Send a message
const result = await ChatService.sendMessage(conversation.data.id, 'student123', 'Hello!', 'John Doe');

// Subscribe to real-time messages
const unsubscribe = ChatService.subscribeToMessages(conversation.data.id, (update) => {
  if (update.success) {
    console.log('New messages:', update.data);
  }
});

// Clean up subscription
unsubscribe();
```