import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'

export const firebaseConfig = {
  apiKey: "AIzaSyBebAtPTc7W1LGd625znsAbaHkTUda9Y4U",
  authDomain: "naizon-6b3d4.firebaseapp.com",
  projectId: "naizon-6b3d4",
  storageBucket: "naizon-6b3d4.firebasestorage.app",
  messagingSenderId: "158490103345",
  appId: "1:158490103345:web:3d8df957aeabe88d27cf10",
  measurementId: "G-SLCP55FEQM"
}

// Initialize Firebase without duplicate app initialization
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase Auth
export const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Analytics safe initialization
let analytics = null
export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported().catch(() => false)
    if (supported) {
      analytics = getAnalytics(app)
      return analytics
    }
  }
  return null
}

// Auth Helper Functions
export const signUpWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName })
  }
  return userCredential.user
}

export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export const logoutUser = async () => {
  await signOut(auth)
}

export const resetUserPassword = async (email) => {
  await sendPasswordResetEmail(auth, email)
}

export { onAuthStateChanged, analytics }
