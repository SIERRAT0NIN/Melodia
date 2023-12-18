// import { useEffect } from "react";
// import { gsap } from "gsap";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// gsap.registerPlugin(MotionPathPlugin);

// const LoginBlob = () => {
//   useEffect(() => {
//     var radius = 8;
//     gsap.config(
//       ".blob",
//       4,
//       {
//         cycle: {
//           attr: function (i) {
//             var r = i * 90;
//             return {
//               transform:
//                 "rotate(" +
//                 r +
//                 ") translate(" +
//                 radius +
//                 ",0.1) rotate(" +
//                 -r +
//                 ")",
//             };
//           },
//         },
//       },
//       {
//         cycle: {
//           attr: function (i) {
//             var r = i * 90 + 360;
//             return {
//               transform:
//                 "rotate(" +
//                 r +
//                 ") translate(" +
//                 radius +
//                 ",0.1) rotate(" +
//                 -r +
//                 ")",
//             };
//           },
//         },
//         ease: "linear",
//         repeat: -1,
//       }
//     );
//   }, []);

//   return (
//     <div className="loading_cont">
//       <svg
//         version="1.1"
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 500 500"
//         width="300%"
//         id="blobSvg"
//         filter="blur(0px)"
//         style={{ opacity: 1, transform: "rotate(-150)" }}
//       >
//         <p className="test ">test</p>
//         <defs>
//           <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
//             <stop offset="0%" style={{ stopColor: "rgb(240, 67, 67)" }}></stop>
//             <stop offset="100%" style={{ stopColor: "rgb(82, 0, 56)" }}></stop>
//           </linearGradient>
//         </defs>

//         <path id="blob" fill="url(#gradient)" style={{ opacity: 1 }}>
//           <animate
//             attributeName="d"
//             dur="25s"
//             repeatCount="indefinite"
//             values="M384.02639,318.52969Q359.04619,387.05939,278.02474,435.01815Q197.0033,482.97691,137.94391,408.01485Q78.88453,333.05279,75.91422,249.0132Q72.94391,164.97361,138.46041,107.43731Q203.97691,49.90102,276.0132,88.41917Q348.04949,126.93731,378.52804,188.46866Q409.0066,250,384.02639,318.52969Z;M388.67097,319.27849Q360.55699,388.55699,291.23441,379.72688Q221.91183,370.89678,145.00645,354.28387Q68.10108,337.67097,71.32903,251.33548Q74.55699,165,142.39247,119.95591Q210.22796,74.91183,286.12043,91.61398Q362.0129,108.31613,389.39892,179.15806Q416.78495,250,388.67097,319.27849Z;M411.71818,339.87391Q393.61186,429.74783,302.23794,426.16285Q210.86403,422.57787,122.32727,388.31581Q33.79051,354.05375,61.55534,263.35692Q89.32016,172.66008,145.95613,107.46324Q202.59209,42.2664,289.95613,66.5581Q377.32016,90.8498,403.57233,170.4249Q429.82451,250,411.71818,339.87391Z;M384.02639,318.52969Q359.04619,387.05939,278.02474,435.01815Q197.0033,482.97691,137.94391,408.01485Q78.88453,333.05279,75.91422,249.0132Q72.94391,164.97361,138.46041,107.43731Q203.97691,49.90102,276.0132,88.41917Q348.04949,126.93731,378.52804,188.46866Q409.0066,250,384.02639,318.52969Z"
//           ></animate>
//         </path>
//         <path id="blob" fill="url(#gradient)" style={{ opacity: 0.9 }}>
//           <animate
//             attributeName="d"
//             dur="25s"
//             repeatCount="indefinite"
//             values="M429.79847,339.54154Q392.67727,429.08308,294.97368,455.00137Q197.27008,480.91966,143.94598,403.56786Q90.62188,326.21607,83.52769,246.22992Q76.43351,166.24376,136.8518,92.77008Q197.27008,19.29641,287.1482,55Q377.02632,90.70359,421.97299,170.3518Q466.91966,250,429.79847,339.54154Z;M388.67097,319.27849Q360.55699,388.55699,291.23441,379.72688Q221.91183,370.89678,145.00645,354.28387Q68.10108,337.67097,71.32903,251.33548Q74.55699,165,142.39247,119.95591Q210.22796,74.91183,286.12043,91.61398Q362.0129,108.31613,389.39892,179.15806Q416.78495,250,388.67097,319.27849Z;M411.71818,339.87391Q393.61186,429.74783,302.23794,426.16285Q210.86403,422.57787,122.32727,388.31581Q33.79051,354.05375,61.55534,263.35692Q89.32016,172.66008,145.95613,107.46324Q202.59209,42.2664,289.95613,66.5581Q377.32016,90.8498,403.57233,170.4249Q429.82451,250,411.71818,339.87391Z;M429.79847,339.54154Q392.67727,429.08308,294.97368,455.00137Q197.27008,480.91966,143.94598,403.56786Q90.62188,326.21607,83.52769,246.22992Q76.43351,166.24376,136.8518,92.77008Q197.27008,19.29641,287.1482,55Q377.02632,90.70359,421.97299,170.3518Q466.91966,250,429.79847,339.54154Z"
//           ></animate>
//         </path>
//       </svg>
//       <a href="http://127.0.0.1:5556/token-exchange">
//         <button className="bn632-hover bn19">Sign Into Spotify!</button>
//       </a>
//     </div>
//   );
// };

