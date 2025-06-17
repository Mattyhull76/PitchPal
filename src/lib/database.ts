import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { StartupIdea, PitchDeck, ExecutiveSummary, User } from '@/types/pitch';

// Collections
const USERS_COLLECTION = 'users';
const IDEAS_COLLECTION = 'ideas';
const PITCH_DECKS_COLLECTION = 'pitchDecks';
const EXECUTIVE_SUMMARIES_COLLECTION = 'executiveSummaries';

// Helper function to convert Firestore timestamps to Date objects
const convertTimestamps = (data: any) => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// User operations
export const createUser = async (userData: Omit<User, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, USERS_COLLECTION), {
    ...userData,
    createdAt: Timestamp.fromDate(userData.createdAt),
  });
  return docRef.id;
};

export const getUser = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, USERS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return convertTimestamps({ id: docSnap.id, ...docSnap.data() }) as User;
  }
  return null;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  const docRef = doc(db, USERS_COLLECTION, userId);
  const updateData = { ...updates };
  
  // Convert Date objects to Timestamps
  Object.keys(updateData).forEach(key => {
    if (updateData[key as keyof User] instanceof Date) {
      updateData[key as keyof User] = Timestamp.fromDate(updateData[key as keyof User] as Date) as any;
    }
  });
  
  await updateDoc(docRef, updateData);
};

// Startup Idea operations
export const createIdea = async (ideaData: Omit<StartupIdea, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, IDEAS_COLLECTION), {
    ...ideaData,
    createdAt: Timestamp.fromDate(ideaData.createdAt),
    updatedAt: Timestamp.fromDate(ideaData.updatedAt),
  });
  return docRef.id;
};

export const getIdea = async (ideaId: string): Promise<StartupIdea | null> => {
  const docRef = doc(db, IDEAS_COLLECTION, ideaId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return convertTimestamps({ id: docSnap.id, ...docSnap.data() }) as StartupIdea;
  }
  return null;
};

export const getUserIdeas = async (userId: string): Promise<StartupIdea[]> => {
  const q = query(
    collection(db, IDEAS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => 
    convertTimestamps({ id: doc.id, ...doc.data() }) as StartupIdea
  );
};

// Pitch Deck operations
export const createPitchDeck = async (pitchData: Omit<PitchDeck, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, PITCH_DECKS_COLLECTION), {
    ...pitchData,
    createdAt: Timestamp.fromDate(pitchData.createdAt),
    updatedAt: Timestamp.fromDate(pitchData.updatedAt),
  });
  return docRef.id;
};

export const getPitchDeck = async (pitchId: string): Promise<PitchDeck | null> => {
  const docRef = doc(db, PITCH_DECKS_COLLECTION, pitchId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return convertTimestamps({ id: docSnap.id, ...docSnap.data() }) as PitchDeck;
  }
  return null;
};

export const getUserPitchDecks = async (userId: string): Promise<PitchDeck[]> => {
  const q = query(
    collection(db, PITCH_DECKS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => 
    convertTimestamps({ id: doc.id, ...doc.data() }) as PitchDeck
  );
};

export const updatePitchDeck = async (pitchId: string, updates: Partial<PitchDeck>): Promise<void> => {
  const docRef = doc(db, PITCH_DECKS_COLLECTION, pitchId);
  const updateData = { ...updates };
  
  // Convert Date objects to Timestamps
  Object.keys(updateData).forEach(key => {
    if (updateData[key as keyof PitchDeck] instanceof Date) {
      updateData[key as keyof PitchDeck] = Timestamp.fromDate(updateData[key as keyof PitchDeck] as Date) as any;
    }
  });
  
  await updateDoc(docRef, updateData);
};

export const deletePitchDeck = async (pitchId: string): Promise<void> => {
  const docRef = doc(db, PITCH_DECKS_COLLECTION, pitchId);
  await deleteDoc(docRef);
};

// Executive Summary operations
export const createExecutiveSummary = async (summaryData: Omit<ExecutiveSummary, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, EXECUTIVE_SUMMARIES_COLLECTION), {
    ...summaryData,
    createdAt: Timestamp.fromDate(summaryData.createdAt),
    updatedAt: Timestamp.fromDate(summaryData.updatedAt),
  });
  return docRef.id;
};

export const getExecutiveSummary = async (summaryId: string): Promise<ExecutiveSummary | null> => {
  const docRef = doc(db, EXECUTIVE_SUMMARIES_COLLECTION, summaryId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return convertTimestamps({ id: docSnap.id, ...docSnap.data() }) as ExecutiveSummary;
  }
  return null;
};

export const getExecutiveSummaryByIdeaId = async (ideaId: string): Promise<ExecutiveSummary | null> => {
  const q = query(
    collection(db, EXECUTIVE_SUMMARIES_COLLECTION),
    where('ideaId', '==', ideaId),
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return convertTimestamps({ id: doc.id, ...doc.data() }) as ExecutiveSummary;
  }
  return null;
};

// Analytics operations
export const incrementPitchView = async (pitchId: string): Promise<void> => {
  // This would typically update analytics data
  // For now, we'll just log it
  console.log(`Pitch ${pitchId} viewed`);
};

export const trackPitchShare = async (pitchId: string, shareMethod: string): Promise<void> => {
  // This would typically track sharing analytics
  console.log(`Pitch ${pitchId} shared via ${shareMethod}`);
};
