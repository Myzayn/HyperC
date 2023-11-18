import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import DStorageDapp from "../artifacts/contracts/DStorageDapp.sol/DStorageDapp.json";
import axios from "axios";
import "./Storage.css"; // Import your custom CSS file
import CopyToClipboardButton from './CopyToClipboardButton';
import eyeIcon from './eye.png';

const JWT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGRlNzliMC02ZDQzLTRiMWEtYWNiMS1mN2E3MzYzZDhiZmUiLCJlbWFpbCI6InNodWphYWJyYXI3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMWNiYjkxMTU2MmI1OTE3ZjAyYSIsInNjb3BlZEtleVNlY3JldCI6IjFiODJkNWUyMDQ5MDFjMjVmMjRkNGIzOThiNWI3OTRhODRmNTFlNGYyNmU3OGIyNTMyMzBmNDFkODc2NmRmZTciLCJpYXQiOjE2OTgzOTAwNjR9.OmOhG4M1k0yhXSOc8DaRBwqVVd24MayEqfOIGsApMew";
const dStorageDappAddress = process.env.REACT_APP_CONTRACT;
const handleViewOnIPFS = (ipfsHash) => {
  // Open the file on IPFS using window.open or any other method
  window.open(`https://ipfs.io/ipfs/${ipfsHash}`, '_blank');
};

