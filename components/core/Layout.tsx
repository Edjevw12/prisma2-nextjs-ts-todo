import Header from './Header';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

const theme = {
  black: '#1A1A1A',
  grey: '#f6f5f7'
};

const GlobalStyle = createGlobalStyle`
     html {
        box-sizing: border-box;
        font-size: 10px;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 1.4rem;
      color: '#f6f5f7';
    }
`;

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={{ ...theme }}>
      <Header />
      {children}
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default Layout;
