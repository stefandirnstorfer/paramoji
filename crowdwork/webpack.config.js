
const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack')
const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");

module.exports = {
    entry: {
        main: "./src/main.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: '/emoticons',
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.pug$/,
                loader: 'pug-plain-loader'
            },
            {
                test: /\.pug$/,
                oneOf: [
                    // this applies to <template lang="pug"> in Vue components
                    { resourceQuery: /^\?vue/, use: ['vue-indent-pug-loader'] },
                    // this applies to pug imports inside JavaScript
                    { use: ['raw-loader', 'vue-indent-pug-loader'] }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                     'css-loader'
                 ],
             }
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html"),
        }),
        new webpack.DefinePlugin({
             BASE_URL: JSON.stringify(process.env.BASE_URL || "")
        })
    ],
    resolve: {
        alias: {
            vue: "vue/dist/vue.esm-bundler.js"
        },
        extensions: ['.ts', '.js', '.vue', '.json']
    },
    devServer: {
        
    }
};
