/**
 * Created by Cassie.Xu on 17/5/2.
 */
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const pathResolve = (p) => path.resolve(__dirname, p);
const HTMLEntries = getEntries('./app/js/*.js');

// 根据指定的路径glob，生成入口文件对象
function getEntries(pathGlob) {
    const files = glob.sync(pathGlob);
    const htmls = glob.sync('./app/html/*.html');
    return files.reduce((acc, file) => {
        const extname = path.extname(file);
        const basename = path.basename(file, extname);
        if(htmls.find(function (each) {
           return path.basename(each, path.extname(each)) == basename;
        })){
            acc[basename] = `${file}`;
        }
        return acc;
    }, {});
}
console.log('entries', HTMLEntries);

let cleanOptions = {
    exclude:  ['shared.js'],
    verbose:  true,
    dry:      false
}

module.exports = {
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
    entry: HTMLEntries,
    output: {
        path: __dirname + "/build",//打包后的文件存放的地方
        filename: "[name]-[hash].js"//打包后输出文件的文件名
    },
    module: {//在配置文件里添加JSON loader
        loaders: [
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',//在webpack的module部分的loaders里进行配置即可
            },
            {
                test: require.resolve('jquery'),  // 此loader配置项的目标是NPM中的jquery
                loader: 'expose?$!expose?jQuery', // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`
            }
        ],
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                // inline base64url for <=1500 images
                loader: 'url-loader?limit=1500&name=images/[name].[hash].[ext]',
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader?modules","postcss-loader"]
                })
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        // 根据入口文件对象，生成对HTMLWebpackPlugin插件的调用
        ...Object.keys(HTMLEntries).map((entry) => new HTMLWebpackPlugin({
            filename: `${entry}.html`,
            template: `./app/html/${entry}.html`,
            inject: true,
            chunks: [entry]
        })),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [
                    autoprefixer
                ]
            }
        }),
        new ExtractTextPlugin("[name]-[hash].css"),
        // new UglifyJSPlugin({
        //     mangle: {
        //         except: ['$','jQuery']
        //     },
        //     compress: {
        //         warnings: false
        //     }
        // }), //压缩js代码
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new webpack.DllReferencePlugin({
            context: '__dirname',
            manifest: require("./app/libs/bundle.manifest.json"),
        }),
    ],
    devServer: {
        port: 8081,
        contentBase: "./build",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    }
}