const endpointURL = `http://localhost:9000/graphql`;

export async function loadJobs() {
  const response = await fetch(endpointURL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: `
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
      `,
    }),
  });
  const body = await response.json();
  return body.data.jobs;
}

export async function loadJob(id) {
  const response = await fetch(endpointURL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: `
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
      `,
      variables: { id },
    }),
  });
  const body = await response.json();
  return body.data.job;
}
