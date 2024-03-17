interface GlobalConfig {
	styleUrl: string;
}

let globalConfig: GlobalConfig = {
	styleUrl: '',
};

const refreshGlobalConfig = (config: GlobalConfig): void => {
	globalConfig = config;
};

export {globalConfig, refreshGlobalConfig};
