const {
  intArg,
  makeSchema,
  objectType,
  scalarType,
  stringArg,
  asNexusMethod,
} = require('nexus');
import { PrismaClient, tasksClient } from '@prisma/client';
import { booleanArg } from 'nexus';
// const { PrismaClient, tasksClient } = require('@prisma/client');

const prisma = new PrismaClient();

const Task = objectType({
  name: 'Task',
  definition(t) {
    t.int('id');
    t.string('title');
    t.date('createdAt');
    t.string('description');
    t.boolean('completed');
  },
});

const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.list.field('tasks', {
      type: 'Task',
      resolve: (parent) => {
        return prisma.users.findOne({ where: { id: parent.id } }).tasks();
      },
    });
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('user', {
      type: 'User',
      args: {
        userId: intArg({ nullable: false }),
      },
      resolve: async (_parent, args, ctx) => {
        return await prisma.users.findOne({ where: { id: args.userId } });
      },
    });
    t.list.field('users', {
      type: 'User',
      resolve: async (_parent, _args, ctx) => {
        return await prisma.users.findMany({ include: { tasks: { skip: 0 } } });
      },
    });
  },
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createTask', {
      type: 'Task',
      args: {
        title: stringArg({ nullable: false }),
        description: stringArg(),
        userId: intArg(),
      },
      resolve: async (_, { title, description, userId }, ctx) => {
        return await prisma.tasks.create({
          data: { title, description, users: { connect: { id: userId } } },
        });
      },
    });
    t.field('setCompleteTask', {
      type: 'Task',
      nullable: true,
      args: {
        taskId: intArg(),
        completed: booleanArg(),
      },
      resolve: async (_, { taskId, completed }, ctx) => {
        return await prisma.tasks.update({
          where: { id: taskId },
          data: { completed },
        });
      },
    });
  },
});

const DateType = scalarType({
  name: 'Date',
  serialize: (value) => value.getTime(),
  parseValue: (value) => new Date(value),
  parseLiteral: (ast) => (ast.kind === 'IntValue' ? new Date(ast.value) : null),
  asNexusMethod: 'date',
});

const schema = makeSchema({
  types: [Query, Mutation, User, Task, DateType],
  outputs: {
    typegen: process.cwd() + '/pages/api/nexus-typegen.ts',
    schema: process.cwd() + '/pages/api/schema.graphql',
  },
});

module.exports = {
  schema,
};
