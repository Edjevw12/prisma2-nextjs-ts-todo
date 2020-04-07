import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const USER_QUERY = gql`
  query USER_QUERY($userId: Int!) {
    user(userId: $userId) {
      firstName
      lastName
      email
      tasks {
        id
        title
        createdAt
        description
        completed
      }
    }
  }
`;

const CREATE_TASK_MUTATION = gql`
  mutation CREATE_TASK_MUTATION(
    $userId: Int!
    $description: String!
    $title: String!
  ) {
    createTask(userId: $userId, description: $description, title: $title) {
      title
      completed
      description
    }
  }
`;

const TOGGLE_COMPLETE_MUTATION = gql`
  mutation TOGGLE_COMPLETE_MUTATION($taskId: Int!, $completed: Boolean!) {
    setCompleteTask(taskId: $taskId, completed: $completed) {
      title
    }
  }
`;

const DELETE_TASK_MUTATION = gql`
  mutation DELETE_TASK_MUTATION($taskId: Int!) {
    deleteTask(taskId: $taskId) {
      title
    }
  }
`;

const INITIAL_STATE = {
  title: '',
  description: '',
};

type Props = {
  userId: number;
};

type Todo = {
  title: String;
  description: String;
};

const User: React.FC<Props> = ({ userId }) => {
  const [todo, setTodo] = useState<Todo>(INITIAL_STATE);
  const { data, loading, error } = useQuery(USER_QUERY, {
    variables: {
      userId,
    },
  });

  const [createTask] = useMutation(CREATE_TASK_MUTATION, {
    onCompleted: () => setTodo(INITIAL_STATE),
    refetchQueries: ['USER_QUERY'],
  });

  const [deleteTask] = useMutation(DELETE_TASK_MUTATION, {
    refetchQueries: ['USER_QUERY'],
  });

  const [toggleComplete] = useMutation(TOGGLE_COMPLETE_MUTATION, {
    refetchQueries: ['USER_QUERY'],
  });

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    setTodo({ ...todo, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTask({
      variables: {
        ...todo,
        userId,
      },
    });
  };

  const handleToggle = (taskId: number, completed: boolean) => {
    event.preventDefault();
    toggleComplete({ variables: { taskId, completed: !completed } });
  };

  const handleDelete = (taskId: number) => {
    event.preventDefault();
    deleteTask({ variables: { taskId } });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex justify-center py-5">
      <div className="border-solid border-2 border-gray-300 w-5/12">
        <div className="my-6">
          <h2>
            {data.user.firstName} {data.user.lastName}
          </h2>
        </div>
        <div className="text-left">
          <p className="text-2xl">Niet afgerond:</p>
          <ul className="my-4 w-full">
            {data.user.tasks
              .filter((task) => !task.completed)
              .map((task) => (
                <li className="flex justify-between" key={task.id}>
                  <div>{task.title}</div>
                  <div
                    className="mr-10 font-bold text-green-600 text-2xl cursor-pointer"
                    onClick={() => handleToggle(task.id, task.completed)}
                  >
                    &#10003;
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className="text-left">
          <p className="text-2xl">Afgerond:</p>
          <ul className="my-4 w-full">
            {data.user.tasks
              .filter((task) => task.completed)
              .map((task) => (
                <li
                  className="flex justify-between text-green-600"
                  key={task.id}
                >
                  <div>{task.title}</div>
                  <div>
                    <div
                      onClick={() => handleToggle(task.id, task.completed)}
                      className="inline-block mr-4 font-bold text-2xl cursor-pointer text-orange-700"
                    >
                      &#8635;
                    </div>
                    <div
                      onClick={() => handleDelete(task.id)}
                      className="inline-block mr-10 font-bold text-2xl cursor-pointer text-red-700"
                    >
                      X
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="w-5/12 p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="flex items-start mb-4">
            <div className="w-1/4 mr-4">
              <label className="block uppercase font-bold tracking-wide text-gray-700">
                Taak
              </label>
            </div>
            <div className="w-3/4">
              <input
                value={`${todo.title}`}
                name="title"
                type="text"
                onChange={handleChange}
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-brand-purple-400  "
              />
            </div>
          </div>
          <div className="flex items-start  mb-4">
            <div className="w-1/4 mr-4">
              <label className="block uppercase font-bold tracking-wide text-gray-700">
                Omschrijving
              </label>
            </div>
            <div className="w-3/4">
              <textarea
                value={`${todo.description}`}
                onChange={handleChange}
                name="description"
                className="h-64 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-brand-purple-400  "
              />
            </div>
          </div>
          <div className="flex items-start mb-4">
            <div className="w-1/4 mr-4" />
            <div className="w3/4">
              <button type="submit" className="btn">
                Voeg taak toe
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default User;
