// HeroSection.js

// import React from 'react';
// import hero from './img.png';

// const HeroSection = () => {
//   return (
//     <div className="bg-white text-black py-20 flex items-center">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Left side */}
//         <div className="w-1/2 pr-10">
//           <h1 className="text-4xl font-bold mb-4">Fully Managed Cloud & Web Hosting</h1>
//           <p className="text-lg mb-6">
//             Providing reliable and scalable hosting solutions for your business. Our fully
//             managed cloud services ensure high performance and security for your websites and
//             applications.
//           </p>
//           <button className="bg-blue-800 text-white px-6 py-2 rounded-full hover:bg-blue-600">
//             Get Started
//           </button>
//         </div>

//         {/* Right side */}
//         <div className="w-1/2">
//           <img
//             src={hero}
//             // Replace with the actual path to your laptop image
//             alt="Laptop"
//             className="w-full"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;







import React from 'react';
import hero from './img.png';

const Herosection = ({ onGetStartedClick }) => {
  return (
    <div className="bg-white text-black py-20 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side */}
        <div className="w-1/2 pr-10">
          <h1 className="text-4xl font-bold mb-4">Secure your files by using Blockchain cloud storage</h1>
          <p className="text-lg mb-6">
            Providing reliable and scalable hosting solutions for your business. Our fully
            managed cloud services ensure high performance and security for your websites and
            applications.
          </p>
          <button
            className="bg-blue-800 text-white px-6 py-2 rounded-full hover:bg-blue-600"
            onClick={onGetStartedClick}
          >
            Get Started
          </button>
        </div>

        {/* Right side */}
        <div className="w-1/2">
          <img
            src={hero}
            // Replace with the actual path to your laptop image
            alt="Laptop"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Herosection;
