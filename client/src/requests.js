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

const jobDetailsFragment = gql`
  fragment jobDetails on Job {
    id
    title
    description
    company {
      id
      name
    }
  }
`;

const createJobMutation = gql`
  mutation createJob($input: createJobInput) {
    job: createJob(input: $input) {
      ...jobDetails
    }
  }
  ${jobDetailsFragment}
`;

const getCompanyQuery = gql`
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

const jobsQuery = gql`
  query jobsQuery {
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

const jobQuery = gql`
  query jobQuery($id: ID!) {
    job(id: $id) {
      ...jobDetails
    }
  }
  ${jobDetailsFragment}
`;

export async function loadJobs() {
  const {
    data: { jobs },
  } = await client.query({ query: jobsQuery, fetchPolicy: "no-cache" });
  return jobs;
}

export async function loadJob(id) {
  const {
    data: { job },
  } = await client.query({ query: jobQuery, variables: { id } });
  return job;
}

export async function loadCompany(id) {
  const {
    data: { company },
  } = await client.query({ query: getCompanyQuery, variables: { id } });

  return company;
}

export async function createJob(input) {
  const {
    data: { job },
  } = await client.mutate({
    mutation: createJobMutation,
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
