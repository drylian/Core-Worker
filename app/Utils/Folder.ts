import fs from "fs";
import path from "path";

export function dirCR(folderPath: string) {
	fs.mkdirSync(folderPath, { recursive: true });
}

export function dirEX(folderPath: string) {
	if (fs.existsSync(folderPath)) {
		return true;
	} else {
		return false;
	}
}

interface FileInfo {
    name: string;
    path: string;
    isDirectory: boolean;
    size: number;
    createdAt: Date;
    modifiedAt: Date;
    accessedAt: Date;
}

export function dirSC(folderPath: string): FileInfo[] {
	const scannedFiles: FileInfo[] = [];

	function scanDir(directory: string) {
		const files = fs.readdirSync(directory);

		files.forEach((file) => {
			const filePath = path.join(directory, file);
			const stat = fs.statSync(filePath);

			const fileInfo: FileInfo = {
				name: file,
				path: filePath,
				isDirectory: stat.isDirectory(),
				size: stat.size,
				createdAt: stat.birthtime,
				modifiedAt: stat.mtime,
				accessedAt: stat.atime,
			};

			scannedFiles.push(fileInfo);

			if (stat.isDirectory()) {
				scanDir(filePath);
			}
		});
	}

	scanDir(folderPath);
	return scannedFiles;
}
