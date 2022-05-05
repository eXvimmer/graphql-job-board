const db = require("./db");

const Query = {
  jobs() {
    return db.jobs.list();
  },
};

const Job = {
  company(job) {
    return db.companies.get(job.companyId);
  },
};

module.exports = { Query, Job };
