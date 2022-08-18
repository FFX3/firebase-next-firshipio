import { auth, googleAuthProvider } from '../lib/firebase'
import { signInWithPopup } from 'firebase/auth'

export default function Enter({ }) {
	const user = null
	const username = null
	return (
		<main>
			{user ? 
				!username ? <UsernameForm /> : <SignOutButton />
				:
				<SignInButton />
			}
		</main>
	)
}

function SignInButton(){
	const signInWithGoogle = async () => {
		await signInWithPopup(auth, googleAuthProvider)
	}
	return (
		<button className='btn-google' onClick={signInWithGoogle}>
			Sign in with Google
		</button>
	)
}

function UsernameForm(){
	return (
		null
	)
}

function SignOutButton(){
	return <button onClick={() => auth.signOut()}>Sign Out</button>
}