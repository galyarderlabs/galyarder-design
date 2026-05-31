# Docker and Docker Compose

This is the easiest self-hosting path for beginners.

## Before You Start

- Docker Desktop installed and running
- Internet connection (first run downloads the image)

## Step 1: Open the Deploy Folder

```bash
git clone https://github.com/galyarderlabs/galyarder-design.git
cd galyarder-design/deploy
```

What this does:
- Downloads the project
- Moves into the folder that contains `docker-compose.yml`

## Step 2: Start Galyarder Design

```bash
docker-compose up -d
```

What to expect:
- First run can take 1-2 minutes while Docker pulls the image
- You should see container creation and startup messages

## Step 3: Confirm Container Health

```bash
docker-compose ps
```

Success looks like:
- `galyarder-design` container is listed
- `STATUS` shows `Up` and eventually `healthy`
- Port mapping includes `127.0.0.1:7456->7456/tcp`

![Docker Desktop container running](../screenshots/deployment/docker/02-docker-desktop-container-running.png)
![docker-compose ps healthy output (sanitized)](../screenshots/deployment/docker/04-docker-compose-ps-healthy.png)

## Step 4: Verify HTTP Response

```bash
curl -i http://127.0.0.1:7456/
```

Success looks like:
- HTTP status `200 OK`

![curl HTTP 200 output (sanitized)](../screenshots/deployment/docker/05-curl-http-200-proof.png)

## Step 5: Open Galyarder Design in Your Browser

Open:
- `http://localhost:7456/`

You should see the Galyarder Design interface.

![Galyarder Design home (desktop)](../screenshots/deployment/docker/01-galyarder-design-home.png)
![Galyarder Design home (mobile)](../screenshots/deployment/docker/03-galyarder-design-mobile.png)

## Common Issues

- `failed to connect to the docker API`: Docker Desktop is not running yet
- `address already in use`: Port `7456` is occupied by another process
- `curl: (7) Failed to connect`: container is still starting; wait 10-20 seconds and retry
