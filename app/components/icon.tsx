import * as icons from '@sketchicon/hugeicons'
import { SketchIcon } from 'sketchicon'

type RemoveIconSuffix<S> = S extends `${infer T}Icon` ? T : never

const addSuffix = <S extends string>(icon: S): `${S}Icon` => `${icon}Icon`

export const Icon = ({ icon }: { icon: RemoveIconSuffix<keyof typeof icons>; size?: number }) =>
	<SketchIcon
		icon={icons[addSuffix(icon)]}
		width={undefined}
		height={undefined}
		className='icon'
	/>
