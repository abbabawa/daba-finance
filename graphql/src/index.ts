import "reflect-metadata";
import { buildSchema } from "type-graphql";
import AuthResolver from "./resolvers/auth.resolver";
import TransactionResolver from "./resolvers/transaction.resolver";
import http from 'http';

import express from "express";
import { graphqlHTTP } from "express-graphql";

const app = express();

const run = async () => {
  const httpServer = http.createServer(app);
  const schema = await buildSchema({
    resolvers: [AuthResolver, TransactionResolver],
    emitSchemaFile: true,
  });

  app.use(express.urlencoded({extended: true}));
  app.use(express.json());

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