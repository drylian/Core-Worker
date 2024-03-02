import CoreProvinder, { CoreProvinderAttributes } from "@/Models/Core.model";
import { Configuration } from "@/Controllers/Configurations/Configuration";
import { Internal } from "@/Controllers/Storage";
import { Console, LogMessage } from "../Loggings/OnlyConsole";
function Core(type: string, ...args: LogMessage[]) {
	return Console("Migrations", "cyan", type, args);
}

/**
 * Migration Configurations
 * @param params
 */
export async function Migrations() {
	const configurations = Configuration.all;
	for (const config of configurations) {
		if (!config?.internal) {
			// database resources
			let KeyDB = await CoreProvinder.findByPk(config.key);

			if (!KeyDB) {
				KeyDB = await CoreProvinder.create({
					key: config.key,
					value: config.value ? config.value.toString() : undefined,
					description: config.description,
					type: config.type,
				});
			}
			Internal.set(config.key, Configuration.convert(KeyDB.dataValues.key, KeyDB.dataValues.value));
		}
	}
}
export async function MigrationUpdate(updated: CoreProvinderAttributes) {
	let KeyDB = await CoreProvinder.findByPk(updated.key);

	if (!KeyDB) {
		KeyDB = await CoreProvinder.create({
			key: updated.key,
			value: updated.value ? updated.value.toString() : undefined,
			description: updated.description,
			type: updated.type,
		});
	}
	Internal.set(KeyDB.dataValues.key, Configuration.convert(KeyDB.dataValues.key, KeyDB.dataValues.value));
}
export async function KeyMigration(key: string) {
	const configurations = Configuration.all;
	for (const config of configurations) {
		if (!config?.internal && config.key === key) {
			// database resources
			let KeyDB = await CoreProvinder.findByPk(config.key);

			if (!KeyDB) {
				KeyDB = await CoreProvinder.create({
					key: config.key,
					value: config.value ? config.value.toString() : undefined,
					description: config.description,
					type: config.type,
				});
			}
			Internal.set(config.key, Configuration.convert(KeyDB.dataValues.key, KeyDB.dataValues.value));
			Core("Key", `[${KeyDB.dataValues.key}].green Migrado.`);
		}
	}
}
