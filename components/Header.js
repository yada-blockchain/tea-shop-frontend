import { ConnectButton } from "web3uikit";

const Header = () => {
  return (
    <div className="ml-auto py-4 px-4">
      <ConnectButton moralisAuth={false} />
    </div>
  );
};

export default Header;
