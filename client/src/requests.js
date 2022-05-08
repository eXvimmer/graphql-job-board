const endpointURL = `http://localhost:9000/graphql`;

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(endpointURL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json();

  if (body.errors) {
    const messages = body.errors.map((err) => err.message).join("\n");
    throw new Error(messages);
  }
  return body.data;
}

export async function loadJobs() {
  const query = `
    {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { jobs } = await graphqlRequest(query);
  return jobs;
}

export async function loadJob(id) {
  const query = `
    query singleJob($id: ID!) {
      job(id: $id) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;

  const { job } = await graphqlRequest(query, { id });
  return job;
}

export async function loadCompany(id) {
  const query = `
    query getCompany($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
          description
        }
      }
    }
  `;

  return await graphqlRequest(query, { id });
}

export async function createJob(input) {
  const mutation = `
    mutation createJob($input: createJobInput) {
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;

  const { job } = await graphqlRequest(mutation, { input });
  return job;
}
