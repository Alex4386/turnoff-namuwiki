#!/bin/bash

versionhash=`git rev-parse --short HEAD`

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
echo "Package Builder for CI - CI.${versionhash}"
echo ==================================================
echo
sleep 3

echo Current Working Directory is...
pwd
echo

echo Removing existing TurnOff-NamuWiki Archive.
rm turnoff-namuwiki.zip
echo Done.
echo

echo Adding CI Build Information
git rev-parse --short HEAD > ci_build_ver.txt

echo Building TurnOff-NamuWiki Archive....
zip -r turnoff-namuwiki.zip * --exclude=*.git* --exclude=*node_modules* --exclude=*showcase/marketplace/* --exclude=*.DS_store --exclude=*.sh --exclude=*intelliBan/* --exclude=*showcase/marketplace* --exclude=*showcase/logo.psd

echo Removing CI Build Information
rm ci_build_ver.txt
echo
