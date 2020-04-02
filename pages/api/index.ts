import { ApolloServer } from 'apollo-server-micro';
import {
  intArg,
  makeSchema,
  objectType,
  stringArg,
  asNexusMethod
} from 'nexus';

import { PrismaClient, tasksClient } from '@prisma/client';

const prisma = new PrismaClient();

const Task = objectType({
  name: 'Task',
  definition(t) {
    t.string('title');
    t.string('createdAt');
    t.string('description');
  }
});

const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.list.field('tasks', {
      type: Task
    });
  }
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.string('hello', {
      args: { name: stringArg({ nullable: true }) },
      resolve: (parent, { name }, ctx) => {
        return `Hello ${name || 'World'}!`;
      }
    });
    t.list.field('users', {
      type: 'User',
      resolve: async (_parent, _args, ctx): Promise<any> => {
        return await prisma.users.findMany({ include: { tasks: { skip: 0 } } });
      }
    });
  }
});

const schema = makeSchema({
  types: [Query, User],
  outputs: {
    typegen: process.cwd() + '/pages/api/nexus-typegen.ts',
    schema: process.cwd() + '/pages/api/schema.graphql'
  }
});

const apolloServer = new ApolloServer({
  schema,
  context(ctx) {
    ctx.user = { name: 'De baas' };
    return ctx;
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default apolloServer.createHandler({ path: '/api' });
