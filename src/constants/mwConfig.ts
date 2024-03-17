let mwConfig: MediaWikiConfigMap = mw.config.get();

const refreshMwConfig = (): void => {
	mwConfig = mw.config.get();
};

export {mwConfig, refreshMwConfig};
