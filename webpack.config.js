var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
const extractLESS = new ExtractTextPlugin('style.css');
var autoprefixer = require('autoprefixer');
module.exports = {
    "resolve": {
        "extensions": [
            ".ts",
            ".js",
            ".vue"
        ],
        "modules": [
            "./node_modules"
        ],
        "symlinks": true
    },
    entry: {
        index: './src/index.js',
        vendor: ['babel-polyfill']
    },
    output: {
        filename: '[name].js',
        publicPath: '/js/',
        path: path.resolve(__dirname, 'dist/js/')
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        less: extractLESS.extract(['style-loader', {
                            loader: 'css-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        }, 'less-loader', {
                            loader: 'postcss-loader',
                            options: {
                                postcss: (loader) => [
                                    require('postcss-import')({
                                        root: loader.resourcePath
                                    }),
                                    require('autoprefixer')({
                                        browsers: ['last 2 versions']
                                    }),
                                ]
                            }
                        }])
                    }
                    // other vue-loader options go here
                }
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            }, {
                test: /\.js/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
                query: {
                    presets: ['es2015', 'stage-3']
                }
            },
            {
                test: /\.less$/,
                use: extractLESS.extract([{
                    loader: 'css-loader',
                    options: {
                        minimize: true //css压缩
                    }
                }, 'less-loader', {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: (loader) => [
                            require('postcss-import')({
                                root: loader.resourcePath
                            }),
                            require('autoprefixer')({
                                browsers: ['last 2 versions']
                            }),
                        ]
                    }
                }])
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                query: {
                    // 把较小的图片转换成base64的字符串内嵌在生成的js文件里
                    limit: 10000,
                    // 路径要与当前配置文件下的publicPath相结合
                    name: 'fonts/[name].[ext]?[hash:7]'
                }
            },
            {
                test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                loader: 'url-loader',
                options: {
                    // 把较小的图标转换成base64的字符串内嵌在生成的js文件里
                    limit: 10000,
                    name: 'fonts/[name].[ext]?[hash:7]',
                    prefix: 'font'
                }
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        extractLESS,

    ]
}
