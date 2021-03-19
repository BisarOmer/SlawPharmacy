## Slaw Pharmacy
 a pharmacy database system for desktop application based on Electron, React and MySQL.

## Setup

1. Importing the database form Backup folder to your DBMS
2. Configuring the mysql login so we will not need username and password while executing mysqldump 

    > mysql_config_editor set --login-path=local --host=localhost
    > --user=username --password

3. Install and configuring openssl [Download openssl](https://code.google.com/archive/p/openssl-for-windows/downloads)
4. Install GnuWin32 [Download GnuWin32](https://sourceforge.net/projects/gnuwin32/files/sed/4.2.1/sed-4.2.1-setup.exe/download)
5. Add new `environment variable` by name PublicKey and it's location, for backup encryption you can use public key from backup folder or create one   [Generate Private and Public key](https://cryptotools.net/rsagen) 

*openssl used for encryption and GnuWin32 for zipping  the backup file which will be store in OneDrive* 

## users
username : manager / password : 12345
username : cashier / password : 12345

## install and running

    npm install 
    npm start

## building

    npm build
    npm build-Win64

## Screenshot
![Login](https://github.com/BisarOmer/SlawPharmacy/blob/master/resources/Login.PNG)

![Home](https://github.com/BisarOmer/SlawPharmacy/blob/master/resources/Home.PNG)


