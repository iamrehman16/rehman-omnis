// src/components/LandingPage.js
import React from "react";
import { Box, Button, Container, Typography, Avatar, Stack } from "@mui/material";
import { motion } from "framer-motion";

const LandingPage = ({ onGetStarted }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        background: "linear-gradient(135deg, rgba(69, 152, 225, 0.9) 0%, rgba(150, 178, 224, 0.9) 40%, rgba(26, 129, 214, 0.9) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Container maxWidth="md">
        {/* Hero Section */}
        <Stack spacing={6} alignItems="center" textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              color="primary"
              gutterBottom
              sx={{ textShadow: "0px 1px 3px rgba(0,0,0,0.1)" }}
            >
              Welcome to Omnis
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              maxWidth="600px"
              sx={{ mx: "auto" }}
            >
              A platform where students can share notes, past papers, and connect with seniors
              for guidance and mentorship.
            </Typography>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(25,118,210,0.3)",
              }}
              onClick={onGetStarted}
            >
              Get Started
            </Button>
          </motion.div>

          {/* Creator Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: 'none',
                //boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                //backdropFilter: "blur(10px)",
              }}
            >
              <Avatar
                src="/rahman.jpg"
                alt="Rahman"
                sx={{ width: 64, height: 64, border: "2px solid #1976d2" }}
              />
              <Box textAlign="left">
                <Typography variant="subtitle1" fontWeight="bold">
                  Hey there!
                </Typography>
                <Typography variant="body2" color="text.secondary" maxWidth="400px">
                  "Hey juniors! This platform was built with love ❤️ to make your study journey
                  easier. Stay curious, keep learning, and remember — we’ve got your back!"
                </Typography>
              </Box>
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingPage;
