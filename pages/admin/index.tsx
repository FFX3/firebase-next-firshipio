import AuthCheck from "../../components/AuthCheck";
import Metatags from "../../components/Metatags";

export default function Admin({ }) {
	return (
		<main>
			<AuthCheck>
				<Metatags title="admin page" />
				<h1>Edit Post</h1>
			</AuthCheck>
		</main>
	)
}