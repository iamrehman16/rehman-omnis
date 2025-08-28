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
        // Update existing user (preserve role and other data)
        await updateDoc(userRef, {
          ...userData,
          createdAt: userDoc.data().createdAt, // Keep original creation date
          role: userDoc.data().role || 'student', // Keep existing role or default to student
          specialties: userDoc.data().specialties || [],
          bio: userDoc.data().bio || ''
        });
      } else {
        // Create new user with default role
        await setDoc(userRef, {
          ...userData,
          createdAt: new Date(),
          role: 'student', // Default role for new users
          specialties: [],
          bio: '',
          rating: 0,
          totalRatings: 0
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

  // Update user role (admin only)
  async updateUserRole(userId, newRole) {
    try {
      const validRoles = ['student', 'contributor', 'admin'];
      if (!validRoles.includes(newRole)) {
        return {
          success: false,
          message: 'Invalid role. Must be student, contributor, or admin'
        };
      }

      const userRef = doc(db, this.collectionName, userId);
      const updateData = {
        role: newRole,
        updatedAt: new Date()
      };

      // Clear rejection status if changing from rejected_contributor
      if (newRole !== 'rejected_contributor') {
        updateData.rejectedAt = null;
      }

      await updateDoc(userRef, updateData);

      return {
        success: true,
        message: `User role updated to ${newRole}`
      };
    } catch (error) {
      console.error('Error updating user role:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to update user role'
      };
    }
  }

  // Get contributors for Ask page
  async getContributors() {
    try {
      const contributorsQuery = query(
        collection(db, this.collectionName),
        where('role', '==', 'contributor')
      );

      const querySnapshot = await getDocs(contributorsQuery);
      const contributors = [];

      // Get resource counts for each contributor
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        
        // Get resource count for this contributor
        const resourcesQuery = query(
          collection(db, 'resources'),
          where('userId', '==', doc.id)
        );
        const resourcesSnapshot = await getDocs(resourcesQuery);
        const resourceCount = resourcesSnapshot.size;

        contributors.push({
          id: doc.id,
          name: userData.displayName,
          email: userData.email,
          avatar: userData.photoURL,
          resourceCount,
          specialties: userData.specialties || [],
          rating: userData.rating || 0,
          totalRatings: userData.totalRatings || 0,
          joinedDate: userData.createdAt?.toDate(),
          bio: userData.bio || 'No bio available',
          role: userData.role
        });
      }

      return {
        success: true,
        data: contributors
      };
    } catch (error) {
      console.error('Error fetching contributors:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to fetch contributors'
      };
    }
  }

  // Update contributor profile (specialties, bio, etc.)
  async updateContributorProfile(userId, profileData) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      
      const updateData = {
        updatedAt: new Date()
      };

      if (profileData.specialties) updateData.specialties = profileData.specialties;
      if (profileData.bio) updateData.bio = profileData.bio;
      
      await updateDoc(userRef, updateData);

      return {
        success: true,
        message: 'Contributor profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating contributor profile:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to update contributor profile'
      };
    }
  }

  // Request to become a contributor (pending approval)
  async requestContributorRole(userId, specialties, bio) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      
      await updateDoc(userRef, {
        role: 'pending_contributor',
        specialties: specialties || [],
        bio: bio || '',
        contributorRequestDate: new Date(),
        updatedAt: new Date()
      });

      return {
        success: true,
        message: 'Your contributor request has been submitted! An admin will review it soon.'
      };
    } catch (error) {
      console.error('Error submitting contributor request:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to submit contributor request'
      };
    }
  }

  // Get pending contributor requests (admin only)
  async getPendingContributorRequests() {
    try {
      const pendingQuery = query(
        collection(db, this.collectionName),
        where('role', '==', 'pending_contributor')
      );

      const querySnapshot = await getDocs(pendingQuery);
      const pendingRequests = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        pendingRequests.push({
          id: doc.id,
          name: userData.displayName,
          email: userData.email,
          avatar: userData.photoURL,
          specialties: userData.specialties || [],
          bio: userData.bio || '',
          requestDate: userData.contributorRequestDate?.toDate(),
          joinedDate: userData.createdAt?.toDate()
        });
      });

      return {
        success: true,
        data: pendingRequests
      };
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to fetch pending requests'
      };
    }
  }

  // Approve contributor request (admin only)
  async approveContributorRequest(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      
      await updateDoc(userRef, {
        role: 'contributor',
        rating: 0,
        totalRatings: 0,
        approvedAt: new Date(),
        updatedAt: new Date()
      });

      return {
        success: true,
        message: 'Contributor request approved successfully'
      };
    } catch (error) {
      console.error('Error approving contributor request:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to approve contributor request'
      };
    }
  }

  // Reject contributor request (admin only)
  async rejectContributorRequest(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      
      await updateDoc(userRef, {
        role: 'rejected_contributor',
        specialties: [],
        bio: '',
        contributorRequestDate: null,
        rejectedAt: new Date(),
        updatedAt: new Date()
      });

      return {
        success: true,
        message: 'Contributor request rejected'
      };
    } catch (error) {
      console.error('Error rejecting contributor request:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to reject contributor request'
      };
    }
  }

  // Get admin statistics
  async getAdminStats() {
    try {
      // Get user counts by role
      const usersSnapshot = await getDocs(collection(db, this.collectionName));
      const userStats = {
        total: 0,
        students: 0,
        contributors: 0,
        admins: 0,
        pending: 0
      };

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        userStats.total++;
        
        switch (userData.role) {
          case 'student':
            userStats.students++;
            break;
          case 'contributor':
            userStats.contributors++;
            break;
          case 'admin':
            userStats.admins++;
            break;
          case 'pending_contributor':
            userStats.pending++;
            break;
          case 'rejected_contributor':
            userStats.students++; // Count rejected as students for stats
            break;
        }
      });

      // Get resource count
      const resourcesSnapshot = await getDocs(collection(db, 'resources'));
      const resourceCount = resourcesSnapshot.size;

      return {
        success: true,
        data: {
          users: userStats,
          resources: resourceCount
        }
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to fetch admin statistics'
      };
    }
  }

  // Check if user is admin
  async isUserAdmin(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data().role === 'admin';
      }
      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Initialize admin user (run once)
  async initializeAdmin() {
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (!adminEmail) {
        console.error('Admin email not configured in environment variables');
        return;
      }

      // Find user by email
      const usersQuery = query(
        collection(db, this.collectionName),
        where('email', '==', adminEmail)
      );

      const querySnapshot = await getDocs(usersQuery);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, this.collectionName, userDoc.id);
        
        await updateDoc(userRef, {
          role: 'admin',
          updatedAt: new Date()
        });

        console.log('Admin user initialized successfully');
        return {
          success: true,
          message: 'Admin user initialized'
        };
      } else {
        console.log('Admin user not found. Please sign up first with the admin email.');
        return {
          success: false,
          message: 'Admin user not found'
        };
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to initialize admin'
      };
    }
  }

  // Check if user can apply to become contributor
  async canApplyForContributor(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role || 'student';
        
        // Can apply if they are a student (not rejected, pending, or already contributor/admin)
        return {
          success: true,
          canApply: role === 'student',
          currentRole: role,
          rejectedAt: userData.rejectedAt?.toDate()
        };
      }

      return {
        success: false,
        canApply: false,
        message: 'User not found'
      };
    } catch (error) {
      console.error('Error checking contributor eligibility:', error);
      return {
        success: false,
        canApply: false,
        error: error.code,
        message: 'Failed to check eligibility'
      };
    }
  }

  // Search users (for admin purposes or user discovery)
  async searchUsers(searchTerm) {
    try {
      // If no search term, get all users
      let usersQuery;
      if (!searchTerm || searchTerm.trim() === '') {
        usersQuery = collection(db, this.collectionName);
      } else {
        usersQuery = query(
          collection(db, this.collectionName),
          where('displayName', '>=', searchTerm),
          where('displayName', '<=', searchTerm + '\uf8ff')
        );
      }

      const querySnapshot = await getDocs(usersQuery);
      const users = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          displayName: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL,
          role: userData.role || 'student',
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