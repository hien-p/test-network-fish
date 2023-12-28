Cái repos này hiện đã được set up cả môi trường nodejs version latest.  
Nên không cần phải remove docker mà bồ chỉ cần 
```
./minifab up
or 
./minifab down 
```


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
