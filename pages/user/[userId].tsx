import React from 'react';
import { withApollo } from '../../apollo/client';
import Router, { useRouter } from 'next/router';
import User from '../../components/User';

const UserPage = () => {
  const userId = parseInt(`${useRouter().query.userId}`);

  return (
    <div>
      <User userId={userId} />
    </div>
  );
};

export default withApollo(UserPage);
