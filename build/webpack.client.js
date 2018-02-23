const path = require('path');
const projectRoot = path.resolve(__dirname, '..');

module.exports = {
    entry: path.join(projectRoot, 'src/client.js'),
    output: {
        path: path.join(projectRoot, 'dist'),
        filename: 'bundle.client.js'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: projectRoot,
                exclude: /node_modules/,
            }
        ]
    }
}