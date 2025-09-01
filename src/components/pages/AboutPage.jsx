import React from "react";
import { Box, Container, Typography, Avatar } from "@mui/material";

const AboutPage = ({ onBack }) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
      {/* Hero Section with Background */}
      <Box
        sx={{
          position: "relative",
          height: "60vh",
          minHeight: "500px",
          backgroundImage: "url(/us.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          },
        }}
      >
        {/* Hero Content */}
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            About Omnis
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.95,
              maxWidth: "800px",
              mx: "auto",
              mb: 3,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
          >
            Just a bunch of students who got tired of academic chaos and decided
            to build something better
          </Typography>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", mb: 3, color: "text.primary" }}
          >
            Hey there! 👋
          </Typography>
        </Box>

        <Box sx={{ maxWidth: "800px", mx: "auto", mb: 8 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              mb: 4,
              textAlign: "left",
              color: "text.secondary",
            }}
          >
            So, here's the deal - we're just a bunch of students who got tired
            of the same old problems. You know the drill: hunting for notes,
            trying to find decent study materials, and basically feeling lost in
            the academic jungle.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              mb: 4,
              textAlign: "left",
              color: "text.secondary",
            }}
          >
            One day, we were sitting around complaining (as students do) about
            how hard it is to find good resources and connect with people who
            actually know what they're talking about. That's when it hit us -
            <em>"Why don't we just build something that doesn't suck?"</em>
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 3,
              color: "primary.main",
              textAlign: "left",
            }}
          >
            And boom! 💥 Omnis was born
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              color: "text.primary",
              textAlign: "left",
              mb: 4,
            }}
          >
            It's not just another boring academic platform - it's like having
            that smart friend who always has the notes you need, plus an AI
            buddy who's available 24/7 to help you out when you're stuck at 2 AM
            wondering what the heck your professor meant.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              mb: 4,
              textAlign: "left",
              color: "text.secondary",
            }}
          >
            We spent countless nights (fueled by way too much coffee ☕)
            building this thing because we genuinely believe learning should be
            fun, collaborative, and not make you want to pull your hair out.
            Whether you're looking for notes, want to chat with classmates, or
            need some AI assistance, we've got your back.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              textAlign: "left",
              color: "text.primary",
              fontWeight: 500,
            }}
          >
            The best part? It's made by students, for students. We know the
            struggle because we live it every day! 📚✨
          </Typography>
        </Box>

        {/* Creator Section */}
        <Box sx={{ py: 6, mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 6,
              textAlign: "center",
              color: "text.primary",
            }}
          >
            Meet The Creator 👨‍💻
          </Typography>

          <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
            {/* Creator Avatar - Centered */}
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Avatar
                src="/rahman.jpg"
                sx={{
                  width: 180,
                  height: 180,
                  mx: "auto",
                  mb: 3,
                  border: "4px solid",
                  borderColor: "primary.main",
                }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", mb: 4, color: "text.primary" }}
              >
                Abdur Rahman
              </Typography>
            </Box>

            {/* Creator Story - Centered */}
            <Box sx={{ maxWidth: "700px", mx: "auto", textAlign: "left" }}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.2rem",
                  lineHeight: 1.8,
                  mb: 4,
                  color: "text.secondary",
                }}
              >
                Wassup! I'm Abdur Rahman, and honestly, I'm just a regular
                student who got fed up with the usual academic chaos. 😅
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.2rem",
                  lineHeight: 1.8,
                  mb: 4,
                  color: "text.secondary",
                }}
              >
                <strong>Random fact:</strong> I came up with the name "Omnis"
                during a particularly stressful exam week when I was like "I
                need ONE place for ALL my stuff!" - and boom, Latin word for
                "all" it was! 🤓
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.2rem",
                  lineHeight: 1.8,
                  color: "text.primary",
                  fontWeight: 500,
                }}
              >
                If this platform helps even one person avoid the stress I went
                through, then all those late-night coding sessions were worth
                it. Reach Out to me in campus or off campus, Hit me up if you
                have ideas, complaints, or just want to chat about how we can
                make student life less chaotic! 🚀
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: "center",
            py: 6,
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", mb: 3, color: "primary.main" }}
          >
            Wanna join the fun? 🎉
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: "text.secondary",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Come hang out with us! Find some cool resources, chat with awesome
            people, and maybe make your student life a bit less stressful.
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.1rem", color: "text.primary" }}
          >
            Ready to dive in? Just scroll down to the footer and navigate back
            to the app!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
