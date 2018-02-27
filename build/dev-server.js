const path = require('path');
const http = require('http');
const express = require('express');
const webpack = require('webpack');
const projectRoot = path.resolve(__dirname, '..');

global.NODE_ENV = process.env.NODE_ENV || 'production'

const PORT = 8080;
const isDev = NODE_ENV === 'development';
const webpackDevConfig = {
    entry: path.join(projectRoot, 'src/client.js'),
    output: {
        path: path.join(projectRoot, 'dist'),
        filename: '[name].js'
    },
    devtool: '#cheap-module-eval-source-map',
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                loader: 'style-loader|css-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: projectRoot,
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
}

const app = express();
const compiler = webpack(webpackDevConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    quiet: true
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: log => {console.log(log)}
});

// force page reload when html-wepack-plugin template changes
compiler.plugin('compilation', function(compilation) {
    compilation('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb();
    })
})


app.use(devMiddleware);
app.use(hotMiddleware);

devMiddleware.waitUntilValid(function() {
    console.log(`> Listening at http://localhost:${PORT}\n`);
})

app.listen(PORT, function(err){
    if(err) {
        console.log(err);
        return;
    }
})