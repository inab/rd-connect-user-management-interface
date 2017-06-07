var dest = './build',
    src = './src';
var srcApp = src + '/app';
var destCSS = dest + '/css';
var destJS = dest + '/js';

module.exports = {
    browserSync: {
        server: {
            baseDir: [dest, src]
        },
        files: [
            dest + '/**'
        ]
    },
    less: {
        src: src + '/less/main.less',
        watch: [
            src + '/less/**'
        ],
        dest: destCSS
    },
    importCSS: {
		src: ['assets/*.css','node_modules/bootstrap/dist/css/bootstrap.min.css*'],
		dest: destCSS
	},
	fonts: {
		src: 'node_modules/bootstrap/dist/fonts/*',
		dest: dest + '/fonts'
	},
    markup: {
        src: src + '/www/**',
        dest: dest
    },
    browserify: {
        // Enable source maps
        debug: true,
        paths: [ './node_modules' , srcApp ],
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
            entries: srcApp + '/app.jsx',
            dest: destJS,
            outputName: 'app.js'
        },
        {
            entries: srcApp + '/beforeBody.js',
            dest: destJS,
            outputName: 'beforeBody.js'
        }
        ]
    }
};

