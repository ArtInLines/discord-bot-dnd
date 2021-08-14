const fs = require('fs');
const path = require('path');

function getModulesFromDir({ dirPath, cb = null, spreadArr = true, ext = '.js', returnFileList = false }) {
	const arr = [];
	fs.readdirSync(dirPath).forEach((fname) => {
		if (fname.endsWith(ext)) {
			const file = require(path.resolve(dirPath, fname));
			if (spreadArr) {
				if (typeof cb === 'function') file.forEach((f) => cb(f));
				if (returnFileList) arr.push(...file);
			} else {
				if (typeof cb === 'function') cb(file);
				if (returnFileList) arr.push(file);
			}
		}
	});
	return arr;
}
module.exports.getModulesFromDir = getModulesFromDir;
