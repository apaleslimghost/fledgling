export default function PageTitle({ title }: { title?: string }) {
	return (
		<title>
			Fledgling
			{title ? ` ☙ ${title}` : ''}
		</title>
	)
}
