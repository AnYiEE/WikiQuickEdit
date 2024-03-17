import React from 'jsx-dom';
import {localize} from '@utils/i18n/i18n';
import {messages} from './messages';

type MessageKeys = keyof typeof messages;

const generateI18nMessages = (): Readonly<typeof msg> => {
	const msg = {} as Record<MessageKeys, string>;

	for (const [key, message] of Object.entries(messages)) {
		msg[key as MessageKeys] = localize(message);
	}

	return msg;
};

const i18nMessages = generateI18nMessages();

type I18nMessages = typeof i18nMessages;

function t<K extends MessageKeys>(key: K): K | NonNullable<I18nMessages[K]>;
function t<K extends MessageKeys>(key: K, components: Record<string, React.JSX.Element>): React.JSX.Element;
function t<K extends MessageKeys>(
	key: K,
	components?: Record<string, React.JSX.Element>
): K | NonNullable<I18nMessages[K]> | React.JSX.Element {
	const message = i18nMessages[key];
	const fallbackMessage = i18nMessages[key] || key;

	if (!components) {
		return fallbackMessage;
	}

	const regExpMatchArray: RegExpMatchArray | null = message.match(/\{\{(\S+?)\}\}/g);
	if (!regExpMatchArray) {
		return fallbackMessage;
	}

	const componentFragment: React.JSX.Element[] = [];
	for (const element of regExpMatchArray) {
		const splitArray: string[] = message.split(element);
		componentFragment.push(
			<>
				{splitArray.shift()}
				{components[element.replace(/^\{\{|\}\}$/g, '')] ?? element}
				{splitArray.join(',')}
			</>
		);
	}

	return <>{componentFragment}</>;
}

export {t};
