import React from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const USERS_QUERY = gql`
  query USERS_QUERY {
    users {
      id
      firstName
      lastName
      tasks {
        title
        completed
      }
    }
  }
`;

const Users = () => {
  const { data, loading, error } = useQuery(USERS_QUERY);

  if (loading) return <p>Laden...</p>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-10">Gebruikers</h1>
      <div className=" mt-5">
        <table className="table-auto">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">Naam</th>
              <th className="px-4 py-2">Taken</th>
              <th className="px-4 py-2 ">Niet afgerond</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => {
              const tasks = user.tasks;

              return (
                <tr key={user.id}>
                  <td className="border px-4 py-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="border px-4 py-2">{user.tasks.length}</td>
                  <td className="border px-4 py-2">
                    {user.tasks.filter((task) => !task.completed).length}
                  </td>
                  <td className="border px-4 py-2">
                    <Link href={`/user/${user.id}`}>
                      <a className=" hover:text-orange-500">Bekijk taken</a>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
