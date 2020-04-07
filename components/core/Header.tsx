import Link from 'next/link';

const Header = () => (
  <nav className="flex text-white flex-row p-4 bg-indigo-700">
    <div className="cursor-pointer">
      <Link href="/">
        <p>Logo</p>
      </Link>
    </div>
    <div className=" ml-10">
      <div className="">
        <a href="/">Link</a>
      </div>
    </div>
  </nav>
);

export default Header;
