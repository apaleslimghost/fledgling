import BwipJs from 'bwip-js'
import type { ComponentProps } from 'react'

export const QrCode = ({
	data,
	...props
}: { data: string } & ComponentProps<'svg'>) => {
	const [barcode] = BwipJs.raw('qrcode', data)
	if (!barcode || !('pixs' in barcode)) return

	return (
		<svg
			{...props}
			viewBox={`0 0 ${barcode.pixx} ${barcode.pixy}`}
			version='1.1'
			xmlns='http://www.w3.org/2000/svg'
		>
			{barcode.pixs.map((pix, index) => (
				pix ? <rect
					fill='black'
					width={1}
					height={1}
					x={index % barcode.pixx}
					y={Math.floor(index / barcode.pixx)}
					key={index}
				/> : null
			))}
		</svg>
	)
}
