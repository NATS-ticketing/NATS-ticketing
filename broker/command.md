Just note in case our nats broken

Upload image to GCP
```sh
// docker tag SOURCE-IMAGE LOCATION-docker.pkg.dev/PROJECT-ID/REPOSITORY/IMAGE:TAG
docker buildx build -t="asia-east1-docker.pkg.dev/promising-silo-426208-n7/nat-ws/nats-image" --push --platform=linux/amd64 .
```