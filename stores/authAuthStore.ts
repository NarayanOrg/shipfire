import { auth, db } from "@/utils/firebase"
import { FirebaseError } from "firebase/app"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  reload,
  validatePassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GithubAuthProvider,
} from "firebase/auth"
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { toast } from "sonner"
import { create } from "zustand"

interface AuthInterface {
  loading: boolean
  error: null | string
  success: boolean

  login: (formData: { email: string; password: string }, redirect?: string | null) => void
  signUp: (formData: { name: string; email: string; password: string }, redirect?: string | null) => void
  signInWithOAuth: (provider: "google" | "github", redirect?: string | null) => void // You can add more providers
  reload: () => Promise<string | number | undefined>
  resetPassword: (email: string) => void

  logout: () => void
}

export const useAuth = create<AuthInterface>((set) => ({
  loading: false,
  error: null,
  success: false,

  login: async (formData, redirect) => {
    set({ loading: true, error: null, success: false })
    try {
      const results = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      const user = results.user
      const payload: NewUserInterface = {
        name: user.displayName,
        email: formData.email,
        avatar: user.photoURL || null,
        provider_id: "email",
        account_type: "user",
        plan: "free",
        uid: user.uid,
        onboarding_completed: false,
      }
      await addNewUserToDB(payload)
      const idToken = await user.getIdToken()
      await establishSession(idToken)
      set({ success: true })
      window.location.href = redirect ? redirect : '/dashboard'
      toast.success("Welcome back")
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(err.message || "Error logging in")
        set({ loading: false, success: false, error: err.message })
      }
    } finally {
      set({ loading: false })
    }
  },

  signUp: async (formData, redirect) => {
    set({ loading: true, error: null, success: false })
    try {
      const status = await validatePassword(auth, formData.password)
      if (!status.isValid) {
        set({
          loading: false,
          success: false,
          error: "Password did not meet requirements",
        })
        return
      } else {
        const results = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )
        await updateProfile(results.user, { displayName: formData.name })
        const user = results.user

        const payload: NewUserInterface = {
          name: formData.name,
          email: formData.email,
          avatar: user.photoURL || null,
          provider_id: "email",
          account_type: "user",
          plan: "free",
          uid: user.uid,
          onboarding_completed: false,
        }

        await sendEmailVerification(results.user)
        await addNewUserToDB(payload)
        const idToken = await user.getIdToken()
        await establishSession(idToken)

        set({ success: true })
        window.location.href = redirect ? redirect : '/verify-email'
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.log(err)
        toast.error(err.message || "Error signing up")
        set({ loading: false, success: false, error: err.message })
      }
      return null
    } finally {
      set({ loading: false })
    }
  },

  signInWithOAuth: async (providerType, redirect) => {
    set({ loading: true, error: null, success: false })
    try {
      const provider =
        providerType == "google"
          ? new GoogleAuthProvider()
          : new GithubAuthProvider()
      const results = await signInWithPopup(auth, provider)
      const user = results.user

      const payload: NewUserInterface = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL || null,
        provider_id: providerType,
        account_type: "user",
        plan: "free",
        uid: user.uid,
        onboarding_completed: false,
      }

      addNewUserToDB(payload)
      const idToken = await user.getIdToken()
      await establishSession(idToken)

      window.location.href = redirect ? redirect : '/dashboard'
      set({ success: true })
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(err.message || "Error signing in with Google")
        set({ loading: false, success: false, error: err.message })
      }
    } finally {
      set({ loading: false })
    }
  },

  reload: async () => {
    try {
      set({ loading: true, error: null, success: false })
      if (!auth.currentUser) return toast.warning("Login first")
        await reload(auth.currentUser)
      set({ success: true })
      const toastId = toast.loading("Checking verification")
      return toastId
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(err.message || "Error reloading")
        set({ loading: false, success: false, error: err.message })
      }
    } finally {
      set({ loading: false })
    }
  },

  resetPassword: async (email) => {
    try {
      set({ loading: true, error: null, success: false })
      if (!auth.currentUser) return toast.warning("Login to verify email")
      await sendPasswordResetEmail(auth, email)
      set({ success: true })
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(err.message || "Error resending reset password email")
        set({ loading: false, success: false, error: err.message })
      }
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    await signOut(auth)
    await clearSession()
  },
}))

export interface NewUserInterface {
  name: string | null
  email: string | null
  avatar: string | null
  provider_id: "email" | "google" | "github"
  account_type: "user" | "admin"
  plan: "free" | "pro"
  onboarding_completed: boolean
  uid: string
}

const addNewUserToDB = async (userData: NewUserInterface) => {
  try {
    const docRef = doc(db, "users", userData.uid)
    const existing = await getDoc(docRef)

    if (existing.exists()) {
      await updateDoc(docRef, {
        lastSignin: serverTimestamp(),
      })
      toast.success("Welcome back")
    } else {
      await setDoc(docRef, {
        ...userData,
        createdAt: serverTimestamp(),
      })
      toast.success("Account created 🎉")
    }
  } catch (err) {
    if (err instanceof FirebaseError) {
      console.error(err.message)
    }
    throw err
  }
}

async function establishSession(idToken: string): Promise<void> {
  // const idToken = await auth.currentUser?.getIdToken()
  if (!idToken) return

  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  })

  if (!res.ok) {
    throw new Error("Failed to establish session")
  }
}

async function clearSession(): Promise<void> {
  await fetch("/api/auth/session", { method: "DELETE" })
}
