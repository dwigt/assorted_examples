var gulpconfig = function() {


    /**
     * Tasks
     * These tasks define Bundles for Javascript- and SASS to be (concatinated, minified and/or compiled)
     * and then injected into Views or frontend HTML-files. (A target must be defined even if it's an empty string).
     **/
    var javascriptConf = {
        distFolder: "dist/js/",
        bundles: [
            {
                es6bundle: true,
                name: 'bundle',
                paths: ['./node_modules','./src/app'],
                dist: 'dist/js/',
                presets: ["es2015"],
                transformplugins: ['transform-runtime', 'transform-async-to-generator', "transform-object-rest-spread"],
                files: [
                    'src/app/index.js'
                ],
                targets: ['dist/*.html','dist/styleguide/*.html']
            },
            {
                noHash:false,
                name: 'scripts',
                dist: 'dist/js/',
                files: [
                    'src/js/scripts.js',
                    'src/js/partials/*.js',
                    'src/js/scripts.init.js'
                ],
                targets: ['dist/*.html', 'dist/styleguide/*.html']
            },
            {
                name: 'vendor',
                dist: 'dist/js/',
                files: [
                    'src/js/vendor/jquery-2.1.3.js',
                    'src/js/vendor/*.js',
                    'src/js/plugins/*.js'
                ],
                targets: ['dist/*.html', 'dist/styleguide/*.html']
            },
            {
                noHash: true,
                name: 'stg-scripts',
                dist: 'dist/styleguide/_core/js/',
                files: [
                    'src/styleguide/_core/js/*.js',
                ]
            }
        ]
    };

    var cssConf =  {
        distFolder: "dist/css/",
        bundles: [
            {
                name: 'main',
                dist: 'dist/css/',
                files: [
                    'src/sass/style.scss'
                ],
                targets: ['dist/**/*.html']
            },
            {
                noHash: true,
                name: 'stg-styles',
                dist: 'dist/styleguide/_core/css/',
                files: [
                    'src/styleguide/_core/css/styleguide.scss'
                ],
                targets: ['dist/styleguide/*.html']
            }

        ]
    };

    /**
     * Frontend Settings
     **/

    var frontendSettings = {

        src: "src/",
        dist: "dist/",
        /*
         *  These settings handles the Assets folder source and destination.
         */
        assetsSrc : "src/assets/",
        assetsDist: "dist/assets/",

        /*
         *   injectToDistPath should be false when working in Visual Studio environment
         *   false: will inject with  "/dist/**.*"   (linking from root into the dist folder)
         *   true: will inject with  "**.*"          (linking relative from the dist folder as root for frontend stand-alone projects)
         */
        injectToDistPath: true,
        injectIgnorePath: '',//'dist',
        /*
         Define supported browser to autoprefix css
         */
        autoprefixer: [
            'ie >= 9',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
        ],

        /*
         BrowserSync will host a server that will auto-update when changes in frontend files are detected (html, css/scss, js).
         As default it will serve the "dist" folder to localhost:3000
         It can also proxy a solution from IIS by replacing "server" with "proxy" and a URL
         More info here: http://www.browsersync.io/docs/options/
         */
        browserSyncFiles: [
            './dist/**/*.html',
            './dist/**/*.css',
            './dist/**/*.js',
            '!node_modules'
        ],
        browserSyncSettings: {
            //proxy: 'http://someproject.local',
            server: {
                baseDir: './dist'
            },
            reloadDelay: 500,
            ghostMode: false
        },


        /*
         Iconfont
         The icon-font task will create a web font, based on the svg-files placed in the src icon folder.
         It will update the icons.scss file (from the template file) and create a reference for each icon in the file,
         using the same name as the svg.
         More info here: https://www.npmjs.com/package/gulp-iconfont

         */
        iconFontSrcIcons: 'src/iconfont/icons', //directory where the svg icons are collected.
        iconFontDest: 'src/assets/fonts/', //directory where the font-files will be placed when generated.
        iconFontName: 'iconfont', // Name of icon-font both file and sass name
        iconFontTemplate: 'src/iconfont/template/_icons.scss', //the .scss files
        iconFontTemplatePaths: '../assets/fonts/',

        /* image optimizer
         Image optimizer is an simple image minifier for PNG, JPEG, GIF and SVG images.
         Note that the original images are kept at the src directory, and the optimized ones are moved.
         More info here: https://www.npmjs.com/package/gulp-imagemin
         */
        gfxDir: 'src/assets/gfx', // directory where the graphics/images are collected
        gfxDest: 'dist/assets/gfx' // directory where the graphics/images will be placed
    };

    return {
        javascriptConf: javascriptConf,
        cssConf: cssConf,
        frontendSettings: frontendSettings
    }
}();

module.exports = gulpconfig;
