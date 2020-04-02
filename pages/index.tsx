import React from 'react';
import Users from '../components/Users';
import { withApollo } from '../apollo/client';

const Home: React.FC = () => {
  return (
    <>
      <Users />
    </>
  );
};

export default withApollo(Home);
