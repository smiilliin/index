# Index

This is the index page of the web

# Usage

Docker compose

```yaml
index:
  image: smiilliin/index
  container_name: index
  build:
    context: ./index
    target: production
  expose:
    - "3000"
  networks:
    - front
```
