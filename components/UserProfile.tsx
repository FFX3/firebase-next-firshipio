export default function UserProfile({ user }) {
	return (
		<div className="box-center">
			<p>
				<i>@{user && user.username}</i>
			</p>
			<h1>{user && user.displayName}</h1>
		</div>
	)
}