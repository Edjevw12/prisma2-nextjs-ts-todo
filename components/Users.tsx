import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const UserQuery = gql`
  query UserQuery {
    users {
      id
      firstName
      lastName
      tasks {
        title
      }
    }
  }
`;

const Users: React.FC = () => {
  const { data, loading, error } = useQuery(UserQuery);

  if (loading) return <p>Laden...</p>;
  return (
    <div>
      {data.users.map(user => (
        <li key={user.id}>
          {user.firstName} {user.lastName} - aantal taken: {user.tasks.length}
        </li>
      ))}
    </div>
  );
};

export default Users;
