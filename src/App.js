// import "./App.css";
// import Navbar from "./components/Navbar";
// import { Storage } from "./components/Storage";
// import { Upload } from "./components/Upload";
// import  Herosection  from "./components/Herosection"


// function App() {
//   return (
//     <>
//     <div className="bg-gradient-mesh text-white min-h-screen">
//       <div className="bg-[#000000a0] min-h-screen">
//         <div>
//           <div>
//             <Navbar />
//           </div>
//           <div>
//             <Herosection />
//           </div>
//           <div className="p-4">
//             <Upload />
//           </div>
//           <Storage />
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }

// export default App;








// import React, { useState } from 'react';
// import "./App.css";
// import Navbar from "./components/Navbar";
// import { Storage } from "./components/Storage";
// import { Upload } from "./components/Upload";
// import Herosection from "./components/Herosection";

// function App() {
//   const [showUpload, setShowUpload] = useState(false);

//   const handleGetStartedClick = () => {
//     setShowUpload(true);
//   };

//   return (
//     <>
//       <div className="bg-gradient-mesh text-white min-h-screen">
//         <div className="bg-[#000000a0] min-h-screen">
//           <div>
//             <Navbar />
//           </div>
//           <div>
//             <Herosection onGetStartedClick={handleGetStartedClick} />
//           </div>
//           <div className="p-4">
//             {showUpload && <Upload />}
//           </div>
//           <Storage />
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;





// import React, { useState } from 'react';
// import "./App.css";
// import Navbar from "./components/Navbar";
// import { Storage } from "./components/Storage";
// import { Upload } from "./components/Upload";
// import Herosection from "./components/Herosection";

// function App() {
//   const [showUpload, setShowUpload] = useState(false);

//   const handleGetStartedClick = () => {
//     setShowUpload(true);
//   };

//   return (
//     <>
//       <div className="bg-gradient-mesh text-white min-h-screen">
//         <div className="bg-[#000000a0] min-h-screen">
//           <div>
//             <Navbar />
//           </div>
//           {!showUpload && (
//             <div>
//               <Herosection onGetStartedClick={handleGetStartedClick} />
//             </div>
//           )}
//           {showUpload && (
//             <div className="p-4">
//               <Upload />
//             </div>
//           )}
//           <Storage />
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;











// import React, { useState } from 'react';
// import "./App.css";
// import Navbar from "./components/Navbar";
// import { Storage } from "./components/Storage";
// import { Upload } from "./components/Upload";
// import Herosection from "./components/Herosection";

// function App() {
//   const [showContent, setShowContent] = useState(true);
//   const [showUpload, setShowUpload] = useState(false);

//   const handleGetStartedClick = () => {
//     setShowUpload(true);
//     setShowContent(false);
//   };

//   return (
//     <>
//       <div className="bg-gradient-mesh text-white min-h-screen">
//         <div className="bg-[#000000a0] min-h-screen">
//           <div>
//             <Navbar />
//           </div>
//           {showContent && (
//             <div>
//               <Herosection onGetStartedClick={handleGetStartedClick} />
//             </div>
//           )}
//           {showUpload && (
//             <div className="p-4">
//               <Upload />
//             </div>
//           )}
//           {showContent && (
//             <div>
//               <Storage />
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;






import React, { useState } from 'react';
import "./App.css";
import Navbar from "./components/Navbar";
import { Storage } from "./components/Storage";
import { Upload } from "./components/Upload";
import Herosection from "./components/Herosection";

function App() {
  const [showContent, setShowContent] = useState(true);

  const handleGetStartedClick = () => {
    setShowContent(false);
  };

  return (
    <>
      <div className="bg-gradient-mesh text-white min-h-screen">
        <div className="bg-[#000000a0] min-h-screen">
          <div>
            <Navbar />
          </div>
          {showContent && (
            <div>
              <Herosection onGetStartedClick={handleGetStartedClick} />
            </div>
          )}
          {!showContent && (
            <div className="p-4">
              <Upload />
            </div>
          )}
          {!showContent && (
            <div>
              <Storage />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
