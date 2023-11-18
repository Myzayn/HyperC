import React, { useState } from "react";
import { ethers } from "ethers";
import DStorageDapp from "../artifacts/contracts/DStorageDapp.sol/DStorageDapp.json";
import axios from "axios";
// import "./Upload.css";
import CopyToClipboardButton from "./CopyToClipboardButton";

const JWT = process.env.REACT_APP_JWT;
const dStorageDappAddress = process.env.REACT_APP_CONTRACT;

export const Upload = ({ userAddress }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [contract, setContract] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    try {
      if (!file) {
        setErrorMessage("Please choose a file to upload.");
        return;
      }

      setUploading(true);
      setSuccessMessage("");
      setErrorMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: JWT,
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGRlNzliMC02ZDQzLTRiMWEtYWNiMS1mN2E3MzYzZDhiZmUiLCJlbWFpbCI6InNodWphYWJyYXI3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMWNiYjkxMTU2MmI1OTE3ZjAyYSIsInNjb3BlZEtleVNlY3JldCI6IjFiODJkNWUyMDQ5MDFjMjVmMjRkNGIzOThiNWI3OTRhODRmNTFlNGYyNmU3OGIyNTMyMzBmNDFkODc2NmRmZTciLCJpYXQiOjE2OTgzOTAwNjR9.OmOhG4M1k0yhXSOc8DaRBwqVVd24MayEqfOIGsApMew",
          },
        }
      );

      if (response.status === 200) {
        const pinataUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        setSuccessMessage(`File uploaded successfully! IPFS URL: ${pinataUrl}`);

        // Call smart contract to store file details
        const totalFiles = await contract.uploadFile(response.data.IpfsHash);
        await totalFiles.wait();
      } else {
        setErrorMessage(
          `Failed to upload file. Status Code: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };







// import React, { useState, useEffect } from "react";
// import DStorageDapp from "../artifacts/contracts/DStorageDapp.sol/DStorageDapp.json";
// import { ethers } from "ethers";
// import axios from "axios";

// const JWT = process.env.REACT_APP_JWT;
// const dStorageDappAddress = process.env.REACT_APP_CONTRACT;

// <link
//   rel="stylesheet"
//   href="https://unpkg.com/flowbite@1.4.4/dist/flowbite.min.css"
// />;

// export const Upload = () => {
//   const [userAddress, setUserAddress] = useState(null);

//   useEffect(() => {
//     const checkMetaMask = async () => {
//       if (typeof window.ethereum !== "undefined") {
//         const accounts = await window.ethereum.request({
//           method: "eth_accounts",
//         });

//         if (accounts.length > 0) {
//           setUserAddress(accounts[0]);
//         }
//       }
//     };

//     checkMetaMask();
//   }, []);

  async function blockchainCall(e, res) {
    if (!userAddress) {
      console.error("MetaMask not connected!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      dStorageDappAddress,
      DStorageDapp.abi,
      signer
    );

    const upload = await contract.uploadFile(
      res.data.IpfsHash,
      res.data.PinSize,
      e.target.files[0].type.toString(),
      e.target.files[0].name.toString(),
      "fileDescription"
    );
    await upload.wait();
  }





  // const handleSubmission = async (e) => {
  //   if (!userAddress) {
  //     console.error("MetaMask not connected!");
  //     return;
  //   }

  //   const formData = new FormData();

  //   formData.append("file", e.target.files[0]);

  //   const metadata = JSON.stringify({
  //     name: e.target.files[0].name.toString(),
  //   });
  //   formData.append("pinataMetadata", metadata);

  //   const options = JSON.stringify({
  //     cidVersion: 0,
  //   });
  //   formData.append("pinataOptions", options);

  //   try {
  //     const res = await axios.post(
  //       "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //       formData,
  //       {
  //         maxBodyLength: "Infinity",
  //         headers: {
  //           "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
  //           Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGRlNzliMC02ZDQzLTRiMWEtYWNiMS1mN2E3MzYzZDhiZmUiLCJlbWFpbCI6InNodWphYWJyYXI3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMWNiYjkxMTU2MmI1OTE3ZjAyYSIsInNjb3BlZEtleVNlY3JldCI6IjFiODJkNWUyMDQ5MDFjMjVmMjRkNGIzOThiNWI3OTRhODRmNTFlNGYyNmU3OGIyNTMyMzBmNDFkODc2NmRmZTciLCJpYXQiOjE2OTgzOTAwNjR9.OmOhG4M1k0yhXSOc8DaRBwqVVd24MayEqfOIGsApMew",
  //         },
  //       }
  //     );
  //     console.log(res.data);
  //     blockchainCall(e, res).then(() => window.location.reload());
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  // const handleSubmission = async (e) => {
  //   // Check if MetaMask is connected
  //   if (!userAddress) {
  //     console.error("MetaMask not connected!");
  //     alert("Please connect to MetaMask before uploading files.");
  //     return;
  //   }
  
  //   // Proceed with file upload since MetaMask is connected
  //   const formData = new FormData();
  //   formData.append("file", e.target.files[0]);
  
  //   const metadata = JSON.stringify({
  //     name: e.target.files[0].name.toString(),
  //   });
  //   formData.append("pinataMetadata", metadata);
  
  //   const options = JSON.stringify({
  //     cidVersion: 0,
  //   });
  //   formData.append("pinataOptions", options);
  
  //   try {
  //     const res = await axios.post(
  //       "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //       formData,
  //       {
  //         maxBodyLength: "Infinity",
  //         headers: {
  //           "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
  //           Authorization: `Bearer ${JWT}`,
  //           Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGRlNzliMC02ZDQzLTRiMWEtYWNiMS1mN2E3MzYzZDhiZmUiLCJlbWFpbCI6InNodWphYWJyYXI3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMWNiYjkxMTU2MmI1OTE3ZjAyYSIsInNjb3BlZEtleVNlY3JldCI6IjFiODJkNWUyMDQ5MDFjMjVmMjRkNGIzOThiNWI3OTRhODRmNTFlNGYyNmU3OGIyNTMyMzBmNDFkODc2NmRmZTciLCJpYXQiOjE2OTgzOTAwNjR9.OmOhG4M1k0yhXSOc8DaRBwqVVd24MayEqfOIGsApMew",
  //         },
  //       }
  //     );
  //     console.log(res.data);
  //     blockchainCall(e, res).then(() => window.location.reload());
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  




  const handleSubmission = async (e) => {
    if (!userAddress) {
      console.error("MetaMask not connected!");
      // Display a message or take appropriate action
      alert("Please connect to MetaMask before uploading files.");
      return;
    }
  
    const formData = new FormData();
  
    formData.append("file", e.target.files[0]);
  
    const metadata = JSON.stringify({
      name: e.target.files[0].name.toString(),
    });
    formData.append("pinataMetadata", metadata);
  
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);
  
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGRlNzliMC02ZDQzLTRiMWEtYWNiMS1mN2E3MzYzZDhiZmUiLCJlbWFpbCI6InNodWphYWJyYXI3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMWNiYjkxMTU2MmI1OTE3ZjAyYSIsInNjb3BlZEtleVNlY3JldCI6IjFiODJkNWUyMDQ5MDFjMjVmMjRkNGIzOThiNWI3OTRhODRmNTFlNGYyNmU3OGIyNTMyMzBmNDFkODc2NmRmZTciLCJpYXQiOjE2OTgzOTAwNjR9.OmOhG4M1k0yhXSOc8DaRBwqVVd24MayEqfOIGsApMew",
          },
        }
      );
      console.log(res.data);
      blockchainCall(e, res).then(() => window.location.reload());
    } catch (error) {
      console.log(error);
    }
  };
  


  return (
    <div className="max-w-2xl mx-auto ">
      <div className="flex items-center glass-effect justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="glass-container flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
        >
          <div className="glass-content flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleSubmission}
          />
        </label>
      </div>
    </div>
  );
};


































// import React, { useState } from "react";

// import DStorageDapp from "../artifacts/contracts/DStorageDapp.sol/DStorageDapp.json";
// import { ethers } from "ethers";

// import axios from "axios";
// const JWT = process.env.REACT_APP_JWT;
// const dStorageDappAddress = process.env.REACT_APP_CONTRACT;

// <link
//   rel="stylesheet"
//   href="https://unpkg.com/flowbite@1.4.4/dist/flowbite.min.css"
// />;

// export const Upload = () => {
  

//   async function blockchainCall(e, res) {
//     if (typeof window.ethereum !== "undefined") {
//       // await requestAccount();
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);

//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(
//         dStorageDappAddress,
//         DStorageDapp.abi,
//         signer
//       );
//       const upload = await contract.uploadFile(
//         res.data.IpfsHash,
//         res.data.PinSize,
//         e.target.files[0].type.toString(),
//         e.target.files[0].name.toString(),
//         "fileDescription"
//       );
//       await upload.wait();
//     }
//   } 

//   const handleSubmission = async (e) => {
//     const formData = new FormData();

//     formData.append("file", e.target.files[0]);
//     console.log("qwertyuio", e.target.files[0]);

//     const metadata = JSON.stringify({
//       name: e.target.files[0].name.toString(),
//     });
//     formData.append("pinataMetadata", metadata);

//     const options = JSON.stringify({
//       cidVersion: 0,
//     });
//     formData.append("pinataOptions", options);

//     try {
//       const res = await axios.post(
//         "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         formData,
//         {
//           maxBodyLength: "Infinity",
//           headers: {
//             "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
//             Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGRlNzliMC02ZDQzLTRiMWEtYWNiMS1mN2E3MzYzZDhiZmUiLCJlbWFpbCI6InNodWphYWJyYXI3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMWNiYjkxMTU2MmI1OTE3ZjAyYSIsInNjb3BlZEtleVNlY3JldCI6IjFiODJkNWUyMDQ5MDFjMjVmMjRkNGIzOThiNWI3OTRhODRmNTFlNGYyNmU3OGIyNTMyMzBmNDFkODc2NmRmZTciLCJpYXQiOjE2OTgzOTAwNjR9.OmOhG4M1k0yhXSOc8DaRBwqVVd24MayEqfOIGsApMew",
//           },
//         }
//       );
//       console.log(res.data);
//       blockchainCall(e,res).then(()=> window.location.reload());
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto ">
//       <div className="flex items-center glass-effect justify-center w-full">
//         <label
//           htmlFor="dropzone-file"
//           className="glass-container flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
//         >
//           <div className="glass-content flex flex-col items-center justify-center pt-5 pb-6">
//             <svg
//               className="w-10 h-10 mb-3 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//               ></path>
//             </svg>
//             <p className="mb-2 text-sm text-gray-500">
//               <span className="font-semibold">Click to upload</span> or drag and
//               drop
//             </p>
//             <p className="text-xs text-gray-500">
//               SVG, PNG, JPG or GIF (MAX. 800x400px)
//             </p>
//           </div>
//           <input
//             id="dropzone-file"
//             type="file"
//             className="hidden"
//             onChange={handleSubmission}
//           />
//         </label>
//       </div>
     
//     </div>
//   );
// };















// import React, { useState } from "react";
// import { ethers } from "ethers";
// import DStorageDapp from "../artifacts/contracts/DStorageDapp.sol/DStorageDapp.json";
// import axios from "axios";
// import CopyToClipboardButton from "./CopyToClipboardButton";

// const JWT = process.env.REACT_APP_JWT;
// const dStorageDappAddress = process.env.REACT_APP_CONTRACT;

// export const Upload = ({ userAddress, connectWallet }) => {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [contract, setContract] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const uploadFile = async () => {
//     try {
//       if (!file) {
//         setErrorMessage("Please choose a file to upload.");
//         return;
//       }

//       setUploading(true);
//       setSuccessMessage("");
//       setErrorMessage("");

//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await axios.post(
//         "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGRlNzliMC02ZDQzLTRiMWEtYWNiMS1mN2E3MzYzZDhiZmUiLCJlbWFpbCI6InNodWphYWJyYXI3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMWNiYjkxMTU2MmI1OTE3ZjAyYSIsInNjb3BlZEtleVNlY3JldCI6IjFiODJkNWUyMDQ5MDFjMjVmMjRkNGIzOThiNWI3OTRhODRmNTFlNGYyNmU3OGIyNTMyMzBmNDFkODc2NmRmZTciLCJpYXQiOjE2OTgzOTAwNjR9.OmOhG4M1k0yhXSOc8DaRBwqVVd24MayEqfOIGsApMew",
//           },
//         }
//       );

//       if (response.status === 200) {
//         const pinataUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
//         setSuccessMessage(`File uploaded successfully! IPFS URL: ${pinataUrl}`);

//         // Call smart contract to store file details
//         const totalFiles = await contract.uploadFile(response.data.IpfsHash);
//         await totalFiles.wait();
//       } else {
//         setErrorMessage(
//           `Failed to upload file. Status Code: ${response.status}`
//         );
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setErrorMessage(`Error uploading file: ${error.message}`);
//     } finally {
//       setUploading(false);
//       setFile(null);
//     }
//   };

//   const blockchainCall = async (e, res) => {
//     if (!userAddress) {
//       console.error("MetaMask not connected!");
//       // Display a message or take appropriate action
//       alert("Please connect to MetaMask before uploading files.");
//       return;
//     }

//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(
//       dStorageDappAddress,
//       DStorageDapp.abi,
//       signer
//     );

//     const upload = await contract.uploadFile(
//       res.data.IpfsHash,
//       res.data.PinSize,
//       e.target.files[0].type.toString(),
//       e.target.files[0].name.toString(),
//       "fileDescription"
//     );
//     await upload.wait();
//   };

//   const handleSubmission = async (e) => {
//     if (!userAddress) {
//       console.error("MetaMask not connected!");
//       // Display a message or take appropriate action
//       alert("Please connect to MetaMask before uploading files.");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("file", e.target.files[0]);

//     const metadata = JSON.stringify({
//       name: e.target.files[0].name.toString(),
//     });
//     formData.append("pinataMetadata", metadata);

//     const options = JSON.stringify({
//       cidVersion: 0,
//     });
//     formData.append("pinataOptions", options);

//     try {
//       const res = await axios.post(
//         "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         formData,
//         {
//           maxBodyLength: "Infinity",
//           headers: {
//             "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
//             Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGRlNzliMC02ZDQzLTRiMWEtYWNiMS1mN2E3MzYzZDhiZmUiLCJlbWFpbCI6InNodWphYWJyYXI3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMWNiYjkxMTU2MmI1OTE3ZjAyYSIsInNjb3BlZEtleVNlY3JldCI6IjFiODJkNWUyMDQ5MDFjMjVmMjRkNGIzOThiNWI3OTRhODRmNTFlNGYyNmU3OGIyNTMyMzBmNDFkODc2NmRmZTciLCJpYXQiOjE2OTgzOTAwNjR9.OmOhG4M1k0yhXSOc8DaRBwqVVd24MayEqfOIGsApMew",
//           },
//         }
//       );
//       console.log(res.data);
//       blockchainCall(e, res).then(() => window.location.reload());
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="flex items-center glass-effect justify-center w-full">
//         <label
//           htmlFor="dropzone-file"
//           className="glass-container flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
//         >
//           <div className="glass-content flex flex-col items-center justify-center pt-5 pb-6">
//             <svg
//               className="w-10 h-10 mb-3 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//               ></path>
//             </svg>
//             <p className="mb-2 text-sm text-gray-500">
//               <span className="font-semibold">Click to upload</span> or drag and
//               drop
//             </p>
//             <p className="text-xs text-gray-500">
//               SVG, PNG, JPG, or GIF (MAX. 800x400px)
//             </p>
//           </div>
//           <input
//             id="dropzone-file"
//             type="file"
//             className="hidden"
//             onChange={handleSubmission}
//           />
//         </label>
//       </div>
//     </div>
//   );
// };

// export default Upload;
