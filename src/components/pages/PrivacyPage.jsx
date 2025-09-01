import React from "react";
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
  ListItemIcon,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";

const PrivacyPage = ({ onBack }) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            Back to App
          </Button>

          <Paper
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              textAlign: "center",
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              color: "white",
            }}
          >
            <SecurityIcon
              sx={{ fontSize: { xs: 40, sm: 60 }, mb: { xs: 1, sm: 2 } }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Your privacy is important to us
            </Typography>
          </Paper>
        </Box>

        {/* Content */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: { xs: 3, sm: 4 } }}>
          <Typography
            variant="body1"
            sx={{
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "0.9rem", sm: "1.1rem" },
            }}
          >
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: { xs: 3, sm: 4 },
              lineHeight: 1.8,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            At Omnis, we are committed to protecting your privacy and ensuring
            the security of your personal information. This Privacy Policy
            explains how we collect, use, and safeguard your data when you use
            our platform.
          </Typography>

          {/* Information We Collect */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: { xs: 2, sm: 3 },
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              <InfoIcon color="primary" />
              Information We Collect
            </Typography>

            <List sx={{ py: 0 }}>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemIcon>
                  <VisibilityIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Account Information"
                  secondary="Name, email address, and profile information you provide during registration"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemIcon>
                  <StorageIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Usage Data"
                  secondary="Information about how you interact with our platform, including pages visited and features used"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Communication Data"
                  secondary="Messages and content you share through our chat features and resource uploads"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* How We Use Your Information */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: { xs: 2, sm: 3 },
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              <ShieldIcon color="primary" />
              How We Use Your Information
            </Typography>

            <List sx={{ py: 0 }}>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Provide and improve our educational services"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Facilitate communication between students and contributors"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Personalize your learning experience"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Send important updates and notifications"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Ensure platform security and prevent misuse"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* Data Security */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: { xs: 2, sm: 3 },
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              <LockIcon color="primary" />
              Data Security
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: { xs: 2, sm: 3 },
                lineHeight: 1.8,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              We implement industry-standard security measures to protect your
              personal information:
            </Typography>

            <List sx={{ py: 0 }}>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Encrypted data transmission using HTTPS"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Secure authentication through Firebase"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Regular security audits and updates"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Limited access to personal data by authorized personnel only"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* Your Rights */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Your Rights
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
                lineHeight: 1.8,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              You have the right to:
            </Typography>

            <List sx={{ py: 0 }}>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Access and review your personal data"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Update or correct your information"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Delete your account and associated data"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: { xs: 1, sm: 2 } }}>
                <ListItemText
                  primary="• Opt-out of non-essential communications"
                  primaryTypographyProps={{
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* Contact */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Questions About Privacy?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: { xs: 2, sm: 3 },
                lineHeight: 1.8,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              If you have any questions about this Privacy Policy or how we
              handle your data, please don't hesitate to contact us.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Email: support.omnis@gmail.com
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", sm: "1rem" },
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

export default PrivacyPage;
