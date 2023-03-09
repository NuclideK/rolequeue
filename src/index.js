const databaseHandler = require("./handlers/databaseHandler");

databaseHandler.init().then(async () => {
  if (databaseHandler.isConnected()) {
    console.log("Database up!");
  } else {
    console.error("Database was unable to connect");
  }
});
