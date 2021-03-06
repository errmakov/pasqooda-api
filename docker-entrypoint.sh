#!/bin/sh

# Work directory
dir="/apps/pasqooda-api"

cd ${dir} && npm install pm2 -g

# Install app dependencies
cd ${dir} && npm install
echo "Hello from entrypoint"
echo $NODE_ENV
# Run application
cd ${dir} && NODE_ENV=$NODE_ENV  pm2 start app/app.js --name pasqooda-api --watch --ignore-watch="node_modules app/userfiles/* logs/*" --no-daemon -o logs/pasqooda-api.out.log -e logs/pasqooda-api.err.log