// export default LoginBlob;

// // <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" id="blobSvg" filter="blur(0px)" style="opacity: 1;" transform="rotate(-13)">                        <defs>                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">                            <stop offset="0%" style="stop-color: rgb(223, 67, 67);"></stop>                            <stop offset="100%" style="stop-color: rgb(82, 0, 56);"></stop>                        </linearGradient>                        </defs>                                            <path id="blob" fill="url(#gradient)" style="opacity: 0.9;"><animate attributeName="d" dur="25s" repeatCount="indefinite" values="M384.02639,318.52969Q359.04619,387.05939,278.02474,435.01815Q197.0033,482.97691,137.94391,408.01485Q78.88453,333.05279,75.91422,249.0132Q72.94391,164.97361,138.46041,107.43731Q203.97691,49.90102,276.0132,88.41917Q348.04949,126.93731,378.52804,188.46866Q409.0066,250,384.02639,318.52969Z;M388.67097,319.27849Q360.55699,388.55699,291.23441,379.72688Q221.91183,370.89678,145.00645,354.28387Q68.10108,337.67097,71.32903,251.33548Q74.55699,165,142.39247,119.95591Q210.22796,74.91183,286.12043,91.61398Q362.0129,108.31613,389.39892,179.15806Q416.78495,250,388.67097,319.27849Z;M411.71818,339.87391Q393.61186,429.74783,302.23794,426.16285Q210.86403,422.57787,122.32727,388.31581Q33.79051,354.05375,61.55534,263.35692Q89.32016,172.66008,145.95613,107.46324Q202.59209,42.2664,289.95613,66.5581Q377.32016,90.8498,403.57233,170.4249Q429.82451,250,411.71818,339.87391Z;M384.02639,318.52969Q359.04619,387.05939,278.02474,435.01815Q197.0033,482.97691,137.94391,408.01485Q78.88453,333.05279,75.91422,249.0132Q72.94391,164.97361,138.46041,107.43731Q203.97691,49.90102,276.0132,88.41917Q348.04949,126.93731,378.52804,188.46866Q409.0066,250,384.02639,318.52969Z"></animate></path><path id="blob" fill="url(#gradient)" style="opacity: 0.9;"><animate attributeName="d" dur="25s" repeatCount="indefinite" values="M429.79847,339.54154Q392.67727,429.08308,294.97368,455.00137Q197.27008,480.91966,143.94598,403.56786Q90.62188,326.21607,83.52769,246.22992Q76.43351,166.24376,136.8518,92.77008Q197.27008,19.29641,287.1482,55Q377.02632,90.70359,421.97299,170.3518Q466.91966,250,429.79847,339.54154Z;M388.67097,319.27849Q360.55699,388.55699,291.23441,379.72688Q221.91183,370.89678,145.00645,354.28387Q68.10108,337.67097,71.32903,251.33548Q74.55699,165,142.39247,119.95591Q210.22796,74.91183,286.12043,91.61398Q362.0129,108.31613,389.39892,179.15806Q416.78495,250,388.67097,319.27849Z;M411.71818,339.87391Q393.61186,429.74783,302.23794,426.16285Q210.86403,422.57787,122.32727,388.31581Q33.79051,354.05375,61.55534,263.35692Q89.32016,172.66008,145.95613,107.46324Q202.59209,42.2664,289.95613,66.5581Q377.32016,90.8498,403.57233,170.4249Q429.82451,250,411.71818,339.87391Z;M429.79847,339.54154Q392.67727,429.08308,294.97368,455.00137Q197.27008,480.91966,143.94598,403.56786Q90.62188,326.21607,83.52769,246.22992Q76.43351,166.24376,136.8518,92.77008Q197.27008,19.29641,287.1482,55Q377.02632,90.70359,421.97299,170.3518Q466.91966,250,429.79847,339.54154Z"></animate></path></svg>
