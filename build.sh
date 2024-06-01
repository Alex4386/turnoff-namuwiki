#!/bin/bash

echo ==================================================
echo ' _____                  ___   __  __ '
echo '|_   _|   _ _ __ _ __  / _ \ / _|/ _|'
echo "  | || | | | '__| '_ \| | | | |_| |_ "
echo '  | || |_| | |  | | | | |_| |  _|  _|'
echo '  |_| \__,_|_|  |_| |_|\___/|_| |_|  '
echo                                     
echo ' _   _                     __        ___ _    _ '
echo '| \ | | __ _ _ __ ___  _   \ \      / (_) | _(_)'
echo "|  \| |/ _\` | '_ \` _ \\| | | \\ \\ /\\ / /| | |/ / |"
echo '| |\  | (_| | | | | | | |_| |\ V  V / | |   <| |'
echo '|_| \_|\__,_|_| |_| |_|\__,_| \_/\_/  |_|_|\_\_|'
                                                
echo ==================================================
echo Package Builder
echo ==================================================
echo
sleep 3

echo Current Working Directory is...
pwd
echo

echo Removing existing TurnOff-NamuWiki Archive.
rm turnoff-namuwiki.zip
rm turnoff-namuwiki@alex4386.us.xpi
rm turnoff-namuwiki.dev.zip
echo Done.
echo

echo Adding Production Build Information
git rev-parse --short HEAD > production_ver.txt

echo Building TurnOff-NamuWiki Archive....
zip -r turnoff-namuwiki.zip * --exclude=*.git* --exclude=*node_modules* --exclude=*res/marketplace/* --exclude=*.DS_store --exclude=*.sh --exclude=*intelliBan/* --exclude=*res/marketplace* --exclude=*res/logo.psd

echo Building Archive for Firefox Add-on Team...
zip -r turnoff-namuwiki.dev.zip * --exclude=*res/marketplace/* --exclude=*.DS_store --exclude=*intelliBan/*  --exclude=*res/marketplace* --exclude=*res/logo.psd
cp turnoff-namuwiki.zip turnoff-namuwiki@alex4386.us.xpi

echo Removing Production Build Information
rm production_ver.txt
echo
