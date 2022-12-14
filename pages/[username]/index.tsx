import UserProfile from "../../components/UserProfile"
import PostFeed from "../../components/PostFeed"
import { getUserWithUsername, postToJSON } from "../../lib/firebase"
import { collection, where, query as firebaseQuery, orderBy, limit, getDocs, getDoc } from 'firebase/firestore'

export async function getServerSideProps({ query }) {
	const { username } = query

	const userDoc = await getUserWithUsername(username)

	let user = null
	let posts = null
	if (userDoc) {
		user = userDoc.data()
		const postQuery = firebaseQuery(
			collection(userDoc.ref, 'posts'),
			where('published', '==', true),
			orderBy('createdAt', 'desc'),
			limit(5)
		)

		posts = (await getDocs(postQuery)).docs.map(postToJSON)
	}

	return {
		props: { user, posts }
	}
}

export default function UserProfilePage({ user, posts }) {
	return (
		<main>
			<UserProfile user={user} />
			<PostFeed posts={posts} />
		</main>
	)
}