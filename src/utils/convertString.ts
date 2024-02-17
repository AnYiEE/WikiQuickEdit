const camelize = (string: string, space: boolean = true): string => {
	return string.replace(/-./g, (substring: string): string => {
		const [, char] = substring;
		if (!char) {
			return substring;
		}

		return (space ? ' ' : '') + char.toUpperCase();
	});
};

const capitalizeFirstLetter = (string: string): string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const firstLetters = (string: string, separator: string = ' '): string => {
	return string
		.split(separator)
		.map((word: string): string => {
			return word.charAt(0);
		})
		.join('');
};

export {camelize, capitalizeFirstLetter, firstLetters};
