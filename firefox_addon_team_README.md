# Firefox Add-on Team Build Instructions:

Hello, Thanks for auditing my software on your awesome firefox ecosystem.  
  
This is the steps for creating reproducable build on your system:  
  
## Table of Content
* [macOS and Linux](#macOS-and-Linux)
* [Windows](#Windows)

## macOS and Linux
Building on macOS®, Linux™ or any POSIX compliant system is easy!  
Automatic-building is supported on these machines!  
  
Step 1. git clone https://github.com/Alex4386/turnoff-namuwiki.git  
Step 2. Install nodeJS, npm, yarn on your machine.  
Step 3. revert to version that I included on the add-on archive. (could be checked via production_ver.txt of the archive)  
Step 4. run yarn install to install dependencies.    
Step 5. run yarn build-package to get results.  
Step 6. check turnoff-namuwiki.zip and compare the results!  
  
## Windows
Building on Windows® Systems are difficult than POSIX compliant systems.  
  
Step 1. git clone https://github.com/Alex4386/turnoff-namuwiki.git  
Step 2. Install nodeJS, npm, yarn on your machine.  
Step 3. revert to version that I included on the add-on archive. (could be checked via production_ver.txt of the archive)  
Step 4. run yarn install to install dependencies.  
Step 5. run yarn build to get transpiled results.  
Step 6. write your short version of your version hash into production_ver.txt on your root directory of the cloned repository.  
Step 7. package the entire directory **EXCLUDING .git, node_modules, showcase/marketplace/ and .sh files**  
  
**this code is transpiled with typescript.**  
  
Source code available on src/ is the original typescript code and  
transpiled into lib/ with **SAME DIRECTORY STRUCTURE** with src/ during the build process.  
