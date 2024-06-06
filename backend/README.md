
## Run

### 1. Add `.env`
```shell
NATS_URL=NATS_URL
MONGO_URL=MONGO_URL
```
### 2. Run using docker-compose

```sh
# 啟動 6 個 server (6 為預設數量)
docker-compose up -d --build
```


如果需要指定 server 數量，：
```sh
# 啟動 1 個 server
REPLICAS=1 docker-compose up -d --build
```

- `compose.yml` 的 `replicas` 定義了有幾個 instance


---

## Test

```sh
cd test
docker-compose up -d --build # 啟動測試環境
npm test # 執行測試
```
