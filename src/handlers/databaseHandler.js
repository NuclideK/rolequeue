const fs = require("fs");
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/database.sqlite",
});

const pendingrole = sequelize.define("pendingrole", {
  ID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  roles: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
      return this.getDataValue("roles").split(";");
    },
    set(val) {
      this.setDataValue("roles", val.join(";"));
    },
  },
});

async function isConnected() {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

async function init() {
  return new Promise(async (resolve, reject) => {
    await sequelize.sync();
    resolve(true);
  });
}

async function getPending(ID) {
  const result = await pendingrole.findByPk(ID);
  return result; // NULL or OBJECT
}

async function addPending(ID, newroles) {
  return new Promise(async (resolve, reject) => {
    let user = await getPending(ID);
    if (user === null) {
      user = await pendingrole.create({ ID: ID, roles: newroles });
    } else {
      let roles = user.roles;
      user.roles = roles.concat(newroles);
      await user.save();
    }
    resolve(user);
  });
}

async function getTask() {
  return new Promise(async (resolve, reject) => {
    user = await pendingrole.findOne();
    resolve(user);
  });
}
module.exports = {
  init,
  isConnected,
  addPending,
  getTask,
};
