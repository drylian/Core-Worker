import { glob } from "glob";
import path from "path";
import { RootPATH } from "@/Structural";
import { Events } from "@/Classes/Events";

/**
 * Configuration Events for panel
 */
export async function StructuralEvents() {
	const CoreDIR = path.join(RootPATH);
	const paths = await glob(["Events/**/*.{ts,js}"], { cwd: CoreDIR });

	/**
     * Organize Events filter
     */
	const customSort = (a: string, b: string) => {
		const partsA = a.split("/");
		const partsB = b.split("/");

		for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
			if (partsA[i] !== partsB[i]) {
				return partsA[i].localeCompare(partsB[i]);
			}
		}
		return partsA.length - partsB.length;
	};

	const sortedPaths = paths.sort(customSort);

	for (const pather of sortedPaths) {
		await import(`${path.join("..", pather)}`);
	}

	for (const isolated of Events.all) {
		Events.set.on(isolated.name, isolated.run);
	}
}
