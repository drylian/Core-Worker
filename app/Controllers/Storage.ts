import { InternalKeys,InternalSettings } from "@/Configurations";
import { Configuration } from "@/Classes/Configuration";
import { Collection } from "@/Utils";

class Storage extends Collection<keyof InternalSettings, InternalSettings[keyof InternalSettings]> {
	constructor() {
		super();
	}

	/**
	 * Load Internal Resources
	 */
	public initial() {
		for (const config of Configuration.all) {
			if (config?.internal && config.value) {
				this.set(config.key as keyof InternalSettings, Configuration.convert(config.key, config.value));
			}
		}
	}
}

export const Internal = new Storage();
