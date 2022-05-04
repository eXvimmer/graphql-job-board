const db = require("./db");

const Query = {
  jobs() {
    return db.jobs.list();
  },
};

module.exports = { Query };
