const db = require("./db");

const Query = {
  company(_, { id }) {
    return db.companies.get(id);
  },
  job(_, { id }) {
    return db.jobs.get(id);
  },
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
