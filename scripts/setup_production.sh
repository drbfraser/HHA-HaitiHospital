#!/bin/bash
# This script can be run on a fresh VM to install and run the project on a production server

RED='\033[1;31m'
BLUE='\033[1;36m'
COLOR_OFF='\033[0m'

# exit if there is a failed command
set -e

echo -e "${BLUE}"
echo -e "Hope Health Action - Haiti: Deployment Script"
echo -e "This script must be run as root or with sudo. It is only supported on Ubuntu Server 22.04."
echo -e "It installs the config and deployment files in /root/haiti/"
echo -e "${COLOR_OFF}${RED}"
echo -e "WARNING: If run on an existing server instance, this will likely delete data."
read -p "Continue (y/n)? " CONT
echo -e "${COLOR_OFF}"

if [ "$CONT" != "y" ]; then
    exit 0
fi


echo -e "\n${BLUE}Updating and upgrading currently installed packages...${COLOR_OFF}\n"

apt update -y
apt upgrade -y

if [ -f /var/run/reboot-required ] 
then
    echo -e "\n${BLUE}Linux requires a reboot to complete install/upgrade tasts..${COLOR_OFF}"
    echo -e "${BLUE}Please reboot ('sudo reboot') and then re-run this script to continue installation.${COLOR_OFF}"
    exit 1
fi

echo -e "\n${BLUE}Installing needed utils...${COLOR_OFF}\n"

# Docker Engine: https://docs.docker.com/engine/install/ubuntu/
sudo apt-get -y install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

echo -e ${BLUE}
read -p "Please enter the absolute path to the block storage: (/path/to/block/storage) " BLOCK_STORAGE_DIR
echo -e ${COLOR_OFF}
echo -e "\n${BLUE}The block storge path is: ${BLOCK_STORAGE_DIR}${COLOR_OFF}\n"

echo -e "\n${BLUE}Installing docker and docker compose...${COLOR_OFF}\n"

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin
 

echo -e "\n${BLUE}Configuring docker security with user namespaces...${COLOR_OFF}\n"

# User namespaces (security): https://docs.docker.com/engine/security/userns-remap/
echo '{
  "userns-remap": "default",
  "data-root": "'"${BLOCK_STORAGE_DIR}"'"
}' | sudo tee /etc/docker/daemon.json > /dev/null
sudo chmod 0644 /etc/docker/daemon.json
sudo systemctl restart docker

echo -e "\n${BLUE}Starting the Docker service and setting Docker to automatically start at boot${COLOR_OFF}\n"

systemctl start docker
systemctl enable docker

if [ ! -f ~/.ssh/id_ed25519.pub ]; then
    echo -e "\n${BLUE}Generating SSH key...${COLOR_OFF}\n"
    ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -q -N ""
fi


echo -e "\n${BLUE}Clone project code from GitHub...${COLOR_OFF}\n"

cd ~
if [ ! -d haiti ]; then
    git clone https://github.com/drbfraser/HHA-HaitiHospital.git haiti
fi    
cd ~/haiti/
git pull
git checkout production


echo -e "\n${BLUE}Linking update script into /root/update.sh...${COLOR_OFF}\n"

# TODO: Untested, becuase we have no update.sh file in scripts now
chmod +X ~/haiti/scripts/update.sh
ln -s -f ~/haiti/scripts/update.sh ~/update.sh


# .env file creation
if [ ! -f .env ]; then
    RAND_PASSWORD=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 20)
    RAND_SECRET=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 20)

    echo -e "\n${BLUE}Please enter the domain for this server installation (blank to use IP over HTTP only):${COLOR_OFF}"
    read;


    echo "# Configuration generated by install script (`date`)" > .env
    echo "DOMAIN=${REPLY:-:80}" >> .env
    echo "MONGO_URI=mongodb://localhost:27017/" >> .env
    echo "JWT_SECRET=${RAND_SECRET}" >> .env
    echo "CORS=http://localhost:3000" >> .env
    echo "SERVER_PORT=8000" >> .env
    echo "TEST_SERVER_PORT=5001" >> .env
    echo "PASSWORD_SEED=${RAND_PASSWORD}" >> .env


    echo -e "\n${BLUE}Removing previous Docker containers and volumes...${COLOR_OFF}\n"
    docker compose -f docker-compose.yml -f docker-compose.deploy.yml down
    docker volume prune -f

    # echo -e "\n${BLUE}Enter the name of the S3 bucket you want to sync with:${COLOR_OFF}"
    # read;
    # echo "S3_BUCKET_NAME=${REPLY}" >> .env
