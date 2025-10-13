# GraphQL Interview Questions and Answers

Comprehensive guide for GraphQL interview preparation.

---

## Basic Level

### 1. What is GraphQL and how does it differ from REST?

**Answer:** GraphQL is a query language and runtime for APIs developed by Facebook. It allows clients to request exactly the data they need.

**Key Differences from REST:**

| GraphQL | REST |
|---------|------|
| Single endpoint | Multiple endpoints |
| Client specifies exact data needed | Server determines response structure |
| No over-fetching or under-fetching | Often returns too much or too little data |
| Strongly typed schema | No standard type system |
| Single request for multiple resources | Multiple requests often needed |

**Example:**

```graphql
# GraphQL - one request
query {
  user(id: "1") {
    name
    email
    posts {
      title
    }
  }
}
```

```bash
# REST - multiple requests needed
# GET /users/1
# GET /users/1/posts
```

---

### 2. What are the main operations in GraphQL?

**Answer:** GraphQL has three main operation types:

**Query - Read data (like GET):**
```graphql
query {
  users {
    id
    name
  }
}
```

**Mutation - Modify data (like POST/PUT/DELETE):**
```graphql
mutation {
  createUser(name: "John", email: "john@example.com") {
    id
    name
  }
}
```

**Subscription - Real-time data updates via WebSocket:**
```graphql
subscription {
  messageAdded {
    id
    content
    author
  }
}
```

---

### 3. What is a GraphQL schema?

**Answer:** A schema defines the structure of your API using the Schema Definition Language (SDL). It specifies what queries clients can make and what data they'll receive.

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  createdAt: String!
}

type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String): User
  deleteUser(id: ID!): Boolean!
}
```

**Key points:**
- `!` means non-nullable (required)
- `[]` indicates an array
- `ID` is a built-in scalar type

---

### 4. What are scalar types in GraphQL?

**Answer:** Scalar types represent primitive values. GraphQL has five built-in scalar types:

- `Int` - 32-bit integer
- `Float` - floating-point number
- `String` - UTF-8 character sequence
- `Boolean` - true or false
- `ID` - unique identifier (serialized as String)

**Custom scalars:**
```graphql
scalar Date
scalar Email
scalar URL

type User {
  id: ID!
  email: Email!
  birthdate: Date
  website: URL
}
```

---

### 5. What are resolvers?

**Answer:** Resolvers are functions that resolve values for fields in your schema. Each field can have a resolver that fetches data from a database, API, or other source.

```javascript
const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      return getUserById(args.id);
    },
    users: () => {
      return getAllUsers();
    }
  },
  Mutation: {
    createUser: (parent, args) => {
      return createNewUser(args.name, args.email);
    }
  },
  User: {
    posts: (parent) => {
      // parent is the User object
      return getPostsByUserId(parent.id);
    }
  }
};
```

**Resolver parameters:**
- `parent` - result from parent resolver
- `args` - arguments passed to the field
- `context` - shared data (auth, database, etc.)
- `info` - query information

---

## Intermediate Level

### 6. What are arguments and variables in GraphQL?

**Answer:**

**Arguments are passed directly in the query:**
```graphql
query {
  user(id: "123") {
    name
  }
}
```

**Variables allow dynamic queries and are typed:**
```graphql
query GetUser($userId: ID!) {
  user(id: $userId) {
    name
    email
  }
}
```

```json
# Variables (sent separately)
{
  "userId": "123"
}
```

**Default values:**
```graphql
query GetUsers($limit: Int = 10, $offset: Int = 0) {
  users(limit: $limit, offset: $offset) {
    name
  }
}
```

---

### 7. What are fragments and why use them?

**Answer:** Fragments are reusable units of fields that can be shared across multiple queries.

```graphql
fragment UserInfo on User {
  id
  name
  email
  avatar
}

query {
  user(id: "1") {
    ...UserInfo
    posts {
      title
    }
  }
  
  currentUser {
    ...UserInfo
  }
}
```

**Inline fragments for unions/interfaces:**
```graphql
query {
  search(text: "hello") {
    ... on User {
      name
    }
    ... on Post {
      title
    }
  }
}
```

**Benefits:**
- Reduces duplication
- Maintains consistency
- Easier to maintain

---

### 8. What are interfaces and unions?

**Answer:**

**Interfaces - define common fields for multiple types:**
```graphql
interface Node {
  id: ID!
  createdAt: String!
}

type User implements Node {
  id: ID!
  createdAt: String!
  name: String!
  email: String!
}

type Post implements Node {
  id: ID!
  createdAt: String!
  title: String!
  content: String!
}

query {
  node(id: "123") {
    id
    ... on User {
      name
    }
    ... on Post {
      title
    }
  }
}
```

**Unions - return one of multiple types:**
```graphql
union SearchResult = User | Post | Comment

