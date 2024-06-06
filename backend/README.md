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

### Run using docker-compose (mutiple instances)
- `compose.yml` 的 `replicas` 定義了有幾個 instance
```sh
docker-compose up -d --build
```


---

## Test

```sh
cd test
docker-compose up -d --build # 啟動測試環境
npm test # 執行測試
```
