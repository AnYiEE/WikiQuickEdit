import React from 'jsx-dom';
import {Window} from './components/Window';
import {filterElement} from './methods/filterElement';

const quickPreview = ($rootElement: JQuery): void => {
	const targetElements: HTMLAnchorElement[] = [];

	for (const element of $rootElement.find('a')) {
		if (!filterElement(element)) {
			continue;
		}
		targetElements.push(element);
	}

	for (const element of targetElements) {
		const windowElement = <Window />;
		element.addEventListener('click', (event) => {
			event.preventDefault();
			document.body.append(windowElement);
		});
		windowElement.addEventListener('click', () => {
			windowElement.remove();
		});
	}
};

export {quickPreview};
