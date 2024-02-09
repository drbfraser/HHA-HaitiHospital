#!/bin/bash

# Download a previous backup archive from S3.
# It will not overwrite any existing data: it just downloads into the root (~/) folder.
# You must then manually extract and apply the saved data to the Postgres volume
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
# POSTGRES_USER
# S3_BUCKET_NAME
source "$SCRIPT_DIR/../.env"

DB_NAME=cbr

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
echo "# 2. Stop running containers; but re-run postgres in background:"
echo "       cd ~/cbr"
echo "       source ./scripts/set-image-tag.sh"
echo "       docker compose -f docker-compose.yml -f docker-compose.deploy.yml down"
echo "       docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d postgres"
echo "# 3. Save a copy of the current docker volume just in case (ONE OF THESE):"
echo "#    If using block storage, then:"
echo "#      cp -r /mnt/blockstorage/165536.165536/volumes/*_cbr_postgres_data/ ~/deleteme_cbr_postgres_volume_copy"
echo "#    Otherwise:"
echo "#      cp -r /var/lib/docker/165536.165536/volumes/*_cbr_postgres_data/ ~/deleteme_cbr_postgres_volume_copy"
echo "# 4. If DB being restored and current DB have different POSTGRES_USER, then:"
echo "#    Backup POSTGRES_USER: "
echo "        cat ~/restore/backup.env | grep POSTGRES_USER"
echo "#    Current POSTGRES_USER=$POSTGRES_USER"
echo "#       docker exec cbr_postgres    psql -U $POSTGRES_USER template1 -c \"CREATE USER <old-POSTGRES_USER> WITH CREATEDB PASSWORD '<old-POSTGRES_PASSWORD>';\" "
echo "# 5. Wipe the DB and apply the extracted SQL file to the Postgres volume:"
echo "        docker exec cbr_postgres    psql -U $POSTGRES_USER template1 -c 'drop database $DB_NAME;'"
echo "        docker exec cbr_postgres    psql -U $POSTGRES_USER template1 -c 'create database $DB_NAME with owner $POSTGRES_USER;'"
echo "        docker cp ~/restore/cbr_db_backup_*.sql cbr_postgres:/restore.sql"
echo "        docker exec cbr_postgres    psql -U $POSTGRES_USER $DB_NAME -f /restore.sql"
echo "# 6. Restart all the containers:"
echo "        docker compose -f docker-compose.yml -f docker-compose.deploy.yml down"
echo "        docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d"
echo "# 7. Copy /uploads/ directory from extracted backup to the cbr_django container (may report 0B copied):"
echo "        docker cp - cbr_django:/  <  ~/restore/uploads.tar"
echo "# 8. Run data migration:"
echo "        docker exec cbr_django python manage.py migrate"
echo "#"
echo "# Later, after the server is working for a while, cleanup:"
echo "#       rm -rf ~/deleteme_cbr_postgres_volume_copy"