type Query {
  search(term: String!): [SearchResult!]!
}

query {
  search(term: "graphql") {
    __typename
    ... on User {
      name
    }
    ... on Post {
      title
    }
    ... on Comment {
      text
    }
  }
}
```

---

### 9. What is the N+1 problem and how do you solve it?

**Answer:** The N+1 problem occurs when fetching related data results in multiple database queries.

**Problem example:**
```javascript
// Gets 1 user
const user = await getUser(id);

// Then N queries for each post
for (const postId of user.postIds) {
  const post = await getPost(postId); // N queries!
}
```

**Solutions:**

**1. DataLoader - batches and caches requests:**
```javascript
const DataLoader = require('dataloader');

const postLoader = new DataLoader(async (postIds) => {
  const posts = await getPostsByIds(postIds);
  return postIds.map(id => posts.find(post => post.id === id));
});

const resolvers = {
  User: {
    posts: (user) => {
      return postLoader.loadMany(user.postIds);
    }
  }
};
```

**2. Query optimization - use joins or includes:**
```javascript
const user = await User.findById(id).populate('posts');
```

---

### 10. What are directives?

**Answer:** Directives modify field execution or schema behavior.

**Built-in directives:**
```graphql
# @include - conditionally include field
query GetUser($withEmail: Boolean!) {
  user(id: "1") {
    name
    email @include(if: $withEmail)
  }
}

# @skip - conditionally skip field
query GetUser($skipPosts: Boolean!) {
  user(id: "1") {
    name
    posts @skip(if: $skipPosts) {
      title
    }
  }
}

# @deprecated - mark field as deprecated
type User {
  name: String!
  fullName: String! @deprecated(reason: "Use 'name' instead")
}
```

**Custom directives:**
```graphql
directive @auth(requires: Role = USER) on FIELD_DEFINITION

type Query {
  users: [User!]! @auth(requires: ADMIN)
  me: User @auth
}
```

---

## Advanced Level

### 11. How do you implement authentication and authorization?

**Answer:**

**Authentication - verify identity:**
```javascript
const { ApolloServer } = require('apollo-server');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    return { user };
  }
});

// In resolver
const resolvers = {
  Query: {
    me: (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      return context.user;
    }
  }
};
```

**Authorization - check permissions:**
```javascript
// Schema directives
const { SchemaDirectiveVisitor } = require('graphql-tools');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { requires } = this.args;

    field.resolve = async function(...args) {
      const context = args[2];
      
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      if (!context.user.roles.includes(requires)) {
        throw new ForbiddenError('Not authorized');
      }
      
      return resolve.apply(this, args);
    };
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthDirective
  }
});
```

---

### 12. What is pagination in GraphQL?

**Answer:** GraphQL supports multiple pagination patterns:

**Offset-based pagination:**
```graphql
type Query {
  users(limit: Int!, offset: Int!): [User!]!
}

