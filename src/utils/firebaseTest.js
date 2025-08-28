import { db } from '../config/firebase.config';
import { collection, addDoc } from 'firebase/firestore';

export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    console.log('Database instance:', db);
    
    // Try to add a test document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Connection test'
    };
    
    const docRef = await addDoc(collection(db, 'test'), testDoc);
    console.log('Test document added with ID:', docRef.id);
    
    return { success: true, message: 'Firestore connection successful' };
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return { 
      success: false, 
      error: error.code, 
      message: error.message 
    };
  }
};