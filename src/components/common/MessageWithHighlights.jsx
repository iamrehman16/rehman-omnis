import React from "react";
import { Typography, Box, Chip } from "@mui/material";

const MessageWithHighlights = ({ text }) => {
  // Parse the message to find resource references
  const parseMessage = (message) => {
    // Split by resource pattern: 📚 **Resource:** 'Title' (Type) by Author in Subject
    const resourcePattern =
      /📚\s*\*\*Resource:\*\*\s*'([^']+)'\s*\(([^)]+)\)\s*by\s*([^-]+)\s*-\s*([^\n]*)/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = resourcePattern.exec(message)) !== null) {
      // Add text before the resource
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: message.slice(lastIndex, match.index),
        });
      }

      // Add the resource as a highlighted component
      parts.push({
        type: "resource",
        title: match[1],
        resourceType: match[2],
        author: match[3].trim(),
        description: match[4],
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < message.length) {
      parts.push({
        type: "text",
        content: message.slice(lastIndex),
      });
    }

    return parts;
  };

  const parts = parseMessage(text);

  return (
    <Box>
      {parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <Typography
              key={index}
              variant="body2"
              component="span"
              sx={{ fontSize: "0.85rem", whiteSpace: "pre-wrap" }}
            >
              {part.content}
            </Typography>
          );
        } else if (part.type === "resource") {
          return (
            <Box key={index} sx={{ my: 1 }}>
              <Chip
                //icon={<ResourceIcon />}
                label={
                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", fontSize: "0.8rem" }}
                    >
                      {part.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "0.7rem", opacity: 0.8 }}
                    >
                      {part.resourceType} by {part.author}
                    </Typography>
                    {part.description && (
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "0.7rem", display: "block", mt: 0.5 }}
                      >
                        {part.description}
                      </Typography>
                    )}
                  </Box>
                }
                variant="outlined"
                color="primary"
                sx={{
                  height: "auto",
                  padding: 1,
                  width: "280px", // Fixed width for consistency
                  "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "normal",
                    padding: 0,
                    width: "100%",
                  },
                  backgroundColor: "primary.50",
                  borderColor: "primary.main",
                }}
              />
            </Box>
          );
        }
        return null;
      })}
    </Box>
  );
};

export default MessageWithHighlights;
