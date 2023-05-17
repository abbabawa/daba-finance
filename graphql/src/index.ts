import "reflect-metadata";
import { buildSchema } from "type-graphql";
import AuthResolver from "./resolvers/auth.resolver";
// import TaskResolver from "./resolvers/taskResolver";

import express from "express";
import { graphqlHTTP } from "express-graphql";

const app = express();

const run = async () => {
  const schema = await buildSchema({
    resolvers: [AuthResolver],
    emitSchemaFile: true,
  });

  app.use(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      // rootValue: root,
      graphiql: true,
    })
  );

  const PORT = 8001;

  app.listen(PORT);

  console.log(
    `Running a GraphQL API server at http://localhost:${PORT}/graphql`
  );
};

run()