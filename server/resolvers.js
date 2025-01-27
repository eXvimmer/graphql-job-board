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

const Mutation = {
  createJob(_, { input }, { user }) {
    if (!user) throw new Error("unauthorized");

    const id = db.jobs.create({ ...input, companyId: user.companyId });
    return db.jobs.get(id);
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

module.exports = { Query, Mutation, Job, Company };
