#!/bin/bash

# Download a previous backup archive from S3.
# It will not overwrite any existing data: it just downloads into the root (~/) folder.
# You must then manually extract and apply the saved data to the MongoDB volume
# (see directions below).

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo -e "${BLUE}Available backups:${NC}"
# Print a numbered list of backups
backup_count=1
while IFS= read -r line; do
    # Split the line into fields
    datetime=$(echo $line | cut -d' ' -f1-3)
    size=$(echo $line | cut -d' ' -f4)
    backup_name=$(echo $line | cut -d' ' -f5-)
    printf "${GREEN}%d.${NC} %-19s %-5s %s\n" "$backup_count" "$datetime" "$size" "$backup_name"
    ((backup_count++))
done <<< "$backups"

# Prompt the user to select a backup by number
read -p "Enter the number of the backup you want to restore: " selected_backup_number

# Validate the user input
if ! [[ "$selected_backup_number" =~ ^[0-9]+$ ]]; then
    echo "Error: Please enter a valid number."
    exit 1
fi

# Extract the selected backup name based on the user's input
selected_backup=$(echo "$backups" | sed -n "${selected_backup_number}p" | awk '{print $NF}')

# Check if the selected backup exists
if [ -z "$selected_backup" ]; then
    echo "Error: Invalid backup number."
    exit 1
fi

# echo "Available backups:"
# echo "$backups"
# read -p "Enter the name of the backup you want to restore: " selected_backup

# echo -e "${BLUE}Available backups:${NC}"
# printf "${GREEN}%-19s %-5s %s${NC}\n" "Date and Time" "Size" "Backup Name"
# while IFS= read -r line; do
#     # Split the line into fields
#     datetime=$(echo $line | cut -d' ' -f1-3)
#     size=$(echo $line | cut -d' ' -f4)
#     backup_name=$(echo $line | cut -d' ' -f5-)
#     printf "%-19s %-5s %s\n" "$datetime" "$size" "$backup_name"
# done <<< "$backups"
# read -p "Enter the name of the backup you want to restore: " selected_backup

aws s3 cp "s3://$S3_BUCKET_NAME/$FOLDER/$selected_backup" ~/

# Show directions for what to do next
echo -e "${GREEN}Backup tar file successfully downloaded to: ~/$selected_backup${NC}"
echo
echo -e "${BLUE}To restore data to active system:${NC}"
echo -e "${RED}1. Extract downloaded file${NC}"
echo "   mkdir ~/restore/; cd ~/restore/"
echo "   tar -xzvf ~/$selected_backup"
echo
echo -e "${RED}2. Stop running containers; but re-run mongodb in background:${NC}"
echo "   cd ~/haiti"
echo "   source ./scripts/set-image-tag.sh"
echo "   docker compose -f docker-compose.yml -f docker-compose.deploy.yml down"
echo "   docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d mongodb"
echo
echo -e "${RED}3. Save a copy of the current docker volume just in case (ONE OF THESE):${NC}"
echo "   If using block storage, then:"
echo "      cp -r /mnt/blockstorage/165536.165536/volumes/*_hhahaiti_mongodb_data/ ~/deleteme_haiti_mongodb_volume_copy"
echo "   Otherwise:"
echo "      cp -r /var/lib/docker/165536.165536/volumes/*_hhahaiti_mongodb_data/ ~/deleteme_haiti_mongodb_volume_copy"
echo
echo -e "${RED}4. Restore the BSON file to the MongoDB volume:${NC}"
echo "   docker cp ~/restore/haiti_db_backup_*.bson hhahaiti_mongodb:/restore.bson"
echo "   docker exec hhahaiti_mongodb mongorestore --drop --archive=/restore.bson"
echo
echo -e "${RED}5. Restart all the containers:${NC}"
echo "   docker compose -f docker-compose.yml -f docker-compose.deploy.yml down"
echo "   docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d"
echo
echo -e "${BLUE}Later, after the server is working for a while, cleanup:${NC}"
echo "   rm -rf ~/deleteme_haiti_mongodb_volume_copy"
