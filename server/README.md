# Falcon Server

###Installation steps:

1. Make sure you have NPM, Node > 6 | MySQL > 5 installed on your machine. If you need to support more versions of node we highly recommend you to use NVM to track them.
2. `cd server`
3. `npm install`
4. `npm run local` 

Last step will automatically create the DB for you and will populate it with the spreadsheet data using the GoogleSheets API

`npm run local` will use nodemoon to watch code changes for you and automatically restart node server.
You may always use this for development.

To change your local configuration, see **server/config/config_local.yml**
From here you may change any environment configuration that you need.

**Sequelize** is used as an ORM to manage database.

**Swagger** documentation for API can always be visualized in dev or local builds by just accessing `http://localhost:8080/docs`



