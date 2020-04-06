import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-100">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
