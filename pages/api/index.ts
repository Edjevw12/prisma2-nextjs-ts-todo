import { ApolloServer } from 'apollo-server-micro';
import { schema } from './schema';

const apolloServer = new ApolloServer({
  schema,
  context(ctx) {
    ctx.user = { name: 'De baas' };
    return ctx;
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api' });
