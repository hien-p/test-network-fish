#!/bin/bash
# Script to install chaincode onto a peer node
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=10.0.5.2:7002
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/supplier.fish.com/peers/peer1.supplier.fish.com/tls/ca.crt
export CORE_PEER_LOCALMSPID=supplier-fish-com
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/supplier.fish.com/users/Admin@supplier.fish.com/msp
cd /go/src/github.com/chaincode/simple


if [ ! -f "simple_node_1.0.tar.gz" ]; then
  peer lifecycle chaincode package simple_node_1.0.tar.gz \
    -p /go/src/github.com/chaincode/simple/node/ \
    --lang node --label simple_1.0
fi

peer lifecycle chaincode install simple_node_1.0.tar.gz
