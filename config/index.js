// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: {
            NODE_ENV: '"production"'
        },
        index: path.resolve(__dirname, '../dist/index.html'),
        pay: path.resolve(__dirname, '../dist/pay.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: true,

        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        // host: '192.168.1.72',
        env: {
            NODE_ENV: '"development"'
        },
        port: 8081,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        context: [ //代理路径
            '/coursecart'
        ],
        // proxypath: 'http://api.tifangedu.com',
        proxypath: 'http://dev.api.tifangedu.com',
        
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}