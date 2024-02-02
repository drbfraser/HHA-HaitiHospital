# Scripts for Deployment

## Initial Deployment

- Create a new Virtual Private Server (VPS) on a hosting service.

  - Supported OS: Ubuntu 22.04
  - Mount block storage to the VPS under `/mnt/blockstorage/`

- On a fresh Ubuntu 22.04 server, log in as `root` and create the file `/root/setup_production.sh`
  and copy into it the contents of the `setup_production.sh` file from this repo. Suggested
  command:  
  `nano /root/setup_production.sh`
- Run the script  
  `cd /root/`  
  `chmod +x ./setup_production.sh`  
  `./setup_production.sh`
  - Tell the script the URL for this server (press ENTER if just using locally)
  - ~~Script will randomly create some passwords.~~ (Unsure in Haiti porject)
  - Script will allow you to edit the `.env` file to configure server.
  - Script will link the `update.sh` script into the `/root/` folder for future updates.
- Validation
  - Use `localhost` as URL in browser to check if the website is on or not.

## Update Server to New Version

To update a running server, log in via SSH as `root` and execute the `/root/update.sh` script.

## Release Process

To release code to the staging server, or mark ready for production, do the following:

1. Delete the protected branch you would like the code to appear on (either `staging` or
   `production`)

   - In GitHub, goto Branches (`/branches`)
   - Ensure the branch you are going to delete is not ahead of `main`. If it is, it means there are
     commits to this branch which have not been merged to `main` and should be considered before
     proceeding.
   - Click the delete button beside the branch and complete the confirmation screen

2. Re-create the protected branch you just deleted
   - In GitHub, goto Branches (`/branches`)
   - Click "New Branch" button
   - Enter name and source branch for recreated branch:
     - If `staging`, set the branch source to `main`
     - If `production`, set the branch source to `staging`
   - When the branch is recreated, GitHub will remember its protected status from before.

This will put the current version of the code from the source branch into the protected `staging` or
`production` branch without creating a new commit. This is important because the deployment process
depends on a docker image for a commit being built just once (when merged to `main`). And commits to
either the `staging` or `production` branches will break the deployment process.

## Debug

You may need to remove the local repo and re-run the script to debug.

```bash
$ rm -rf haiti
$ ./setup_production.sh
```

## Tags on Docker Hub

Development, staging, and deployment servers will run docker images pulled from Docker Hub. Images
are tagged as follows:

- Each build on `main` is tagged with something like `v2022-05-22.acbd1234`
- The build of the latest code on `main` is additionally tagged with `:dev`
- The build of the latest code on `staging` is additionally tagged with `:staging`
- The build of the latest code on `production` is additionally tagged with `:prod`

Check docker container status:

```bash
$ docker ps
```

or

```bash
$ docker ps -a
```

### Docker Hub Tag Details

When code is merged to the `main` branch, the CI/CD pipeline automatically builds each part of the
application and then generates the frontend (and caddy reverse-proxy) docker image, and the backend
docker image. These are tagged with both the commit date/SHA (such as `v2022-12-31.abcd5678`), plus
the tag `dev` and pushed to Docker Hub. An image is then deployed to the dev-server for testing.

When code makes it to the `staging` branch, its docker image (previously built when that commit was
merged to `main`) is given an additional tag on Docker Hub of `staging`. This tag is applied to the
most recent docker image that has been put onto the `staging` branch. Plus, the staging deployment
server updates to this new version for testing.

When code makes it to the `production` branch, its docker image (previously built when merged to
`main`) is given an additional tag on Docker Hub of `prod`. This tag is applied to the most recent
docker image that has been put onto the `production` branch. The administrator of the production
server must then run the `/root/update.sh` script to update to the latest version on the
`production` branch. Note that this update script actually pulls a specific version of the Docker
image from Docker Hub, instead of using the `prod` tag. It knows which specific version to pull
based on the latest commit in the `production` branch of the code which has been cloned onto the
production server, likely through GitHub.

Note that the code in GitHub.sfu.ca (private repo) is continually mirrored to the publicly
accessible GitHub repo.
