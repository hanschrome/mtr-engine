#!/bin/bash

#1. Install dependencies: Git, [Docker && Docker Compose](https://wiki.archlinux.org/title/docker#Installation).
#2. Clone this repository (For example, `/home/mtr/services/mtr-engine`).
#3. Install an algorithm (`make add repo='link'`, add it/uncomment also to the `RobotEngineFactory::robotEngines`).
#4. Create a .env from template (`cat .env.develop > .env`).
#5. Add your Binance keys to your .env, the rest of variables can be blank. (`vim .env`)
#6. Setup and testing (`make build && make unit`).
#7. Create a configuration file in /data to your bot and fill the belonged parameters. (`vim data/1.json`).
#8. Add the file to your instances in index.json, only needed for multitrading instances. (`vim data/index.json`).
#9. Run cron.php. `make cron`
#10. Done!

echo "Welcome to MTR-ENGINE install"

while true; do
    read -p "Check Dependencies: Do you have Git, Docker and Docker compose installed? [Y/n] " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) echo "Git, Docker and Docker compose are required.";exit;;
        * ) ;;
    esac
done

read -p "Paste here the algorithm git repository." algorithm_repository
make add repo='$(algorithm_repository)'

read -p "Now a vim editor will be opened in order to allow you to add the algorithm to the Factory. Press enter." void

vim mtr-engine/domain/robot/engines/factory/RobotEngineFactory.js

while true; do
    read -p "Changes are correct? In case of n, the vim editor will be opened back. [Y/n] " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) vim mtr-engine/domain/robot/engines/factory/RobotEngineFactory.js;exit;;
        * ) ;;
    esac
done

read -p "Now a vim editor will be opened in order to allow you to add the belonged configuration for this algorithm." void

vim data/1.json

while true; do
    read -p "Changes are correct? In case of n, the vim editor will be opened back. [Y/n] " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) vim data/1.json;exit;;
        * ) ;;
    esac
done

read -p "Configure the .env file with your Binance credentials. Press enter to open the editor" void

cat .env.develop > .env
vim .env

while true; do
    read -p "Changes are correct? In case of n, the vim editor will be opened back. [Y/n] " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) vim .env;exit;;
        * ) ;;
    esac
done

read -p "Build and testing will be executed, press enter." void

make build && make unit

read -p "Do you want to run the MTR-ENGINE now? [Yn]"

while true; do
    read -p "Changes are correct? In case of n, the vim editor will be opened back. [Y/n] " yn
    case $yn in
        [Yy]* ) make cron;break;;
        [Nn]* ) exit;;
        * ) make cron;;
    esac
done

echo "All is running. Check your docker containers for further information. (docker container ls)"