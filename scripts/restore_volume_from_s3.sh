#!/bin/bash

# Download a previous backup archive from S3.
# It will not overwrite any existing data: it just downloads into the root (~/) folder.
# You must then manually extract and apply the saved data to the MongoDB volume
# (see directions below).

# Change to working directory of file not link
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
cd "$SCRIPT_DIR"

# If .env file is missing, then exit
if [ ! -f "../.env" ]; then
    echo "Error: Missing .env file"
    echo "Ensure this script is located in the scripts/ folder of the project."
    exit 1
fi

# Needed from .env
# S3_BUCKET_NAME
source "$SCRIPT_DIR/../.env"

DB_NAME=haiti

# Ask which folder
echo "Choose which backup type (folder) you want to restore from."
echo "(ignore the PRE)"
aws s3 ls "s3://$S3_BUCKET_NAME/"
read -p "Enter folder name (like 'hourly'): " FOLDER

# Get the list of available backups from the S3 bucket
backups=$(aws s3 ls "s3://$S3_BUCKET_NAME/$FOLDER/")

if [ -z "$backups" ]; then
    echo "No backups found"
    exit 1
fi

echo "Available backups:"
echo "$backups"
read -p "Enter the name of the backup you want to restore: " selected_backup

aws s3 cp "s3://$S3_BUCKET_NAME/$FOLDER/$selected_backup" ~/

# Show directions for what to do next
echo "Backup tar file successfully downloaded to: ~/$selected_backup"
echo
echo "# To restore data to active system:"
echo "# 1. Extract downloaded file"
echo "       mkdir ~/restore/; cd ~/restore/"
echo "       tar -xzvf ~/$selected_backup"
echo "# 2. Stop running containers; but re-run mongodb in background:"
echo "       cd ~/haiti"
echo "       source ./scripts/set-image-tag.sh"
echo "       docker compose -f docker-compose.yml -f docker-compose.deploy.yml down"
echo "       docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d mongodb"
echo "# 3. Save a copy of the current docker volume just in case (ONE OF THESE):"
echo "#    If using block storage, then:"
echo "#      cp -r /mnt/blockstorage/165536.165536/volumes/*_hhahaiti_mongodb_data/ ~/deleteme_haiti_mongodb_volume_copy"
echo "#    Otherwise:"
echo "#      cp -r /var/lib/docker/165536.165536/volumes/*_hhahaiti_mongodb_data/ ~/deleteme_haiti_mongodb_volume_copy"
echo "# 4. Restore the BSON file to the MongoDB volume:"
echo "        docker cp ~/restore/haiti_db_backup_*.bson hhahaiti_mongodb:/restore.bson"
echo "        docker exec hhahaiti_mongodb mongorestore --drop --archive=/restore.bson"
echo "# 5. Restart all the containers:"
echo "        docker compose -f docker-compose.yml -f docker-compose.deploy.yml down"
echo "        docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d"

# TODO: This is for python django, not sure if our tech stack need something like this or not
# echo "# 6. Copy /uploads/ directory from extracted backup to the haiti_django container (may report 0B copied):"
# echo "        docker cp - haiti_django:/  <  ~/restore/uploads.tar"
# echo "# 7. Run data migration:"
# echo "        docker exec haiti_django python manage.py migrate"

echo "#"
echo "# Later, after the server is working for a while, cleanup:"
echo "#       rm -rf ~/deleteme_haiti_mongodb_volume_copy"
