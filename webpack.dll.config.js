const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        /*
         指定需要打包的js模块
         或是css/less/图片/字体文件等资源，但注意要在module参数配置好相应的loader
         */
        bundle: [
            'bootstrap-loader',
            //其他库
        ],
    },
    output: {
        path: __dirname + '/app/libs',
        filename: '[name].js',
        library: '[name]_library'
    },
    module: {
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
        new webpack.DllPlugin({
            path: __dirname + '/app/libs/bundle.manifest.json',
            name: '[name]_library',
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new ExtractTextPlugin('[name].css'), // 打包css/less的时候会用到ExtractTextPlugin

    ]
};