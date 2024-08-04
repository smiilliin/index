# Index - changed to react

This is the index page of the web

# Usage

Docker compose

```yaml
index:
  container_name: index
  build:
    context: ../index
    target: [production/development]
  environment:
    - WATCHPACK_POLLING=true
    - WDS_SOCKET_PORT=0
    - REACT_APP_URL=
  expose:
    - "3000"
  volumes:
    - ../index:/app
  networks:
    - front
```
