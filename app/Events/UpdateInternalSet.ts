import { Configuration } from "@/Classes/Configuration";
import { Events } from "@/Classes/Events";
import { InternalSettings } from "@/Configurations";
import Loggings from "@/Controllers/Loggings";
import { Internal } from "@/Controllers/Storage";

const Core = new Loggings("Atualizações", "gray");
new Events({
	name: "UpdateInternalSet",
	run: async (key, value) => {
		Core.debug(`A key [${key}].blue-b foi atualizada`);
		Internal.set(key as keyof InternalSettings, Configuration.convert(key, value));
	},
});
