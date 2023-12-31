#!/bin/bash
# Script to query blocks
cp $FABRIC_CFG_PATH/core.yaml /vars/core.yaml
cd /vars
export FABRIC_CFG_PATH=/vars

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=10.0.5.2:7002
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/supplier.fish.com/peers/peer1.supplier.fish.com/tls/ca.crt
export CORE_PEER_LOCALMSPID=supplier-fish-com
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/supplier.fish.com/users/Admin@supplier.fish.com/msp
export ORDERER_ADDRESS=10.0.5.2:7006
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/example.com/orderers/orderer1.example.com/tls/ca.crt
output=$(peer channel getinfo -o $ORDERER_ADDRESS --tls --cafile $ORDERER_TLS_CA -c testchannel)
CBHASH=$(echo ${output:17}|jq '.currentBlockHash'|xargs)
peer channel fetch newest -o $ORDERER_ADDRESS --tls \
  --cafile $ORDERER_TLS_CA -c testchannel

configtxlator proto_decode --input testchannel_newest.block \
  --type common.Block | jq --arg CBHASH $CBHASH -f run/blockquery.jq \
  > testchannel_newest_txs.json
