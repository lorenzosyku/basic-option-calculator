import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export const signUp = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

export const login = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};
