import { At, CopyCheckXmark, FontCursor, Hashtag, SquareDashedText } from '@gravity-ui/icons'
import type { ElementType } from 'react'
import type { Property } from '~/lib/rx-types'

export const propertyTypes: {
	type: Property['type']
	name: string
	icon: ElementType
}[] = [
	{ type: 'text', name: 'Text', icon: SquareDashedText },
	{ type: 'number', name: 'Number', icon: FontCursor },
	{ type: 'boolean', name: 'Boolean', icon: CopyCheckXmark },
	{ type: 'tag', name: 'Tag', icon: Hashtag },
	{ type: 'note', name: 'Note', icon: At },
]
