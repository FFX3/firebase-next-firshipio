import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'

export default function Home() {
  return (
    <div>
			<button onClick={() => {
				toast.success('🦄 Wow so easy!', {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			}}>
				Toast Me
			</button>
    </div>
  )
}
