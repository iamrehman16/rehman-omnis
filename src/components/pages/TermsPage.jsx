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
            <GavelIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Terms of Service
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Please read these terms carefully
            </Typography>
          </Paper>
        </Box>

        {/* Content */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </Typography>

          <Alert severity="info" sx={{ mb: 4 }}>
            By using Omnis, you agree to these terms. Please read them carefully.
          </Alert>

          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
            Welcome to Omnis! These Terms of Service govern your use of our educational platform. 
            By accessing or using Omnis, you agree to be bound by these terms.
          </Typography>

          {/* Acceptable Use */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" />
              Acceptable Use
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              You may use Omnis for educational purposes. You agree to:
            </Typography>

            <List>
              <ListItem>
                <ListItemText primary="• Use the platform respectfully and professionally" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Share only appropriate educational content" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Respect intellectual property rights" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Maintain the confidentiality of your account" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Report any misuse or inappropriate behavior" />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Prohibited Activities */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CancelIcon color="error" />
              Prohibited Activities
            </Typography>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              The following activities are strictly prohibited and may result in account suspension.
            </Alert>

            <List>
              <ListItem>
                <ListItemText primary="• Sharing copyrighted material without permission" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Uploading malicious or harmful content" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Harassment or inappropriate communication" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Creating fake accounts or impersonating others" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Attempting to hack or compromise the platform" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Commercial use without explicit permission" />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* User Content */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              User Content
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              When you upload or share content on Omnis:
            </Typography>

            <List>
              <ListItem>
                <ListItemText primary="• You retain ownership of your original content" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• You grant us permission to display and distribute your content on the platform" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• You confirm that you have the right to share the content" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• You're responsible for the accuracy and legality of your content" />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Platform Availability */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Platform Availability
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              We strive to keep Omnis available 24/7, but we cannot guarantee uninterrupted service. 
              We may need to perform maintenance, updates, or address technical issues that could 
              temporarily affect availability.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Limitation of Liability */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" />
              Limitation of Liability
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              Omnis is provided "as is" for educational purposes. While we strive to provide accurate 
              and helpful content, we cannot guarantee the accuracy or completeness of user-generated content. 
              Users are responsible for verifying information before relying on it for academic purposes.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Changes to Terms */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Changes to These Terms
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              We may update these Terms of Service from time to time. When we do, we'll notify users 
              through the platform and update the "Last updated" date. Continued use of Omnis after 
              changes constitutes acceptance of the new terms.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Contact */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Questions About These Terms?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              If you have any questions about these Terms of Service, please contact us.
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

export default TermsPage;