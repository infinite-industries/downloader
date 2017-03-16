#!/usr/bin/env bash

ROOT='/home/ubuntu/downloader'
USER='ubuntu'

SERVER=''
if [[ "production" = $1 ]]; then
  SERVER='downloader.infinite.industries'
elif [[ "staging" = $1 ]]; then
  SERVER='downloader-demo.infinite.industries'
else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi

ssh $USER@$SERVER << EOF
  cd $ROOT
  echo 'Updating sources'
  git reset --hard HEAD
  git checkout master
  git pull
  echo 'Installing npm packages'
  npm install
  echo 'Restarting'
  forever stop downloader
  rm /home/$USER/.forever/downloader.log
  forever start --uid downloader index.js
  echo 'Done!'
EOF
