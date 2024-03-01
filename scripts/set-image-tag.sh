#!/bin/bash
# This script sets the IMAGE_TAG environment variable for use when running docker compose

# Check if the name of this script is "set-image-tag.sh"
if [[ $0 = *"set-image-tag.sh" ]]; then
    echo "This script must be run using 'source' to set the IMAGE_TAG environment variable:"
    echo "    source $0"
    exit 1
fi

export COMMIT_SHA=`git show -s --format=%H`
export IMAGE_TAG=v`git show -s --format=%cs $COMMIT_SHA`.`git rev-parse --short=8 $COMMIT_SHA`
echo "Most recent Git commit SHA:  $COMMIT_SHA"
echo "                 IMAGE_TAG:  $IMAGE_TAG"
