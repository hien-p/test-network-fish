#!/bin/sh
# scripts to start the node application against the network
cd /go/src/github.com/app
if [ -f 'package.json' ] && [ ! -d 'node_modules' ]; then
    yarn install
fi

cp /vars/profiles/testchannel_connection_for_nodesdk.json connection.json
node main.js