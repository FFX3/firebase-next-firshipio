import { useState } from 'react'
import { auth, storage } from '../lib/firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Loader from './Loader'

export default function ImageUploader$({ }) {
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [downloadURL, setDownloadURL] = useState(null)

	const uploadFile = async (e) => {
		const file = Array.from(e.target.files)[0]
		const extension = file.type.split('/')[1]

		const r = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`)

		setUploading(true)
		
		const uploadTask = uploadBytesResumable(r, file)

		uploadTask.on('state_changed', 
			(snapshot) => {
				const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
				setProgress(pct)
			},
			(error) => {
				console.error(error.message)
				setUploading(false)
			},
			async () => {
				const url = await getDownloadURL(r)
				setDownloadURL(url)
				setUploading(false)
			}
		)
	}


	return (
		<div className="box">
			<Loader show={uploading} />
			{uploading && <h3>{progress}%</h3>}

			{!uploading && (
				<>
					<label className='btn'>
						Upload Img
						<input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg"/>
					</label>
				</>
			)}

			{downloadURL && <code className='upload-snippet'>{`![alt](${downloadURL})`}</code>}
		</div>
	)
}