Run network
```
./minifab up
or 
./minifab down 
```

Set your permission File
```
sudo chown -R gitpod /workspace/test-network-fish
```

# Mở Blockchain Explorer: 
```
./minifab explorerup 
```

# Chay chaincode 
```
./minifab ccup -n fish -l node -v 2.0 -d false -p ''
```
# Blockquery

```
./minifab blockquery
```
# Chạy app 
```
./minifab apprun
```


# Remove docker and reset network
```
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -a -q)
./minifab cleanup
```
