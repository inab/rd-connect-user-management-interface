var Vinyl = require('vinyl'),
    fs = require('fs'),
    packageJSON = JSON.parse(fs.readFileSync('./package.json')),
    git = require('git-rev-sync');

module.exports = function(opts) {
    opts                 = opts || {};
    opts.filename		= opts.filename || buildinfo.json;
    opts.tag             = opts.tag || 'head';
    opts.version         = !!opts.version || true;
    opts.commit          = !!opts.commit;
    opts.branch          = !!opts.branch;
    opts.utcdate         = !!opts.utcdate;
    opts.buildms         = !!opts.buildms;
    opts.meta            = !!opts.meta;
    // opts.indent can be 0, so check for undefined instead of presence
    opts.indent          = undefined != opts.indent ? opts.indent : 4;

	var buildInfoString = '',
		version = packageJSON.version,
		commit = git.long(),
		branch = git.branch(),
		utcdate = new Date().toUTCString(),
		buildms = new Date().getTime(),
		indentString = new Array(opts.indent + 1).join(' '),
		content,
		generateString = function generateString(name, value) {
			var content = indentString;
			if (opts.meta) {
				content += '<meta name="' + name + '" content="' + value + '">';
			} else {
				content += '<!-- ' + name + ': ' + value + ' -->';
			}
			content += '\n';
			return content;
		};

	var buildInfo = {
		version: version,
		commit: commit,
		branch: branch,
		utcdate: utcdate,
		buildms: buildms
	};

	//// Populate the content string
	//buildInfoString += '<' + opts.tag + '>\n';
	//
	//if (opts.version) {
	//    buildInfoString += generateString('version', version);
	//}
	//if (opts.commit) {
	//    buildInfoString += generateString('commit', commit);
	//}
	//if (opts.branch) {
	//    buildInfoString += generateString('branch', branch);
	//}
	//if (opts.utcdate) {
	//    buildInfoString += generateString('utcdate', utcdate);
	//}
	//if (opts.buildms) {
	//    buildInfoString += generateString('buildms', buildms);
	//}


	//// Get the file content
	//content = file.contents.toString();
	//
	//// Replace the content with the augmented markup
	//content = content.replace('<' + opts.tag + '>', buildInfoString);
	//
	//// Reassign the buffer
	//file.contents = new Buffer(content);

	var src = require('stream').Readable({ objectMode: true })
	src._read = function () {
		this.push(new Vinyl({
			cwd: "",
			base: null,
			path: opts.filename,
			contents: new Buffer(JSON.stringify(buildInfo))
		}));
		this.push(null);
	};

	// Notify Gulp that we are done
	return src;
};
