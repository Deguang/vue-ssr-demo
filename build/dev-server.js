const express = reqire('express');
const path = require('path');
const http = require('http');
global.NODE_ENV = process.env.NODE_ENV || 'production'

const PORT = 8080;
const isDev = NODE_ENV === 'development';
const app = express();

const webpackDevConfig = {}