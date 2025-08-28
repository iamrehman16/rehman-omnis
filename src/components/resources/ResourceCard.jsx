import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Download, 
  Description, 
  Assignment, 
  MenuBook, 
  TipsAndUpdates, 
  Quiz,
  MoreVert,
  Edit,
  Delete
} from '@mui/icons-material';

const getResourceIcon = (type) => {
  switch (type) {
    case 'Past Paper':
      return <Quiz />;
    case 'Notes':
      return <Description />;
    case 'Assignment':
      return <Assignment />;
    case 'Reference Material':
      return <MenuBook />;
    case 'Tips and Suggestions':
      return <TipsAndUpdates />;
    default:
      return <Description />;
  }
};

const getResourceColor = (type) => {
  switch (type) {
    case 'Past Paper':
      return 'error';
    case 'Notes':
      return 'primary';
    case 'Assignment':
      return 'warning';
    case 'Reference Material':
      return 'success';
    case 'Tips and Suggestions':
      return 'info';
    default:
      return 'default';
  }
};

const ResourceCard = ({ resource, currentUser, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(resource);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(resource);
    handleMenuClose();
  };

  // Check if current user can edit/delete this resource
  const canModify = currentUser && resource.userId === currentUser.uid;
  const handleDownloadResource = () => {
    // Convert Google Drive share URL to direct download URL
    const convertToDirectDownloadUrl = (shareUrl) => {
      try {
        // Extract file ID from various Google Drive URL formats
        let fileId = null;
        
        // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
        const viewMatch = shareUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        if (viewMatch) {
          fileId = viewMatch[1];
        }
        
        // Format: https://drive.google.com/open?id=FILE_ID
        const openMatch = shareUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
        if (openMatch) {
          fileId = openMatch[1];
        }
        
        if (fileId) {
          return `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
        
        return shareUrl; // Return original if can't convert
      } catch (error) {
        console.error('Error converting URL:', error);
        return shareUrl;
      }
    };

    const downloadUrl = convertToDirectDownloadUrl(resource.resourceUrl);
    
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = resource.name || 'resource';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            {getResourceIcon(resource.type)}
            <Typography variant="h6" component="h3" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              {resource.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={handleDownloadResource}
              sx={{ color: 'primary.main' }}
              title="Download Resource"
            >
              <Download fontSize="small" />
            </IconButton>
            {canModify && (
              <IconButton 
                size="small" 
                onClick={handleMenuClick}
                sx={{ color: 'text.secondary' }}
                title="More options"
              >
                <MoreVert fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {resource.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip 
            label={resource.type} 
            size="small" 
            color={getResourceColor(resource.type)}
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            Sem {resource.semester}
          </Typography>
        </Box>
        
        {/* Added by info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Added {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'recently'}
          </Typography>
          {resource.createdBy && (
            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
              By {resource.createdBy}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default ResourceCard;