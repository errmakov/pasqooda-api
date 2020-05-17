#!/bin/sh
echo 'Going deployment'
ssh root@weblime.ru "cd ~/de/production/pasqooda/pasqooda-api; git pull origin master; git status; docker-compose build; docker-compose up"