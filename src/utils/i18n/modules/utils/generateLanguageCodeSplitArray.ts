const generateLanguageCodeSplitArray = (originLanguageCode: string): string[] => {
	const languageCodeSplitArray: string[] = originLanguageCode.split('-').map<string>((value) => {
		return value.toLowerCase();
	});

	return languageCodeSplitArray;
};

export {generateLanguageCodeSplitArray};
