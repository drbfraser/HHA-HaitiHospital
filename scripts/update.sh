#!/bin/bash
# This script to be run anytime after full setup completed to update to latest version

RED='\033[1;31m'
BLUE='\033[1;36m'
COLOR_OFF='\033[0m'

# exit if there is a failed command
set -e

echo -e "${BLUE}"
echo -e "Hope Health Action - Haiti: Update Script"
echo -e "This script must be run as root or with sudo. It is only supported on Ubuntu Server 22.04."
echo -e "${COLOR_OFF}${RED}"
echo -e "This is not expected to lose any current data or configurations, but a backup is recommended."
echo -e "WARNING: Running this will bring down the server for a few minutes."
read -p "Continue (y/n)? " CONT
echo -e "${COLOR_OFF}"

# When user does not want to continue, exit
if [ "$CONT" != "y" ]; then
    exit 0
fi


echo -e "${BLUE}Updating and upgrading packages...${COLOR_OFF}\n"

apt update -y
apt upgrade -y


echo -e "\n${BLUE}Updating code to latest from GitHub...${COLOR_OFF}\n"

cd ~
if [ ! -d haiti ]; then
    echo -e "${COLOR_OFF}${RED}"
    echo -e "ERROR: Must install using the 'setup_production.sh' script before running this."
    echo -e "${COLOR_OFF}"
    exit 1
fi    
cd ~/haiti/
git pull
# git checkout production
git checkout staging


echo -e "\n${BLUE}Downloading Docker images and spinning up Docker containers...${COLOR_OFF}\n"

# Version of the form v2022-12-31.abcd5678, based on date and short SHA1 of last commit on branch
export COMMIT_SHA=`git show -s --format=%H`
export IMAGE_TAG=v`git show -s --format=%cs $COMMIT_SHA`.`git rev-parse --short=8 $COMMIT_SHA`
echo "Most recent Git commit SHA: $COMMIT_SHA"
echo "Release tag:                $IMAGE_TAG"
docker compose -f docker-compose.yml -f docker-compose.deploy.yml pull
docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d


echo -e "\n${BLUE}Waiting for database to start...${COLOR_OFF}"
sleep 10;


# echo -e "${BLUE}Upgrading database schema...${COLOR_OFF}\n"
# docker exec cbr_django python manage.py migrate

echo -e "\n${BLUE}Finished${COLOR_OFF}\n"