/**
 * Created by BadWaka on 19/11/2016.
 */
let webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    entry: ['webpack/hot/dev-server', __dirname + '/app/main.js'], //入口文件
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },

    module: {
        loaders: [

            //js jsx loader
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel'
            },

            //sass loader
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },

            //json loader
            {
                test: /\.json$/,
                loader: 'json-loader'
            },

            //url loader
            {
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=8192'
            },

            //file loader
            {
                test: /\.(mp4|ogg|svg)$/,
                loader: 'file-loader'
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()//热模块替换插件
    ],

    //webpack-dev-server
    devServer: {
        contentBase: './build',
        colors: true,
        inline: true,
        port: 8080,
        process: true
    }
};