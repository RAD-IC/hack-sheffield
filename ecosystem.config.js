module.exports = {
    apps: [{
        name: 'hack-sheffield',
        script: './server.js',
    }],
    deploy: {
        production: {
            'user': 'ubuntu',
            'host': 'spina.me',
            'ref': 'origin/master',
            'repo': 'https://github.com/RAD-IC/hack-sheffield',
            'path': '/home/ubuntu/hack-sheffield',
            'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js',
        },
    },
};