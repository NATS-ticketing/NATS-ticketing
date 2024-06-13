# Timeout issue note


## Test report

#### 0. Init state
沒測


### + `minPoolSize: 10`

```sh
checks................: 95%  (✓ 95 ✗ 5)
data_received.........: 199595 B
data_sent.............: 0 B
iteration_duration....: avg=3.33s min=1.83s med=3.47s max=4.30s p(90)=3.98s p(95)=4.09s
iterations............: 100
vus...................: 100
vu_messages...........: 1
```

### + Reduce query data from mongo in stateServie:
```sh
checks................: 94%  (✓ 94 ✗ 6)
data_received.........: 197494 B
data_sent.............: 0 B
iteration_duration....: avg=0.75s min=0.36s med=0.77s max=1.07s p(90)=0.93s p(95)=0.95s
iterations............: 100
vus...................: 100
vu_messages...........: 1
```

