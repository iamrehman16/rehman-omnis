import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

class UserService {
  constructor() {
    this.collectionName = 'users';
  }

  // Create or update user profile
  async createOrUpdateUserProfile(user) {
    try {
      const userRef = doc(db, this.collectionName, user.uid);
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0],
        photoURL: user.photoURL || null,
        lastLoginAt: new Date(),
        updatedAt: new Date()
      };

      // Check if user exists
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          ...userData,
          createdAt: userDoc.data().createdAt // Keep original creation date
        });
      } else {
        // Create new user
        await setDoc(userRef, {
          ...userData,
          createdAt: new Date()
        });
      }

      return {
        success: true,
        message: 'User profile updated successfully'
      };
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to update user profile'
      };
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          success: true,
          data: {
            ...userData,
            createdAt: userData.createdAt?.toDate(),
            updatedAt: userData.updatedAt?.toDate(),
            lastLoginAt: userData.lastLoginAt?.toDate()
          }
        };
      } else {
        return {
          success: false,
          message: 'User profile not found'
        };
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to fetch user profile'
      };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updateData) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: new Date()
      });

      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to update profile'
      };
    }
  }

  // Get user statistics
  async getUserStats(userId) {
    try {
      // Get user's resource count
      const resourcesQuery = query(
        collection(db, 'resources'),
        where('userId', '==', userId)
      );
      
      const resourcesSnapshot = await getDocs(resourcesQuery);
      const resourceCount = resourcesSnapshot.size;

      // Calculate resources by type
      const resourcesByType = {};
      resourcesSnapshot.forEach((doc) => {
        const resource = doc.data();
        resourcesByType[resource.type] = (resourcesByType[resource.type] || 0) + 1;
      });

      return {
        success: true,
        data: {
          totalResources: resourceCount,
          resourcesByType,
          joinedAt: null // Will be filled from user profile
        }
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to fetch user statistics'
      };
    }
  }

  // Search users (for admin purposes or user discovery)
  async searchUsers(searchTerm) {
    try {
      const usersQuery = query(
        collection(db, this.collectionName),
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff')
      );

      const querySnapshot = await getDocs(usersQuery);
      const users = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          displayName: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL,
          createdAt: userData.createdAt?.toDate()
        });
      });

      return {
        success: true,
        data: users
      };
    } catch (error) {
      console.error('Error searching users:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to search users'
      };
    }
  }
}

// Export singleton instance
export default new UserService();