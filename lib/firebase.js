import { getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs, limit } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: "AIzaSyA7zwyuh9fQK9u5PrIFpxRomg_wuDm7xWc",
  authDomain: "fireship-nextfire-4684e.firebaseapp.com",
  projectId: "fireship-nextfire-4684e",
  storageBucket: "fireship-nextfire-4684e.appspot.com",
  messagingSenderId: "140106256782",
  appId: "1:140106256782:web:823503ba604aa5966e14df"
}

let app
if(!getApps.length){
	app = initializeApp(firebaseConfig)
}
export const auth = getAuth(app)
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore  = getFirestore(app)
export const storage = getStorage(app)


export async function getUserWithUsername(username) {
	const userRef = collection(firestore, 'users')
	const q = query(userRef, where('username', '==', username), limit(1))
	return (await getDocs(q)).docs[0]
}

export function postToJSON(doc) {
	const data = doc.data()
	return {
		...data,
		createdAt: data.createdAt.toMillis(),
		updatedAt: data.updatedAt.toMillis()
	}
}