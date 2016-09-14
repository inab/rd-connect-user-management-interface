var dest = './build',
    src = './src';
var destCSS = dest + '/css';

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
		src: ['assets/*.css','node_modules/bootstrap/dist/css/bootstrap.min.css'],
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
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
            entries: src + '/app/app.jsx',
            dest: dest,
            outputName: 'app.js'
        },
        {
            entries: src + '/app/beforeBody.js',
            dest: dest,
            outputName: 'beforeBody.js'
        }
        ]
    }
};

