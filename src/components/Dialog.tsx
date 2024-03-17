import React, {ShadowRoot} from 'jsx-dom';
import {container, wrapper} from './Dialog.module.less';
import {GADGET_NAME_ORIGINAL} from '@constants/constants';
import {globalConfig} from '@constants/globalConfig';

interface Props {
	moduleName: string;
}

function Dialog(props: React.PropsWithChildren<Props>) {
	const {children, moduleName} = props;
	const {styleUrl} = globalConfig;

	return (
		<div
			className="gadget-nospace"
			id={`${GADGET_NAME_ORIGINAL}__${moduleName}`}
			style={{position: 'fixed', top: '-100000px', zIndex: 100_000}}
		>
			<ShadowRoot mode="closed">
				<link rel="stylesheet" href={styleUrl} />
				<div className={wrapper}>
					<div className={container}>{children}</div>
				</div>
			</ShadowRoot>
		</div>
	);
}

export default Dialog;
