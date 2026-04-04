import { Link as RadixLink } from '@radix-ui/themes'
import type { ComponentProps } from 'react'
import { Link as RemixLink } from 'react-router'

export default function Link({
	children,
	...props
}: ComponentProps<typeof RadixLink> & ComponentProps<typeof RemixLink>) {
	return (
		<RadixLink {...props} asChild>
			<RemixLink {...props}>{children}</RemixLink>
		</RadixLink>
	)
}
