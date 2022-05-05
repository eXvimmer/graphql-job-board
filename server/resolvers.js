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

const Company = {
  jobs(company) {
    return db.jobs.list().filter((j) => j.companyId === company.id);
  },
};

module.exports = { Query, Job, Company };
