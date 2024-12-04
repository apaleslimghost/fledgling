import { Link as RadixLink } from '@radix-ui/themes'
import { Link as RemixLink } from "@remix-run/react";
import { ComponentProps } from 'react';

export default function Link({children, ...props}: ComponentProps<typeof RadixLink> & ComponentProps<typeof RemixLink>) {
	return <RadixLink {...props} asChild>
		<RemixLink {...props}>
			{children}
		</RemixLink>
	</RadixLink>
}
