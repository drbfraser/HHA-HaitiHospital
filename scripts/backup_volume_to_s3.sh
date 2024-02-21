#!/bin/bash
# Backup user data from the running docker volumes to Amazon S3
# Includes:
#  - Mongo DB
#  - uploads/ directory (user-uploaded images)
#  - .env file
#  - Info about the system (date/time, host, docker info, etc.)
# 
# Usage (from any directory): 
#   ./backup_volume_to_s3.sh <S3 folder name>
#
# Note: Creates and deletes ~/db-backup-temp/ folder to store the backup files.
# This script expects to be in the scripts/ folder of the project
# in order to find the .env file.

# What S3 folder should be backup to?
S3_FOLDER=$1
if [ -z "$S3_FOLDER" ]
then
    echo "Error: Missing S3 folder name."
    echo "USAGE:"
    echo "    $0 <S3 folder name>"
    exit 1
fi

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

# If .env file is missing, then exit
if [ ! -f "$SCRIPT_DIR/../.env" ]; then
    echo "Error: Missing .env file"
    echo "Ensure this script is located in the scripts/ folder of the project."
    exit 1
fi

# Needed from .env
# S3_BUCKET_NAME
source "$SCRIPT_DIR/../.env"

# Constants
DB_NAME=haiti
ENV_FILE="$SCRIPT_DIR/../.env"
FOLDER="$HOME/db-backup-temp"
BACKUP_FILENAME_BASE="${DB_NAME}_db_backup_$(date +%Y%m%d_%H%M%S)"

echo "Backing-up $DB_NAME database to file $BACKUP_FILENAME_BASE.tar.gz"

mkdir -p $FOLDER

# Create info file
echo "Time: $(date +%Y%m%d_%H%M%S)" >> $FOLDER/info.txt
echo "Host Name: $HOSTNAME"         >> $FOLDER/info.txt
echo ""                             >> $FOLDER/info.txt
echo "docker ps:"                   >> $FOLDER/info.txt
docker ps                           >> $FOLDER/info.txt
echo ""                             >> $FOLDER/info.txt
echo "docker volume ls:"            >> $FOLDER/info.txt
docker volume ls                    >> $FOLDER/info.txt
echo ""                             >> $FOLDER/info.txt
echo "crontab -l:"                  >> $FOLDER/info.txt
crontab -l                          >> $FOLDER/info.txt
echo ""                             >> $FOLDER/info.txt
echo "ip addr:"                     >> $FOLDER/info.txt
ip addr                             >> $FOLDER/info.txt

# Copy .env file
cp $ENV_FILE $FOLDER/backup.env

# Export DB from running MongoDB into BSON file
docker exec hhahaiti_mongodb mongodump --archive > $FOLDER/$BACKUP_FILENAME_BASE.bson

# Compress files (in sub-shell so we don't encode leading folder names)
(cd "$FOLDER"; tar -czvf "$FOLDER/$BACKUP_FILENAME_BASE.tar.gz" *)

# Upload
aws s3 cp "$FOLDER/$BACKUP_FILENAME_BASE.tar.gz" "s3://$S3_BUCKET_NAME/$S3_FOLDER/"

# Cleanup
rm "$FOLDER/info.txt"
rm "$FOLDER/backup.env"
rm "$FOLDER/$BACKUP_FILENAME_BASE.bson"
rm "$FOLDER/$BACKUP_FILENAME_BASE.tar.gz"
rmdir $FOLDER