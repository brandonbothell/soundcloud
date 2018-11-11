"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const url_1 = require("url");
exports.request = {
    api: (subUrl, params) => {
        const url = 'https://api.soundcloud.com' + (subUrl.startsWith('/') ? subUrl : '/' + subUrl) + parseParams(params);
        return get(url);
    },
    get: (url, params) => {
        return get(url + parseParams(params));
    }
};
function get(url) {
    const options = parseUrlToOptions(url, 'GET');
    return req(options, req => {
        req.on('error', error => {
            throw error;
        });
        req.end();
    });
}
function post(url, data) {
    const options = parseUrlToOptions(url, 'POST');
    return req(options, req => {
        req.on('error', error => {
            throw error;
        });
        req.write(data);
        req.end();
    });
}
function put(url, data) {
    const options = parseUrlToOptions(url, 'PUT');
    return req(options, req => {
        req.on('error', error => {
            throw error;
        });
        req.write(data);
        req.end();
    });
}
function parseUrlToOptions(url, type) {
    const parsed = url_1.parse(url);
    return {
        hostname: parsed.hostname,
        port: parsed.port ? parsed.port : 443,
        path: parsed.path,
        method: type,
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
function req(options, reqFunction) {
    return new Promise((resolve, reject) => {
        const cb = (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                const parsed = JSON.parse(data);
                if (parsed.errors) {
                    return reject(new Error(parsed.errors[0].error_message));
                }
                resolve(parsed);
            });
            res.on('error', error => {
                reject(error);
            });
        };
        reqFunction(https_1.request(options, cb));
    });
}
function parseParams(params) {
    let url = '';
    for (let param in params) {
        url += (!url.includes('?') ? '?' : '&') + param + '=' + encodeURIComponent(params[param]);
    }
    return url;
}
