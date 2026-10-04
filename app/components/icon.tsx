import * as icons from '@sketchicon/hugeicons'
import { SketchIcon } from 'sketchicon'

type RemoveIconSuffix<S> = S extends `${infer T}Icon` ? T : never

const addSuffix = <S extends string>(icon: S): `${S}Icon` => `${icon}Icon`

export const Icon = ({ icon, size = 0 }: { icon: RemoveIconSuffix<keyof typeof icons>; size?: number }) =>
	<SketchIcon
		icon={icons[addSuffix(icon)]}
		size={16 + 8 * size}
		strokeWidth={2.5 - size / 5}
		className='icon'
	/>
