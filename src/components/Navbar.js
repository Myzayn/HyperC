// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import CopyToClipboardButton from "./CopyToClipboardButton";
// import logo from "./logo.png"
// import './Navbar.css'

// const Navbar = () => {
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [walletAddress, setWalletAddress] = useState("");
//   const [accountBalance, setAccountBalance] = useState("");

//   const connectWallet = async () => {
//     try {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const address = await signer.getAddress();
//         setWalletAddress(address);

//         // Fetch the account balance
//         const balance = await provider.getBalance(address);
//         const formattedBalance = ethers.utils.formatEther(balance);
//         setAccountBalance(Number(formattedBalance).toFixed(3)); // Set to 3 decimal places

//         setWalletConnected(true);
      
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//     }
//   };

//   useEffect(() => {
//     if (window.ethereum && window.ethereum.selectedAddress) {
//       setWalletConnected(true);
//       setWalletAddress(window.ethereum.selectedAddress);

//       // Fetch and set the account balance
//       connectWallet();
//     }
//   }, []);

//   return (
//     <nav className="bg-opacity-70 backdrop-blur-md backdrop-filter backdrop-saturate-150 bg-blue-500 p-4 flex justify-between items-center rounded-md">
//       <img  className="logo-pic" src={logo}/>
//       <div className="text-white">
//         {walletConnected ? (
//           <div>
//             <p>{accountBalance} ETH</p>
//             <p>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} <CopyToClipboardButton textToCopy={walletAddress} /></p>
            
//           </div>
//         ) : (
//           <p>Connect your wallet</p>
          
//         )}
//         <button
//         className="bg-white text-blue-500 px-4 py-2 rounded-md"
//         onClick={walletConnected ? null : connectWallet}
//         disabled={walletConnected}
//       >
//         {walletConnected ? "Connected" : "Connect"}
//       </button>
//       </div>
       
      
//     </nav>
//   );
// };

// export default Navbar;










import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CopyToClipboardButton from "./CopyToClipboardButton";
import logo from "./logo.png";
import './Navbar.css';

const Navbar = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      // Fetch the account balance
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.utils.formatEther(balance);
      setAccountBalance(Number(formattedBalance).toFixed(3)); // Set to 3 decimal places

      setWalletConnected(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWalletConnected(true);
      setWalletAddress(window.ethereum.selectedAddress);

      // Fetch and set the account balance
      connectWallet();
    }
  }, []);

  return (
    <nav className="bg-white p-4 flex justify-between items-center rounded-md">
      <div className="flex items-center space-x-4">
        <img className="logo-pic w-4 h-4" src={logo} alt="Logo" />
        <h1 className="text-black text-2xl font-bold">HyperCloud</h1>
      </div>
      <div className="text-black space-x-4 flex items-center">
        {walletConnected ? (
          <div className="flex items-center space-x-2">
            <p className="text-sm truncate">
              {walletAddress.slice(0, 5)}...
            <p className="text-sm">{accountBalance} ETH</p>
              {/* {walletAddress.slice(-4)}{" "} */}
              <CopyToClipboardButton textToCopy={walletAddress} />
            </p>
          </div>
        ) : (
          <p className="text-lg">Connect your wallet</p>
        )}
        <button
          className={`${
            walletConnected
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          } text-white px-4 py-2 rounded-md transition-all duration-300`}
          onClick={walletConnected ? null : connectWallet}
          disabled={walletConnected}
        >
          {walletConnected ? "Connected" : "Connect"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

