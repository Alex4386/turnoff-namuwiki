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
echo Done.
echo

echo Building TurnOff-NamuWiki Archive....
zip -r turnoff-namuwiki.zip * --exclude=*.git* --exclude=*node_modules* --exclude=*showcase/chrome/* --exclude=*showcase/firefox/* --exclude=*.DS_store --exclude=*.sh
echo