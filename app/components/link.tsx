import { cn, linkVariants } from '@heroui/styles'
import type { ComponentProps } from 'react'
import { Link as RemixLink } from 'react-router'

export default function Link({ children, className, ...props }: ComponentProps<typeof RemixLink>) {
	return (
		<RemixLink className={cn(linkVariants().base(), className)} {...props}>
			{children}
		</RemixLink>
	)
}
