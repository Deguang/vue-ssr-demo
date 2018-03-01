const fs = require('fs');
const path = require('path');
const express = require('express');
const isProd = process.env.NODE_ENV === 'production';

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer;

const app = express();

// server-side bundle file
const serverBundleFilePath = path.join(__dirname, './dist/bundle.server.js');
const serverBundleFileCode = fs.readFileSync(serverBundleFilePath, 'utf8');

// client-side bundle file
const clientBundleFilePath = path.join(__dirname, '../dist/bundle.client.js');
const clientBundleFileUrl = './dist/bundle.client.js';

let renderer;
if (isProd) {
    // In production, use server-side bundle file
    renderer = createBundleRenderer(serverBundleFileCode);
} else {
    // Dev mode
    require('./build/dev-server')(app, bundle => {
        renderer = createBundleRenderer(bundle);
    })
}


// server-side rendering
const template = fs.readFileSync(path.join(__dirname, './src/index.ejs'), 'utf8')

app.use('/dist', express.static(path.resolve('./dist')));

app.get('/', function(req, res) {
    if (!renderer) {
        return res.end(`waiting for compilation ... refresh in a moment.`);
    }

    const context = {};

    const renderStream = renderer.renderToStream(context);

    let firstChunk = true;

    res.write(template);

    renderStream.on('data', chunk => {
        if (firstChunk) {
            if (context.intitalState) {
                res.write(
                    `<script>window.__INITIAL_STATE__=${serialize(context.intitalState, {isJSON: true})}</script>`
                )
            }
            firstChunk = false;
        }
        res.write(chunk);
    })

    renderStream.on('end', () => {
        res.end(template)
    })
});

// // client-side rendering
// app.get(clientBundleFileUrl, function(req, res) {
//     const clientBundleFileCode = fs.readFileSync(clientBundleFilePath, 'utf8');
//     res.send(clientBundleFileCode);
// });

// srart server
const PORT = process.env.PORT || 9999;
app.listen(PORT, function() {
    console.log(`Vue SSR Demo listening on port ${PORT}!`)
})