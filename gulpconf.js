const CONFIG = {
    global: { minify_style: false, minify_scripts: false, minify_html: false, minify_img: false, sass_autoprefix: true },
    browser: { opts: { server: './dist' } },
    html: {
        src: './src/*.html',
        dest: './dist',
        opts: { minify: { collapseWhitespace: true, removeComments: true, logs: { enabled: false } } },
        replace_args_global: [
            ['/scss/', '/css/']
        ],
        replace_args_style: [
            ['.scss', '.css']
        ],
        replace_args_style_min: [
            ['.scss', '.min.css']
        ],
        replace_args_scripts_min: [
            ['.js', '.min.js']
        ]
    },
    sass: {
        src: './src/resources/scss/**/*.{scss,sass}',
        dest: './dist/resources/css',
        autoprefix_opts: { browsers: ['last 2 versions'], cascade: false },
        opts: {
            minify: { outputStyle: 'compressed' },
            normal: { outputStyle: 'expanded' },
            rename: { suffix: '.min' }
        }
    },
    javascript: {
        src: './src/resources/js/**/*.js',
        dest: './dist/resources/js',
        opts: {
            env: { presets: ['@babel/env'] },
            rename: { suffix: '.min' }
        }
    },
    images: {
        src: './src/resources/img/**/*',
        favicon: './src/*.ico',
        dest: './dist/resources/img',
        opts: {}
    }
}
module.exports = CONFIG