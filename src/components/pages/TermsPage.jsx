import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Gavel as GavelIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const TermsPage = ({ onBack }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 3 } }}>
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
            <GavelIcon sx={{ fontSize: { xs: 40, sm: 60 }, mb: { xs: 1, sm: 2 } }} />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Terms of Service
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Please read these terms carefully
            </Typography>
          </Paper>
        </Box>

        {/* Content */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 2, sm: 3 }, 
              fontSize: { xs: '0.9rem', sm: '1.1rem' }
            }}
          >
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </Typography>

          <Alert severity="info" sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
              By using Omnis, you agree to these terms. Please read them carefully.
            </Typography>
          </Alert>

          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 3, sm: 4 }, 
              lineHeight: 1.8,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Welcome to Omnis! These Terms of Service govern your use of our educational platform. 
            By accessing or using Omnis, you agree to be bound by these terms.
          </Typography>

          {/* Acceptable Use */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 2, sm: 3 }, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              <CheckCircleIcon color="success" />
              Acceptable Use
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2, 
                lineHeight: 1.8,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              You may use Omnis for educational purposes. You agree to:
            </Typography>

            <List sx={{ py: 0 }}>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Use the platform respectfully and professionally"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Share only appropriate educational content"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Respect intellectual property rights"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Maintain the confidentiality of your account"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Report any misuse or inappropriate behavior"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Prohibited Activities */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 2, sm: 3 }, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              <CancelIcon color="error" />
              Prohibited Activities
            </Typography>
            
            <Alert severity="warning" sx={{ mb: { xs: 2, sm: 3 } }}>
              <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                The following activities are strictly prohibited and may result in account suspension.
              </Typography>
            </Alert>

            <List sx={{ py: 0 }}>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Sharing copyrighted material without permission"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Uploading malicious or harmful content"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Harassment or inappropriate communication"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Creating fake accounts or impersonating others"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Attempting to hack or compromise the platform"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• Commercial use without explicit permission"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* User Content */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              User Content
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                lineHeight: 1.8,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              When you upload or share content on Omnis:
            </Typography>

            <List sx={{ py: 0 }}>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• You retain ownership of your original content"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• You grant us permission to display and distribute your content on the platform"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• You confirm that you have the right to share the content"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText 
                  primary="• You're responsible for the accuracy and legality of your content"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                  }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* Platform Availability */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Platform Availability
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                lineHeight: 1.8,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              We strive to keep Omnis available 24/7, but we cannot guarantee uninterrupted service. 
              We may need to perform maintenance, updates, or address technical issues that could 
              temporarily affect availability.
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* Limitation of Liability */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 2, sm: 3 }, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              <WarningIcon color="warning" />
              Limitation of Liability
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                lineHeight: 1.8,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Omnis is provided "as is" for educational purposes. While we strive to provide accurate 
              and helpful content, we cannot guarantee the accuracy or completeness of user-generated content. 
              Users are responsible for verifying information before relying on it for academic purposes.
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* Changes to Terms */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Changes to These Terms
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                lineHeight: 1.8,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              We may update these Terms of Service from time to time. When we do, we'll notify users 
              through the platform and update the "Last updated" date. Continued use of Omnis after 
              changes constitutes acceptance of the new terms.
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* Contact */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Questions About These Terms?
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                lineHeight: 1.8,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              If you have any questions about these Terms of Service, please contact us.
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Email: support.omnis@gmail.com
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Phone: 03222521336
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsPage;