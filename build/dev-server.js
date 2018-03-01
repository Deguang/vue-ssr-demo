const path = require('path');
const http = require('http');
const MFS = require('memory-fs');
const webpack = require('webpack');
const projectRoot = path.resolve(__dirname, '..');
const serverConfig = require('./webpack.server')


// // force page reload when html-wepack-plugin template changes
// clientCompiler.plugin('compilation', function(compilation) {
//     compilation('html-webpack-plugin-after-emit', function(data, cb) {
//         hotMiddleware.publish({ action: 'reload' });
//         cb();
//     })
// })

// // handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')({
//     index: '/index.html',
//     rewrites: [
//       { from: /^\/*\/.*$/, to: '/index.html'},
//     ]
//   }))




// devMiddleware.waitUntilValid(function() {
//     console.log(`> Listening at http://localhost:${PORT}\n`);
// })

module.exports = (app, onUpdate) => {
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
    };

    const clientCompiler = webpack(webpackDevConfig);
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
        publicPath: '/',
        quiet: true
    });
    const hotMiddleware = require('webpack-hot-middleware')(clientCompiler, {
        log: log => {console.log(log)}
    });

    app.use(devMiddleware);
    app.use(hotMiddleware);

    const serverCompiler = webpack(serverConfig)
    const mfs = new MFS();
    const outpuPath = path.join(serverConfig.output.path, serverConfig.output.filename);
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err;
        stats = stats.toJson();
        stats.errors.forEach(err => console.error(err));
        stats.warnings.forEach(err => console.warn(err));
        onUpdate(mfs.readFileSync(outpuPath, 'utf-8'));
    });
}