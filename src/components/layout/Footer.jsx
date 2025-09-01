import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Gavel as LegalIcon,
} from "@mui/icons-material";

const Footer = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.dark",
        color: "white",
        mt: "auto",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                component="img"
                src="/omnis-logo.png"
                alt="Omnis Logo"
                sx={{
                  width: 32,
                  height: 32,
                  objectFit: "contain",
                  borderRadius: "6px",
                  mr: 1,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Omnis
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Your comprehensive academic resource platform. Connect, learn, and
              excel with fellow students and contributors.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{ color: "white", "&:hover": { color: "primary.light" } }}
                aria-label="GitHub"
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white", "&:hover": { color: "primary.light" } }}
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white", "&:hover": { color: "primary.light" } }}
                aria-label="Twitter"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white", "&:hover": { color: "primary.light" } }}
                aria-label="Facebook"
              >
                <FacebookIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                component="button"
                onClick={() => onNavigate("resources")}
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  "&:hover": { opacity: 1 },
                  textAlign: "left",
                }}
              >
                Browse Resources
              </Link>
              <Link
                component="button"
                onClick={() => onNavigate("ask")}
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  "&:hover": { opacity: 1 },
                  textAlign: "left",
                }}
              >
                Ask Questions
              </Link>
              <Link
                component="button"
                onClick={() => onNavigate("profile")}
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  "&:hover": { opacity: 1 },
                  textAlign: "left",
                }}
              >
                My Profile
              </Link>
            </Box>
          </Grid>

          {/* Support & Help */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Support & Help
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                component="button"
                onClick={() => onNavigate("help")}
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  "&:hover": { opacity: 1 },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textAlign: "left",
                }}
              >
                <HelpIcon fontSize="small" />
                Help Center
              </Link>
              <Link
                component="button"
                onClick={() => onNavigate("about")}
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  "&:hover": { opacity: 1 },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textAlign: "left",
                }}
              >
                <InfoIcon fontSize="small" />
                About Us
              </Link>
              <Link
                component="button"
                onClick={() => onNavigate("privacy")}
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  "&:hover": { opacity: 1 },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textAlign: "left",
                }}
              >
                <SecurityIcon fontSize="small" />
                Privacy Policy
              </Link>
              <Link
                component="button"
                onClick={() => onNavigate("terms")}
                color="inherit"
                underline="hover"
                sx={{
                  opacity: 0.9,
                  "&:hover": { opacity: 1 },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textAlign: "left",
                }}
              >
                <LegalIcon fontSize="small" />
                Terms of Service
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  support.omnis@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  03222521336
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationIcon fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Islamabad, Pakistan
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 4, mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
          >
            Platform Features
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Chip
              label="Resource Sharing"
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
            />
            <Chip
              label="AI-Powered Chat"
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
            />
            <Chip
              label="Peer-to-Peer Chat"
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
            />
            <Chip
              label="Semester Organization"
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
            />
            <Chip
              label="Role-Based Access"
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
            />
            <Chip
              label="Real-time Updates"
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 3 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} Omnis Educational Platform. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Made with ❤️ for students
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              Version 1.0.0
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