query {
  users(limit: 10, offset: 20) {
    name
  }
}
```

**Cursor-based pagination (Relay specification):**
```graphql
type Query {
  users(first: Int, after: String, last: Int, before: String): UserConnection!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

query {
  users(first: 10, after: "cursor123") {
    edges {
      node {
        name
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

---

### 13. How do subscriptions work?

**Answer:** Subscriptions enable real-time updates using WebSocket.

**Schema:**
```graphql
type Subscription {
  messageAdded(channelId: ID!): Message!
  userStatusChanged(userId: ID!): UserStatus!
}

type Message {
  id: ID!
  content: String!
  author: User!
  timestamp: String!
}
```

**Server implementation:**
```javascript
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const MESSAGE_ADDED = 'MESSAGE_ADDED';

const resolvers = {
  Mutation: {
    sendMessage: (parent, { channelId, content }, context) => {
      const message = createMessage(channelId, content, context.user);
      
      // Publish event
      pubsub.publish(MESSAGE_ADDED, {
        messageAdded: message,
        channelId
      });
      
      return message;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: (parent, { channelId }) => {
        return pubsub.asyncIterator([MESSAGE_ADDED]);
      },
      resolve: (payload, { channelId }) => {
        if (payload.channelId === channelId) {
          return payload.messageAdded;
        }
      }
    }
  }
};
```

**Client usage:**
```javascript
const subscription = gql`
  subscription OnMessageAdded($channelId: ID!) {
    messageAdded(channelId: $channelId) {
      id
      content
      author {
        name
      }
    }
  }
`;

client.subscribe({ query: subscription, variables: { channelId: '123' } })
  .subscribe({
    next: (data) => console.log(data),
    error: (err) => console.error(err)
  });
```

---

### 14. What is schema stitching and federation?

**Answer:**

**Schema Stitching - combine multiple GraphQL schemas:**
```javascript
const { stitchSchemas } = require('@graphql-tools/stitch');

const userSchema = makeExecutableSchema({
  typeDefs: `
    type User {
      id: ID!
      name: String!
    }
    type Query {
      user(id: ID!): User
    }
  `,
  resolvers: userResolvers
});

const postSchema = makeExecutableSchema({
  typeDefs: `
    type Post {
      id: ID!
      title: String!
      authorId: ID!
    }
    type Query {
      post(id: ID!): Post
    }
  `,
  resolvers: postResolvers
});

const stitchedSchema = stitchSchemas({
  subschemas: [userSchema, postSchema],
  typeDefs: `
    extend type User {
      posts: [Post!]!
    }
  `,
  resolvers: {
    User: {
      posts: {
        selectionSet: '{ id }',
        resolve: (user, args, context, info) => {
          return getPostsByAuthorId(user.id);
        }
      }
    }
  }
});
```

**Apollo Federation - distributed GraphQL architecture:**
```javascript
// Users service
const { buildSubgraphSchema } = require('@apollo/subgraph');

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    user(id: ID!): User
  }
`;

// Posts service
const typeDefs = gql`
  type Post @key(fields: "id") {
    id: ID!
    title: String!
    author: User!
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    posts: [Post!]!
  }
`;

// Gateway
const { ApolloGateway } = require('@apollo/gateway');

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'users', url: 'http://localhost:4001' },
    { name: 'posts', url: 'http://localhost:4002' }
  ]
});
```

---

### 15. What are best practices for error handling?

**Answer:**

**1. Use proper error types:**
```javascript
const { ApolloError, UserInputError, AuthenticationError } = require('apollo-server');

const resolvers = {
  Mutation: {
    createUser: (parent, { email, name }) => {
      if (!isValidEmail(email)) {
        throw new UserInputError('Invalid email format', {
          invalidArgs: ['email']
        });
      }
      
      try {
        return createUser(email, name);
      } catch (error) {
        throw new ApolloError('Failed to create user', 'USER_CREATION_FAILED');
      }
    }
  }
};
```

**2. Return errors in response:**
```graphql
type Mutation {
  createUser(input: CreateUserInput!): CreateUserResult!
}

union CreateUserResult = User | ValidationError

type ValidationError {
  message: String!
  field: String!
}
```

**3. Format errors globally:**
```javascript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    // Log error
    console.error(error);
    
    // Don't expose internal errors
    if (error.message.startsWith('Database')) {
      return new Error('Internal server error');
    }
    
    return error;
  }
});
```

---

## Practical Questions

### 16. How would you optimize a GraphQL API?

**Answer:**

**1. Use DataLoader for batching**

**2. Implement query complexity analysis:**
```javascript
const { createComplexityLimitRule } = require('graphql-validation-complexity');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    createComplexityLimitRule(1000, {
      onCost: (cost) => console.log('Query cost:', cost)
    })
  ]
});
```

**3. Limit query depth:**
```javascript
const depthLimit = require('graphql-depth-limit');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)]
});
```

**4. Enable caching:**
```javascript
// Response caching
const { ApolloServer } = require('apollo-server');
const responseCachePlugin = require('apollo-server-plugin-response-cache');

const server = new ApolloServer({
  plugins: [responseCachePlugin()],
  cacheControl: {
    defaultMaxAge: 60
  }
});

// In schema
type Query {
  user(id: ID!): User @cacheControl(maxAge: 300)
}
```

**5. Use persisted queries**

---

### 17. How do you test GraphQL APIs?

**Answer:**

```javascript
const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');

describe('User queries', () => {
  let server;
  let query, mutate;

  beforeAll(() => {
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({ user: mockUser })
    });

    const testClient = createTestClient(server);
    query = testClient.query;
    mutate = testClient.mutate;
  });

  test('fetches user by id', async () => {
    const GET_USER = gql`
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
        }
      }
    `;

    const { data } = await query({
      query: GET_USER,
      variables: { id: '1' }
    });

    expect(data.user).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  test('creates new user', async () => {
    const CREATE_USER = gql`
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          name
        }
      }
    `;

    const { data } = await mutate({
      mutation: CREATE_USER,
      variables: {
        input: { name: 'Jane', email: 'jane@example.com' }
      }
    });

    expect(data.createUser.name).toBe('Jane');
  });
});
```

---

## Summary

These questions cover fundamental to advanced GraphQL concepts commonly asked in interviews! Practice implementing these patterns to solidify your understanding.

For more comprehensive examples and detailed explanations, see the main [README.md](./README.md) which contains extensive Node.js and libuv examples.
