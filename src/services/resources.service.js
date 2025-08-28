import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

class ResourcesService {
  constructor() {
    this.collectionName = 'resources';
  }

  // Add a new resource
  async addResource(resourceData, userId, userDisplayName = null) {
    try {
      console.log('Adding resource to Firestore:', resourceData);
      console.log('Database instance:', db);
      console.log('User ID:', userId);
      
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...resourceData,
        userId: userId, // Associate resource with user
        createdBy: userDisplayName || 'Anonymous User', // Store user's display name
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Resource added successfully with ID:', docRef.id);
      
      return {
        success: true,
        id: docRef.id,
        message: 'Resource added successfully'
      };
    } catch (error) {
      console.error('Detailed error adding resource:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      return {
        success: false,
        error: error.code,
        message: error.message || 'Failed to add resource'
      };
    }
  }

  // Get all resources (public - all users can see all resources)
  async getResources() {
    try {
      console.log('Fetching all resources from Firestore...');
      
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const resources = [];
      
      querySnapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        });
      });
      
      console.log('Fetched resources:', resources);
      
      return {
        success: true,
        data: resources
      };
    } catch (error) {
      console.error('Detailed error fetching resources:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      return {
        success: false,
        error: error.code,
        message: error.message || 'Failed to fetch resources'
      };
    }
  }

  // Get resources by user (for user's own resources)
  async getUserResources(userId) {
    try {
      console.log('Fetching user resources from Firestore for user:', userId);
      
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const resources = [];
      
      querySnapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        });
      });
      
      console.log('Fetched user resources:', resources);
      
      return {
        success: true,
        data: resources
      };
    } catch (error) {
      console.error('Detailed error fetching user resources:', error);
      
      return {
        success: false,
        error: error.code,
        message: error.message || 'Failed to fetch user resources'
      };
    }
  }

  // Get resources by semester
  async getResourcesBySemester(semester) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('semester', '==', semester),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const resources = [];
      
      querySnapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        });
      });
      
      return {
        success: true,
        data: resources
      };
    } catch (error) {
      console.error('Error fetching resources by semester:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to fetch resources'
      };
    }
  }

  // Get resources by subject
  async getResourcesBySubject(subject) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('subject', '==', subject),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const resources = [];
      
      querySnapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        });
      });
      
      return {
        success: true,
        data: resources
      };
    } catch (error) {
      console.error('Error fetching resources by subject:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to fetch resources'
      };
    }
  }

  // Update a resource
  async updateResource(resourceId, updateData) {
    try {
      const resourceRef = doc(db, this.collectionName, resourceId);
      await updateDoc(resourceRef, {
        ...updateData,
        updatedAt: new Date()
      });
      
      return {
        success: true,
        message: 'Resource updated successfully'
      };
    } catch (error) {
      console.error('Error updating resource:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to update resource'
      };
    }
  }

  // Delete a resource
  async deleteResource(resourceId) {
    try {
      await deleteDoc(doc(db, this.collectionName, resourceId));
      
      return {
        success: true,
        message: 'Resource deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting resource:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to delete resource'
      };
    }
  }

  // Convert Google Drive share URL to direct download URL
  convertToDirectDownloadUrl(shareUrl) {
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
  }
}

// Export singleton instance
export default new ResourcesService();