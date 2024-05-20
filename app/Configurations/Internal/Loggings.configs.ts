import { Configuration } from "@/Classes/Configuration";
import { Env } from "@/Utils";
export default new Configuration([
	{
		key: "loggings:level",
		env: "CORE_LOGGINGS_LEVEL",
		type: [Configuration.SetTypes.String],
		internal: true,
		description: "Loggings do painel, \"Debug\", \"Info\", \"Warn\", \"Error\"",
		checker: (env, dafaults) => {
			const string = Env(env);
			if (["Debug", "Info", "Warn", "Error"].includes(string)) {
				return string;
			}
			return dafaults;
		},
		value: "Debug",
	},
	{
		key: "loggings:limit",
		env: "CORE_LOGGINGS_LIMIT",
		type: Configuration.SetTypes.Number,
		internal: true,
		description: "Auto Delete de logs do painel, use numero.",
		value: 10,
	},
	{
		key: "loggings:delete",
		env: "CORE_LOGGINGS_DELETE",
		type: Configuration.SetTypes.Boolean,
		internal: true,
		checker: (env, dafaults) => {
			const string = Env(env);
			if (string == "true" || string == "false") {
				return Boolean(string);
			}
			return dafaults;
		},
		description: "Ativa ou Desativa o sistema de auto-deletar logs do painel.",
		value: true,
	},
] as const);
