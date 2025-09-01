import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QAIcon,
  ContactSupport as ContactIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const HelpCenterPage = ({ onBack, onNavigate }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(false);

  const handleFAQChange = (panel) => (event, isExpanded) => {
    setExpandedFAQ(isExpanded ? panel : false);
  };

  // FAQ Data
  const faqs = [
    {
      id: 'faq1',
      question: 'How do I create an account on Omnis?',
      answer: 'To create an account, click the "Get Started" button on the landing page, then choose "Register". Fill in your email, password, and basic information. You\'ll receive a verification email to activate your account.',
      category: 'Account'
    },
    {
      id: 'faq2',
      question: 'How can I upload and share resources?',
      answer: 'You need to be a contributor to add resources. Navigate to the Resources page, click the "Add Resource" button, select the appropriate semester and subject, upload your file, and add a description. If you\'re not a contributor yet, go to your Profile page and request contributor access.',
      category: 'Resources'
    },
    {
      id: 'faq3',
      question: 'What is the AI Assistant and how do I use it?',
      answer: 'The AI Assistant is available via the blue chat button in the bottom-right corner. You can ask questions about your courses, get help with academic topics, and receive personalized assistance. Select the appropriate semester context for better responses.',
      category: 'AI Assistant'
    },
    {
      id: 'faq4',
      question: 'How do I become a contributor?',
      answer: 'Go to your Profile page and click "Request Contributor Access". Provide information about your qualifications and why you want to contribute. Admin will review your request and approve or deny it.',
      category: 'Account'
    },
    {
      id: 'faq5',
      question: 'Can I chat with other students?',
      answer: 'Yes! Use the peer-to-peer chat feature by clicking the chat button in the bottom-right corner. You can start conversations with other students, ask questions, and collaborate on academic topics.',
      category: 'Chat'
    },
    {
      id: 'faq6',
      question: 'How are resources organized?',
      answer: 'Resources are organized by semester (1-8) and subject. You can filter resources by semester, subject, or type (notes, assignments, past papers, etc.) to find exactly what you need.',
      category: 'Resources'
    },
    {
      id: 'faq7',
      question: 'Is my data secure on Omnis?',
      answer: 'Yes, we take security seriously. All data is encrypted in transit and at rest. We use Firebase authentication for secure login, and we never share your personal information with third parties.',
      category: 'Security'
    },
    {
      id: 'faq8',
      question: 'What file types can I upload?',
      answer: 'You can upload PDF files, images (JPG, PNG), and documents (DOC, DOCX). Each file must be under 10MB. We recommend PDF format for best compatibility and viewing experience.',
      category: 'Resources'
    }
  ];



  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            Back to App
          </Button>
          
          <Paper sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white' 
          }}>
            <HelpIcon sx={{ fontSize: { xs: 40, sm: 60 }, mb: { xs: 1, sm: 2 } }} />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Help Center
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Find answers to your questions and get the most out of Omnis
            </Typography>
          </Paper>
        </Box>



        {/* Frequently Asked Questions */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              mb: { xs: 2, sm: 3 }, 
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Frequently Asked Questions
          </Typography>
          
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {faqs.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expandedFAQ === faq.id}
                onChange={handleFAQChange(faq.id)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      gap: { xs: 1, sm: 2 },
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    },
                    py: { xs: 1, sm: 2 }
                  }}
                >
                  <Chip 
                    label={faq.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' }
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: { xs: '0.85rem', sm: '1rem' }
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Paper>

        {/* Quick Tips */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              mb: { xs: 2, sm: 3 }, 
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Quick Tips for Success
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} md={6}>
              <List sx={{ py: 0 }}>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Complete your profile"
                    secondary="Add your semester and subjects for personalized content"
                    primaryTypographyProps={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Use specific search terms"
                    secondary="Search by subject, semester, or resource type for better results"
                    primaryTypographyProps={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Engage with the community"
                    secondary="Ask questions, share resources, and help fellow students"
                    primaryTypographyProps={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List sx={{ py: 0 }}>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Try the AI Assistant"
                    secondary="Get instant help with academic questions and course content"
                    primaryTypographyProps={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Organize your resources"
                    secondary="Use clear titles and descriptions when uploading files"
                    primaryTypographyProps={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Stay updated"
                    secondary="Check for new resources and announcements regularly"
                    primaryTypographyProps={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* Contact Support */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
          <ContactIcon sx={{ 
            fontSize: { xs: 36, sm: 48 }, 
            color: 'primary.main', 
            mb: { xs: 1, sm: 2 } 
          }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Still Need Help?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 2, sm: 3 }, 
              maxWidth: '600px', 
              mx: 'auto', 
              lineHeight: 1.7,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Can't find what you're looking for? Our support team is here to help! 
            Reach out to us and we'll get back to you as soon as possible.
          </Typography>
          
          <Grid container spacing={2} sx={{ maxWidth: '400px', mx: 'auto' }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ContactIcon />}
                component="a"
                href="mailto:support.omnis@gmail.com"
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
                  },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Email Support
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<QAIcon />}
                onClick={() => {
                  // Navigate to ask page by setting the tab and going back
                  localStorage.setItem('omnis-current-tab', 'ask');
                  onBack();
                }}
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Ask Community
              </Button>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 }, borderTop: 1, borderColor: 'divider' }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              <strong>Email:</strong> support.omnis@gmail.com
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              <strong>Phone:</strong> 03222521336
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 1,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              We typically respond within 24 hours
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HelpCenterPage;