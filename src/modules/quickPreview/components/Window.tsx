import Dialog from '@components/Dialog';
import React from 'jsx-dom';
import {t} from '@i18n';

function Window() {
	return (
		<Dialog moduleName="quick-preview">
			{t('test', {
				element: <div style={{color: 'red'}}>div</div>,
			})}
		</Dialog>
	);
}

export {Window};
