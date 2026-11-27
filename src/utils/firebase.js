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

// Team Members & Role Management
export const getTeamMembers = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('naizon_team_members')
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.warn('Error reading team members:', err)
  }
  // Default list includes Super Admin
  return [
    {
      id: 'owner-1',
      name: 'Muhammad Sufiyan',
      email: 'muhammadsufiyandev01@gmail.com',
      role: 'super_admin',
      roleLabel: 'Super Admin (Owner)',
      canViewLeads: true,
      canManageTeam: true,
      addedAt: '2026-01-01T00:00:00.000Z',
      isOwner: true,
    },
  ]
}

export const saveTeamMember = (member) => {
  if (typeof window === 'undefined') return
  const current = getTeamMembers()
  const emailLower = member.email.trim().toLowerCase()
  const existingIdx = current.findIndex((m) => m.email.toLowerCase() === emailLower)
  
  const roleLabelMap = {
    super_admin: 'Super Admin',
    lead_manager: 'Lead Manager (Contact Forms)',
    viewer: 'Viewer (Read-Only Leads)',
  }

  const updatedMember = {
    ...member,
    id: member.id || 'team-' + Date.now(),
    email: emailLower,
    roleLabel: roleLabelMap[member.role] || 'Team Member',
    canViewLeads: true,
    canManageTeam: member.role === 'super_admin',
    addedAt: member.addedAt || new Date().toISOString(),
    isOwner: ADMIN_EMAILS.some((a) => a.toLowerCase() === emailLower),
  }

  let nextList = []
  if (existingIdx >= 0) {
    nextList = [...current]
    nextList[existingIdx] = updatedMember
  } else {
    nextList = [updatedMember, ...current]
  }

  localStorage.setItem('naizon_team_members', JSON.stringify(nextList))
  window.dispatchEvent(new Event('naizon_team_change'))
  return nextList
}

export const removeTeamMember = (email) => {
  if (typeof window === 'undefined') return
  const emailLower = email.trim().toLowerCase()
  // Cannot remove owner
  if (ADMIN_EMAILS.some((a) => a.toLowerCase() === emailLower)) {
    throw new Error('Super Admin owner cannot be removed.')
  }
  const current = getTeamMembers()
  const nextList = current.filter((m) => m.email.toLowerCase() !== emailLower)
  localStorage.setItem('naizon_team_members', JSON.stringify(nextList))
  window.dispatchEvent(new Event('naizon_team_change'))
  return nextList
}

export const canAccessLeads = (userOrEmail) => {
  if (!userOrEmail) return false
  if (isSuperAdmin(userOrEmail)) return true
  const email = (typeof userOrEmail === 'string' ? userOrEmail : userOrEmail?.email || '')
    .trim()
    .toLowerCase()
  const team = getTeamMembers()
  const member = team.find((m) => m.email.toLowerCase() === email)
  return !!(member && member.canViewLeads)
}

export const getUserRole = (userOrEmail) => {
  if (isSuperAdmin(userOrEmail)) return 'Super Admin'
  const email = (typeof userOrEmail === 'string' ? userOrEmail : userOrEmail?.email || '')
    .trim()
    .toLowerCase()
  const team = getTeamMembers()
  const member = team.find((m) => m.email.toLowerCase() === email)
  if (member) return member.roleLabel || 'Team Member'
  return 'Client'
}

// User Profile & Synchronous Cache Helpers
export const getStoredAuthUser = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('naizon_auth_user')
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.warn('Error reading stored user:', err)
  }
  return null
}

export const saveStoredAuthUser = (user) => {
  if (typeof window === 'undefined') return
  if (!user) {
    localStorage.removeItem('naizon_auth_user')
  } else {
    const customAvatar = localStorage.getItem('naizon_user_custom_avatar')
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
      photoURL: customAvatar || user.photoURL || null,
      emailVerified: user.emailVerified,
    }
    localStorage.setItem('naizon_auth_user', JSON.stringify(data))
  }
  window.dispatchEvent(new Event('naizon_auth_change'))
}

export const updateUserAvatar = async (photoDataOrUrl) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('naizon_user_custom_avatar', photoDataOrUrl)
  if (auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, { photoURL: photoDataOrUrl })
    } catch (err) {
      console.warn('Firebase photoURL update notice:', err)
    }
  }
  saveStoredAuthUser(auth.currentUser)
}

export { onAuthStateChanged, analytics, updateProfile }
