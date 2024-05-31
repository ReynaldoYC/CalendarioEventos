
const auth = firebase.auth();

auth.languageCode = "es";

export async function login() {
  try {
    const response = await auth.signInWithPopup(provider);
    return response.user;
  } catch (error) {
    throw new Error(error);
  }
}

export function logout() {
  auth.signOut();
}