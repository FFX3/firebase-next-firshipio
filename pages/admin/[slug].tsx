import { collection, getDoc, doc, updateDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import AuthCheck from "../../components/AuthCheck";
import { auth, firestore } from "../../lib/firebase";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { toast } from "react-toastify";
import Link from "next/link";
import ImageUploader from '../../components/ImageUploader'

export default function AdminPostEdit({ }) {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	)
}

function PostManager() {
	const [preview, setPreview] = useState(false)

	const router = useRouter()
	const { slug } = router.query
	
	const postRef = doc(firestore, 'users', auth.currentUser.uid, 'posts', slug)

	const [post] = useDocumentDataOnce(postRef)
	
	return (
		<main>
			{post && (
				<>
					<h1>{post.title}</h1>
					<div style={{display: 'grid', gridTemplateColumns: '[main] 80% [aside] 20%', gap: '1rem'}}>
						<section>
							<p>ID: {post.slug}</p>
							<PostForm postRef={postRef} defaultValues={post} preview={preview} />
						</section>
						
						<aside>
							<h3>Tools</h3>
							<button style={{width:"100%"}} onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
							<Link href={`/${post.username}/${post.slug}`}>
								<button style={{width:"100%"}} className="btn-blue">Live view</button>
							</Link>
						</aside>
					</div>
				</>
			)}
		</main>
	)
}

function PostForm({ defaultValues, postRef, preview }){ 
	const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: 'onChange'})

	const { isValid, isDirty, errors } = formState

	const updatePost = async ({ content, published }) => {
		await updateDoc(postRef, {
			content,
			published,
			updatedAt: serverTimestamp()
		})

		reset({ content, published })

		toast('Post updated successfully!')
	}

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{preview && (
				<div className="card">
					<ReactMarkdown>{watch('content')}</ReactMarkdown>
				</div>
			)}

			<div style={{ display: preview ? 'hidden' : 'block'}}>
				<ImageUploader />
				<textarea className="card" style={{width: '100%'}} {...register('content', {
					maxLength: { value: 20000, message: 'content is too long' },
					minLength: { value: 10, message: 'content is too short' },
					required: { value: true, message: 'content is required' }
				})} ></textarea>

				{ typeof errors.content?.message === 'string' && <p className="text-danger">{ errors.content.message }</p> }

				<fieldset>
					<input style={{display: 'inline-block'}} type="checkbox" {...register('published')} />
					<label style={{display: 'inline-block'}}>Published</label>
				</fieldset>

				<button type="submit" className="btn-green" style={{width:"100%"}}  disabled={!isDirty || !isValid} >
					Save Changes
				</button>
			</div>
		</form>
	)
}


