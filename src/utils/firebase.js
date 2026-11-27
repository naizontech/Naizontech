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
  sendEmailVerification,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  RecaptchaVerifier,
  signInWithPhoneNumber,
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
  // Automatically dispatch verification email for enterprise security
  try {
    await sendEmailVerification(userCredential.user)
  } catch (err) {
    console.warn('Initial email verification dispatch notice:', err)
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

export const sendVerificationEmail = async (user = auth.currentUser) => {
  if (!user) throw new Error('No user is currently signed in.')
  await sendEmailVerification(user)
}

export const verifyEmailAction = async (oobCode) => {
  return await applyActionCode(auth, oobCode)
}

export const verifyResetCode = async (oobCode) => {
  return await verifyPasswordResetCode(auth, oobCode)
}

export const confirmPasswordResetAction = async (oobCode, newPassword) => {
  return await confirmPasswordReset(auth, oobCode, newPassword)
}

export const reloadUser = async () => {
  if (auth.currentUser) {
    await auth.currentUser.reload()
    return auth.currentUser
  }
  return null
}

// Enterprise Phone OTP (Recaptcha + SMS)
export const setupRecaptcha = (containerId) => {
  if (typeof window === 'undefined') return null
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {},
    })
  }
  return window.recaptchaVerifier
}

export const sendPhoneOtp = async (phoneNumber, appVerifier) => {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
}

// Role & Permissions Configuration
export const ADMIN_EMAILS = [
  'muhammadsufiyandev01@gmail.com',
  'muhammadsufiayandev01@gmail.com',
]

export const ADMIN_EMAIL = 'muhammadsufiyandev01@gmail.com'

export const isSuperAdmin = (userOrEmail) => {
  if (!userOrEmail) return false
  const email = (typeof userOrEmail === 'string' ? userOrEmail : userOrEmail?.email || '')
    .trim()
    .toLowerCase()
  return ADMIN_EMAILS.some((admin) => admin.toLowerCase() === email)
}

export const getUserRole = (userOrEmail) => {
  return isSuperAdmin(userOrEmail) ? 'Super Admin' : 'Client'
}

export { onAuthStateChanged, analytics }
