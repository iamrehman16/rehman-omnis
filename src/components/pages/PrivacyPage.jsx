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
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

const PrivacyPage = ({ onBack }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mb: 3 }}
          >
            Back to App
          </Button>
          
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white' 
          }}>
            <SecurityIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Privacy Policy
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Your privacy is important to us
            </Typography>
          </Paper>
        </Box>

        {/* Content */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
            At Omnis, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
          </Typography>

          {/* Information We Collect */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              Information We Collect
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <VisibilityIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Account Information"
                  secondary="Name, email address, and profile information you provide during registration"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StorageIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Usage Data"
                  secondary="Information about how you interact with our platform, including pages visited and features used"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Communication Data"
                  secondary="Messages and content you share through our chat features and resource uploads"
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* How We Use Your Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldIcon color="primary" />
              How We Use Your Information
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="• Provide and improve our educational services"
                  sx={{ mb: 1 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• Facilitate communication between students and contributors"
                  sx={{ mb: 1 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• Personalize your learning experience"
                  sx={{ mb: 1 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• Send important updates and notifications"
                  sx={{ mb: 1 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• Ensure platform security and prevent misuse"
                  sx={{ mb: 1 }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Data Security */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockIcon color="primary" />
              Data Security
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              We implement industry-standard security measures to protect your personal information:
            </Typography>

            <List>
              <ListItem>
                <ListItemText primary="• Encrypted data transmission using HTTPS" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Secure authentication through Firebase" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Regular security audits and updates" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Limited access to personal data by authorized personnel only" />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Your Rights */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Your Rights
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              You have the right to:
            </Typography>

            <List>
              <ListItem>
                <ListItemText primary="• Access and review your personal data" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Update or correct your information" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Delete your account and associated data" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Opt-out of non-essential communications" />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Contact */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Questions About Privacy?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              If you have any questions about this Privacy Policy or how we handle your data, 
              please don't hesitate to contact us.
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Email: support.omnis@gmail.com
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Phone: 03222521336
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPage;