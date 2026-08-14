const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
	fs.readdirSync(dir).forEach((f) => {
		let dirPath = path.join(dir, f);
		let isDirectory = fs.statSync(dirPath).isDirectory();
		isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
	});
}

const targetFiles = [];

walkDir(path.join(__dirname, "src"), function (filePath) {
	if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
		targetFiles.push(filePath);
	}
});

targetFiles.forEach((file) => {
	let content = fs.readFileSync(file, "utf8");
	let newContent = content.replace(
		/import\s+{\s*Birthday\s*}\s+from\s+["']@\/types\/birthday["']/g,
		'import type { Birthday } from "@/types/birthday"',
	);
	if (content !== newContent) {
		fs.writeFileSync(file, newContent, "utf8");
		console.log(`Updated ${file}`);
	}
});
