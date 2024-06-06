## ENV

`.env`: 

```shell
NATS_URL=NATS_URL
MONGO_URL=MONGO_URL
```

## Run

### Simple run (single instance)
```sh
npm start
```

### Run using docker-compose (support mutiple instances)
- `compose.yml` 的 `replicas` 定義了有幾個 instance，預設是 6

```sh
# 啟動 1 個 server
REPLICAS=1 docker-compose up -d --build
# 啟動 6 個 server (預設數量)
docker-compose up -d --build
```


---

## Test

```sh
cd test
docker-compose up -d --build # 啟動測試環境
npm test # 執行測試
```