fi

# TODO: AWS is the next step for Haiti project

# echo -e "\n${BLUE}Installing AWS CLI..."
# echo -e "  If you have not already done so, create the AWS S3 bucket and user by uploading"
# echo -e "  the s3-bucket-backups.yml file to AWS CloudFormation on your AWS account."
# echo -e "  Once you setup the IAM user it will give you the public and secret key that"
# echo -e "  AWS CLI needs here.${COLOR_OFF}\n"

# sudo apt-get install awscli
# aws configure

# echo -e "\n${BLUE}Creating backup log files & setting up cron jobs...${COLOR_OFF}\n"

# touch ~/hourly_backup_log.txt
# touch ~/daily_backup_log.txt
# touch ~/monthly_backup_log.txt

# chmod +x ~/haiti/scripts/backup_volume_to_s3.sh
# chmod +x ~/haiti/scripts/restore_volume_from_s3.sh
# ln -s -f ~/haiti/scripts/restore_volume_from_s3.sh ~/restore_volume_from_s3.sh

# # Add cron job for hourly/daily/monthly backups and redirect output to ~/..._backup_log.txt
# crontab - <<EOF
# 0 * * * * /bin/bash ~/haiti/scripts/backup_volume_to_s3.sh hourly >> ~/hourly_backup_log.txt 2>&1
# 0 2 * * * /bin/bash ~/haiti/scripts/backup_volume_to_s3.sh daily >> ~/daily_backup_log.txt 2>&1
# 0 0 1 * * /bin/bash ~/haiti/scripts/backup_volume_to_s3.sh monthly >> ~/monthly_backup_log.txt 2>&1
# EOF

echo -e "\n${BLUE}Downloading Docker images and spinning up Docker containers...${COLOR_OFF}\n"

# Version of the form v2022-12-31.abcd5678, based on date and short SHA1 of last commit on branch
export COMMIT_SHA=`git show -s --format=%H`
export IMAGE_TAG=v`git show -s --format=%cs $COMMIT_SHA`.`git rev-parse --short=8 $COMMIT_SHA`
echo "Most recent Git commit SHA:  $COMMIT_SHA"
echo "               Release tag:  $IMAGE_TAG"
docker compose -f docker-compose.yml -f docker-compose.deploy.yml pull
docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d


echo -e "\n${BLUE}Waiting for database container to start...${COLOR_OFF}"
sleep 10;

# TODO: Still investigating if we need this in mongoDB
# echo -e "${BLUE}Upgrading database schema...${COLOR_OFF}\n"

# Seed the database in the containerized deployment
# echo -e "\n${BLUE}"

# print out username and RAND_PASSWORD for user to save

# echo -e "\n${BLUE}"
# echo "Usernames and roles:"
# echo "Role: Admin"
# echo "Username: user0"
# echo "Role: Medical Director"
# echo "Username: user1"
# echo "Role: Head of Department"
# echo "Username: user2"
# echo "Role: User"
# for i in {3..6}
# do
#    echo "Username: user$i"
# done
# echo -e "${COLOR_OFF}"

# echo -e "\n${RED}** This is the password: $RAND_PASSWORD **${COLOR_OFF}"
# echo -e "\n${RED}** WRITE DOWN AND SAVE THE USERNAME AND PASSWORD ABOVE! **${COLOR_OFF}"

echo -e "\n${BLUE}Roles and Usernames:"
echo "----------------------------------"
echo -e "Role\t\t\tUsername"
echo "----------------------------------"
echo -e "Admin\t\t\tuser0"
echo -e "Medical Director\tuser1"
echo -e "Head of Department\tuser2"
echo -e "User\t\t\tuser3 to user6"
echo "----------------------------------"
echo -e "${COLOR_OFF}"

echo -e "\n${RED}** IMPORTANT **"
echo -e "The password for all users is: $RAND_PASSWORD"
echo -e "Please write down and save this password along with the usernames above."
echo -e "You will need these credentials to log in to the system."
echo -e "${COLOR_OFF}"

echo -e "Data seeding options:"
echo -e "   0: No data seeding"
echo -e "   1: Data seeding (Recommended)"
read -p "Enter an option: " OPTION
echo -e "${COLOR_OFF}"

case $OPTION in
    1)
        echo -e "\n${BLUE}Seed the database...${COLOR_OFF}\n"
        docker exec -it hhahaiti_server /bin/bash -c "npm run seed"
        ;;
esac

echo -e "\n${BLUE}Finished${COLOR_OFF}\n"