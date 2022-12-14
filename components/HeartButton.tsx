import { firestore, auth } from "../lib/firebase"
import { useDocument } from "react-firebase-hooks/firestore"
import { collection, doc, increment, writeBatch } from "firebase/firestore"
import { async } from "@firebase/util"

export default function HeartButton({ postRef }) {
	const heartRef = doc(collection(postRef, 'hearts'), auth.currentUser.uid)
	const [heartDoc] = useDocument(heartRef)

	const addHeart = async () => {
		const uid = auth.currentUser.uid
		const batch = writeBatch(firestore)

		batch.update(postRef, { heartCount: increment(1) })
		batch.set(heartRef, { uid })

		await batch.commit()
	}

	const removeHeart = async () => {
		const uid = auth.currentUser.uid
		const batch = writeBatch(firestore)

		batch.update(postRef, { heartCount: increment(-1) })
		batch.delete(heartRef)

		await batch.commit()
	}

	return heartDoc?.exists() ? (
		<button onClick={removeHeart}>Unheart</button>
	) : (
		<button onClick={addHeart}>Heart</button>
	)
}