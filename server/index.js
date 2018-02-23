const fs = require('fs');
const path = require('path');
const express = require('express');
const vueServerRenderer = require('vue-server-renderer');

const app = express();

// server-side bundle file
const serverBundleFilePath = path.join(__dirname, '../dist/bundle.server.js');
const serverBundleFileCode = fs.readFileSync(serverBundleFilePath, 'utf8');
const bundleRenderer = vueServerRenderer.createBundleRenderer(serverBundleFileCode);

// client-side bundle file
const clientBundleFilePath = path.join(__dirname, '../dist/bundle.client.js');
const clientBundleFileUrl = '/bundle.client.js';


// server-side rendering
app.get('/', function(req, res) {
    bundleRenderer.renderToString((err, html) => {
        if(err){
            res.status(500).send(`
                <p>Error: ${err.message}</p>
                <pre>${err.stack}</pre>
            `)
        } else {
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Vue SSR Demo</title>
                </head>
                <body>
                    ${html}
                    <script src="${clientBundleFileUrl}"></script>
                </body>
                </html>
            `)
        }
    });
});

// client-side rendering
app.get(clientBundleFileUrl, function(req, res) {
    const clientBundleFileCode = fs.readFileSync(clientBundleFilePath, 'utf8');
    res.send(clientBundleFileCode);
});

// srart server
const PORT = process.env.PORT || 9999;
app.listen(PORT, function() {
    console.log(`Vue SSR Demo listening on port ${PORT}!`)
})