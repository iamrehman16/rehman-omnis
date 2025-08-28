import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Paper,
  Rating,
  Divider,
  IconButton,
  Drawer,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Chat,
  School,
  Star,
  Send,
  Close,
  Search,
  TrendingUp,
  People,
  QuestionAnswer
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Dummy contributors data - will be replaced with real data later
const dummyContributors = [
  {
    id: 1,
    name: 'Abdur Rahman',
    avatar: null,
    resourceCount: 15,
    specialties: ['Computer Science', 'Mathematics'],
    rating: 4.8,
    totalRatings: 24,
    joinedDate: '2024-01-15',
    bio: 'CS student passionate about algorithms and data structures. Always happy to help with programming concepts!'
  },
  {
    id: 2,
    name: 'Sarah Ahmed',
    avatar: null,
    resourceCount: 12,
    specialties: ['Physics', 'Chemistry'],
    rating: 4.9,
    totalRatings: 18,
    joinedDate: '2024-02-01',
    bio: 'Science enthusiast with expertise in experimental physics and organic chemistry.'
  },
  {
    id: 3,
    name: 'Muhammad Ali',
    avatar: null,
    resourceCount: 8,
    specialties: ['English Literature', 'History'],
    rating: 4.7,
    totalRatings: 15,
    joinedDate: '2024-01-20',
    bio: 'Literature lover and history buff. Great at helping with essays and research papers.'
  },
  {
    id: 4,
    name: 'Fatima Khan',
    avatar: null,
    resourceCount: 20,
    specialties: ['Mathematics', 'Statistics'],
    rating: 4.9,
    totalRatings: 32,
    joinedDate: '2023-12-10',
    bio: 'Math tutor with 3+ years experience. Specializing in calculus, statistics, and problem-solving.'
  },
  {
    id: 5,
    name: 'Ahmed Hassan',
    avatar: null,
    resourceCount: 6,
    specialties: ['Biology', 'Environmental Science'],
    rating: 4.6,
    totalRatings: 12,
    joinedDate: '2024-02-15',
    bio: 'Biology student focused on environmental conservation and sustainable development.'
  },
  {
    id: 6,
    name: 'Zara Malik',
    avatar: null,
    resourceCount: 11,
    specialties: ['Economics', 'Business Studies'],
    rating: 4.8,
    totalRatings: 21,
    joinedDate: '2024-01-05',
    bio: 'Economics major with practical business experience. Love discussing market trends and financial concepts.'
  }
];

const AskPage = () => {
  const { user } = useAuth();
  const [contributors, setContributors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // For now, use dummy data. Later this will fetch from Firebase
    setContributors(dummyContributors);
  }, []);

  const filteredContributors = contributors.filter(contributor =>
    contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contributor.specialties.some(specialty => 
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
    setMessage('');
  };

  const handleSendMessage = () => {
    // Placeholder for sending message
    console.log('Sending message:', message, 'to:', selectedContributor?.name);
    setMessage('');
  };

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'Computer Science': 'primary',
      'Mathematics': 'secondary',
      'Physics': 'info',
      'Chemistry': 'success',
      'English Literature': 'warning',
      'History': 'error',
      'Statistics': 'secondary',
      'Biology': 'success',
      'Environmental Science': 'info',
      'Economics': 'warning',
      'Business Studies': 'primary'
    };
    return colors[specialty] || 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Connect with Contributors
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
            Get help from experienced students and subject experts. Start a conversation and learn together!
          </Typography>

          {/* Stats Text */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {contributors.length}+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contributors
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {contributors.reduce((sum, c) => sum + c.resourceCount, 0)}+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resources
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                24/7
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available
              </Typography>
            </Box>
          </Box>
          
          {/* Search Bar */}
          <Box sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: 'background.paper'
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Contributors Grid */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Featured Contributors
        </Typography>
        
        {filteredContributors.length === 0 ? (
          <Alert severity="info">
            No contributors found matching your search criteria.
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {filteredContributors.map((contributor) => (
              <Card 
                key={contributor.id}
                sx={{ 
                  width: 280,
                  height: 340,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar
                      src={contributor.avatar}
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        mx: 'auto',
                        mb: 1,
                        bgcolor: 'primary.main',
                        fontSize: '1.2rem'
                      }}
                    >
                      {contributor.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {contributor.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Rating value={contributor.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary">
                        ({contributor.totalRatings})
                      </Typography>
                    </Box>
                  </Box>

                  {/* Specialties */}
                  <Box sx={{ mb: 2, minHeight: 60, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', maxWidth: '100%' }}>
                      {contributor.specialties.map((specialty) => (
                        <Chip
                          key={specialty}
                          label={specialty}
                          size="small"
                          color={getSpecialtyColor(specialty)}
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.7rem', 
                            height: 24,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Stats */}
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      <School fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {contributor.resourceCount} resources shared
                    </Typography>
                  </Box>

                  {/* Bio */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      fontSize: '0.8rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textAlign: 'center',
                      flexGrow: 1,
                      lineHeight: 1.4
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
                    sx={{ borderRadius: 2, mt: 'auto' }}
                  >
                    Chat
                  </Button>
                </CardContent>
              </Card>
            ))}
            
          </Box>
        )}
      </Box>
      

      {/* Chat Sidebar */}
      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={handleCloseChat}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            maxWidth: '90vw'
          }
        }}
      >
        {selectedContributor && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={selectedContributor.avatar} sx={{ bgcolor: 'primary.main' }}>
                {selectedContributor.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{selectedContributor.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedContributor.specialties.join(', ')}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseChat}>
                <Close />
              </IconButton>
            </Box>

            {/* Chat Messages Area */}
            <Box sx={{ flexGrow: 1, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Chat sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Chat Coming Soon!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time messaging will be implemented in the next update.
                </Typography>
              </Paper>
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSendMessage} disabled={!message.trim()}>
                        <Send />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                disabled
              />
            </Box>
          </Box>
        )}
      </Drawer>
    </Container>
  );
};

export default AskPage;