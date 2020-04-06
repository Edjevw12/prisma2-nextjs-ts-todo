import * as React from 'react';
import App from 'next/app';
import Layout from '../components/core/Layout';
import '../css/tailwind.css';

export default class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    );
  }
}
