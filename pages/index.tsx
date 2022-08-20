import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'

import { useState } from 'react'
import { firestore, postToJSON } from '../lib/firebase'
import { collectionGroup, orderBy, query, where, limit, getDocs, Timestamp, startAfter } from 'firebase/firestore'
import PostFeed from '../components/PostFeed'

const LIMIT = 1

export async function getServerSideProps(context){
	const q = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt'), limit(LIMIT))
	const posts = (await getDocs(q)).docs.map(postToJSON)

	return {
		props: { posts },
	}
}

export default function Home(props) {
	const [posts, setPosts] = useState(props.posts)
	const [loading, setLoading] = useState(false)

	const [postsEnd, setPostsEnd] = useState(false)

	const getMorePosts = async () => {
		setLoading(true)
		const last = posts[posts.length -1]
		const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt

		const q = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt'), startAfter(cursor), limit(LIMIT))
		const newPost = (await getDocs(q)).docs.map(doc => doc.data())

		setPosts(posts.concat(newPost))
		setLoading(false)

		if(newPost.length < LIMIT) {
			setPostsEnd(true)
		}
	}

  return (
    <main>
			<PostFeed posts={posts} />

			{!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

			<Loader show={loading} />

			{postsEnd && 'You have reached the end!'}
    </main>
  )
}
