import * as icons from '@sketchicon/hugeicons'
import type { ComponentProps } from 'react'
import { SketchIcon } from 'sketchicon'

type RemoveIconSuffix<S> = S extends `${infer T}Icon` ? T : never

const addSuffix = <S extends string>(icon: S): `${S}Icon` => `${icon}Icon`

export const Icon = ({ icon, className, ...props }: Omit<ComponentProps<typeof SketchIcon>, 'icon'> & {
	icon: RemoveIconSuffix<keyof typeof icons>
}) =>
	<SketchIcon
		icon={icons[addSuffix(icon)]}
		width={undefined}
		height={undefined}
		className={`icon ${className ?? ''}`}
		{...props}
	/>
