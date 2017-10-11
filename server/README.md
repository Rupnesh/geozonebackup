# Falcon Server

###Installation steps:

1. Make sure you have NPM, Node > 6 | MySQL > 5 or Postgresql installed on your machine. If you need to support more versions of node we highly recommend you to use NVM to track them.
2. `cd server`
3. `npm install`
4. `npm run local` 

Last step will automatically create the DB for you and will populate it with the spreadsheet data using the GoogleSheets API

`npm run local` will use nodemoon to watch code changes for you and automatically restart node server.
You may always use this for development.

To change your local configuration, see **server/config/config_local.yml**
From here you may change any environment configuration that you need.

**Sequelize** is used as an ORM to manage database. It's configured to work with MySQL and Postgres 

**Swagger** documentation for API can always be visualized in dev or local builds by just accessing `http://localhost:8080/docs`

### Configuring other environments
Currently we have local/prod/sprod setup:
local - is used for local development, will run the server on http localhost 8080 and will use MySQL database
prod - is used for production non secured, will run the server on *HTTP* 8080 with Postgresql
sprod - is used for production secured, will run the server on *HTTPS*  8081 with Postgresql

You can find all the server configuration specified under:
```./src/config/config_{environment}.yml```

### Database models
You can find them under `./src/models`. Here you can find the User model and you can create other models to be used in the app


### Running production
In order to run production with HTTPS you need to run the following script described in package.json

```npm run sprod```

You can always configure other scripts in **package.json** under **scripts** object