export const Storage = ({ userAddress }) => {
  const [files, setFiles] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State to control delete confirmation popup
  const [fileToDelete, setFileToDelete] = useState(""); // State to store the file to be deleted
  const [contract, setContract] = useState(null); // State to store the contract instance
  const [search, setSearch] = useState("");


  useEffect(() => {
    const headers = {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGRlNzliMC02ZDQzLTRiMWEtYWNiMS1mN2E3MzYzZDhiZmUiLCJlbWFpbCI6InNodWphYWJyYXI3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMWNiYjkxMTU2MmI1OTE3ZjAyYSIsInNjb3BlZEtleVNlY3JldCI6IjFiODJkNWUyMDQ5MDFjMjVmMjRkNGIzOThiNWI3OTRhODRmNTFlNGYyNmU3OGIyNTMyMzBmNDFkODc2NmRmZTciLCJpYXQiOjE2OTgzOTAwNjR9.OmOhG4M1k0yhXSOc8DaRBwqVVd24MayEqfOIGsApMew",
    };

    if (search.length==0){

      axios
      .get(`https://api.pinata.cloud/data/pinList?status=pinned`, {
        headers,
      })
      .then((response) => {
        const pinnedFiles = response.data.rows;
        setFiles(pinnedFiles);
        console.log(pinnedFiles);
      })
      .catch((error) => {
        console.error("Error fetching pinned files from Pinata:", error);
      });
    }

    else{

      axios
      .get(`https://api.pinata.cloud/data/pinList?hashContains=${search}&status=pinned`, {
        headers,
      })
      .then((response) => {
        const pinnedFiles = response.data.rows;
        setFiles(pinnedFiles);
        console.log(pinnedFiles);
      })
      .catch((error) => {
        console.error("Error fetching pinned files from Pinata:", error);
      });
    }

    

    // Initialize the contract instance
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        dStorageDappAddress,
        DStorageDapp.abi,
        provider.getSigner() // Replace 0 with the index of your desired Ethereum wallet
      );
      setContract(contract);
    }
    console.log(search);
  }, [search]);

  const handleDelete = (CID) => {
    // Set the file to be deleted in state
    setFileToDelete(CID);
    // Show the delete confirmation popup
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const totalFiles = await contract.deleteFile(1);
      await totalFiles.wait();

      const options = {
        method: "DELETE",
        headers: {
          accept: "application/json",
          authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGRlNzliMC02ZDQzLTRiMWEtYWNiMS1mN2E3MzYzZDhiZmUiLCJlbWFpbCI6InNodWphYWJyYXI3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMWNiYjkxMTU2MmI1OTE3ZjAyYSIsInNjb3BlZEtleVNlY3JldCI6IjFiODJkNWUyMDQ5MDFjMjVmMjRkNGIzOThiNWI3OTRhODRmNTFlNGYyNmU3OGIyNTMyMzBmNDFkODc2NmRmZTciLCJpYXQiOjE2OTgzOTAwNjR9.OmOhG4M1k0yhXSOc8DaRBwqVVd24MayEqfOIGsApMew",
        },
      };

      // Make the DELETE request
      const response = await fetch(
        `https://api.pinata.cloud/pinning/unpin/${fileToDelete}`,
        options
      );

      if (response.status === 200) {
        // The response is a success (status code 200)
        alert(`File with CID ${fileToDelete} deleted successfully.`);
        // Reload the page to reflect the changes
        window.location.reload();
      } else {
        // The response is not a success, and we treat it as an error
        alert(
          `Failed to delete file with CID ${fileToDelete}. Status Code: ${response.status}`
        );
      }

      // Close the delete confirmation popup
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting file:", error);
      alert(`Error deleting file: ${error.message}`);
    }
  };

  const cancelDelete = () => {
    // Close the delete confirmation popup
    setShowDeleteConfirmation(false);
    // Reset the file to be deleted
    setFileToDelete("");
  };




  



  return (
    <div className="storage-container">
      {files.length > 0 ? (
        <div class="w-[40%] mx-auto rounded-lg bg-gray-200 p-3 my-5">
          <div class="flex">
            <div class="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white p-5">
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                class="pointer-events-none absolute w-5 fill-gray-500 transition"
              >
                <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
              </svg>
            </div>
            <input
              type="text"
              class="w-full bg-white text-black pl-2 text-base font-semibold outline-0"
              placeholder="Search Files"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="table-container">
        <table>
          {/* setSearch */}

          <thead>
            <tr>
              <th>Name</th>
              <th>CID</th>             
              <th>Date</th>
              <th>Size</th>
              <th>View</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td>
                  <p className="table-cell-text">{file.metadata.name}</p>
                </td>
                <td>
                  <p className="table-cell-text">
                    <a
                      href={
                        file.ipfs_pin_hash
                          ? `https://ipfs.io/ipfs/${file.ipfs_pin_hash}`
                          : ""
                      }
                    >
                      {file.ipfs_pin_hash
                        ? `${file.ipfs_pin_hash.slice(
                            0,
                            5
                          )}...${file.ipfs_pin_hash.slice(-4)}`
                        : "0x000"}
                    </a>
                  </p>
                  <div>
                    <CopyToClipboardButton textToCopy={file.ipfs_pin_hash} />
                                  
                  </div>
                </td>
                
                <td>
                  <p className="table-cell-text">
                    {new Date(file.date_pinned).toUTCString()}
                  </p>
                </td>
                <td>
                  <p className="table-cell-text">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </td>
                <td>
                <img
                    src={eyeIcon}
                    alt="View on IPFS"
                    className="eye-icon"
                    onClick={() => handleViewOnIPFS(file.ipfs_pin_hash)}
                  />
                </td>

                <td>
                  <button className="delete-btn" onClick={() => handleDelete(file.ipfs_pin_hash)}>
                    Delete
                  </button>
                </td>  
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>

      {showDeleteConfirmation && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  {/* Background overlay */}
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  {/* This element is to trick the browser into centering the modal contents. */}
                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                  <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                  >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3
                            className="text-lg leading-6 font-medium text-gray-900"
                            id="modal-headline"
                          >
                            Are you sure you want to delete the file with CID{" "}
                            {fileToDelete.slice(0, 5)}...{fileToDelete.slice(-4)}?
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        onClick={confirmDelete}
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Yes
                      </button>
                      <button
                        onClick={cancelDelete}
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
      
    </div>
  );
};
