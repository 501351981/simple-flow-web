const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'production',
    // entry: ['babel-polyfill','./core/index.js'],
    entry: ['./core/index.js'],
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'sf.js',
        library:{
            name: 'SF',
            type: 'umd',
            export: 'default',
        },
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.less$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'sf.css',
        }),
    ],
    target: ['web', 'es5']
}
