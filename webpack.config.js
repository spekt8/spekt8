const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    },
                ]
            },
            // { 
            //     test: /\.(png|jpg)$/,
            //     use: {
            //         loader: "url-loader?limit=8192" 
            //     }
            // },
            { 
                test: /\.(jpg|png|ttf|eot|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './images/[path][name]-[hash:8].[ext]'
                        },
                    },
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true
    }
}