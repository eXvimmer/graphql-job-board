import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "apollo-boost";
import gql from "graphql-tag";
import { isLoggedIn, getAccessToken } from "./auth";

const endpointURL = `http://localhost:9000/graphql`;

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    operation.setContext({
      headers: {
        authorization: "Bearer " + getAccessToken(),
      },
    });
  }
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: endpointURL })]),
  cache: new InMemoryCache(),
});

export async function loadJobs() {
  const query = gql`
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

  const {
    data: { jobs },
  } = await client.query({ query, fetchPolicy: "no-cache" });
  return jobs;
}

const jobQuery = gql`
  query jobQuery($id: ID!) {
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

export async function loadJob(id) {
  const {
    data: { job },
  } = await client.query({ query: jobQuery, variables: { id } });
  return job;
}

export async function loadCompany(id) {
  const query = gql`
    query getCompany($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `;

  const {
    data: { company },
  } = await client.query({ query, variables: { id } });

  return company;
}

export async function createJob(input) {
  const mutation = gql`
    mutation createJob($input: createJobInput) {
      job: createJob(input: $input) {
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

  const {
    data: { job },
  } = await client.mutate({
    mutation,
    variables: { input },
    update: (cache, { data }) => {
      cache.writeData({
        query: jobQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return job;
}
