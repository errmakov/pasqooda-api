#!/bin/sh
echo 'Going deployment API'
ssh root@weblime.ru "cd ~/de/production/pasqooda/pasqooda-api; git pull origin master; git status; docker-compose build; docker-compose up"
echo 'Going deployment FRONT'
ssh root@weblime.ru "cd ~/de/production/pasqooda/pasqooda-front; git pull origin master; git status; docker-compose build; docker-compose up"