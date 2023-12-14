// import { useState, useEffect } from "react";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@nextui-org/react";
// import SongDetail from "./SongDetail";

// const CLIENT_SECRET = "2fb5a9bb603a48aeadc6dfb28eeb00a0";
// const SPOTIFY_CLIENT_ID = "6abb9eac788d42e08c2a50e3f5ff4e53";
// const REDIRECT_URI = "http://localhost:5555/home";

// export default function SavedSongTable() {
//   const [savedTracks, setSavedTracks] = useState([]);

//   // Function to exchange authorization code for Spotify access token
//   const exchangeAuthorizationCode = async (code) => {
//     const response = await fetch("http://127.0.0.1:5556/token-exchange", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         grant_type: "authorization_code",
//         client_id: SPOTIFY_CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//         redirect_uri: REDIRECT_URI,
//         code: code,
//       }).toString(),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     return response.json();
//   };

//   useEffect(() => {
//     // Fetch data when the component mounts
//     const fetchData = async () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const authorizationCode = urlParams.get("code");

//       if (authorizationCode) {
//         try {
//           const data = await exchangeAuthorizationCode(authorizationCode);
//           setSavedTracks(data.tracks || []);
//         } catch (error) {
//           console.error("Error exchanging authorization code:", error);
//         }
//       } else {
//         // If no authorization code, redirect to Spotify for authorization
//         window.location.href = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
//           REDIRECT_URI
//         )}&scope=user-library-read&response_type=code&state=some-state`;
//       }
//     };

//     fetchData();
//   }, []); // Removed exchangeAuthorizationCode from the dependency array

//   return (
//     <>
//       <Table
//         color="default"
//         selectionMode=" "
//         defaultSelectedKeys={[]}
//         aria-label="Example static collection table"
//       >
//         <TableHeader>
//           <TableColumn>Song Title</TableColumn>
//           <TableColumn>Artist</TableColumn>
//           <TableColumn>Album</TableColumn>
//         </TableHeader>
//         <TableBody>
//           {savedTracks.map((track, index) => (
//             <TableRow
//               key={track.id}
//               onClick={() => <SongDetail track={track} />}
//             >
//               <TableCell>{track.track_title}</TableCell>
//               <TableCell>{track.artist_name}</TableCell>
//               <TableCell>{track.album_name}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </>
//   );
// }
// import React, { useEffect, useState } from "react";

// const SpotifyAuth = () => {
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const client_secret = "2fb5a9bb603a48aeadc6dfb28eeb00a0";
//     const client_id = "6abb9eac788d42e08c2a50e3f5ff4e53";
//     const encodedCredentials = btoa(`${client_id}:${client_secret}`);

//     fetch("https://accounts.spotify.com/api/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Authorization: `Basic ${encodedCredentials}`,
//       },
//       body: "grant_type=client_credentials",
//     })
//       .then((response) => response.json())
//       .then((data) => setToken(data.access_token))
//       .catch((error) => console.error("Error:", error));
//   }, []);

//   return <div>{token ? `Token: ${token}` : "Fetching token..."}</div>;
// };

// export default SpotifyAuth;
// import { useEffect, useState } from "react";
// import SongDetail from "./SongDetail";

// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@nextui-org/react";

// const client_id = "6abb9eac788d42e08c2a50e3f5ff4e53";
// const redirect_uri = "http://localhost:5555/home";
// const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(
//   redirect_uri
// )}&scope=user-library-read&response_type=code&state=some-state`;

// const SavedSongTable = () => {
//   const [savedTracks, setSavedTracks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [accessToken, setAccessToken] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://api.spotify.com/v1/me/tracks", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setSavedTracks(data.items || []);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching user's saved tracks:", error);
//       }
//     };

//     if (accessToken) {
//       fetchData();
//     }
//   }, [accessToken]);

//   useEffect(() => {
//     // Function to extract the authorization code from the URL
//     const getAuthorizationCode = () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       return urlParams.get("code");
//     };

//     const authorizationCode = getAuthorizationCode();

//     if (authorizationCode) {
//       // Exchange the authorization code for an access token
//       fetch("http://127.0.0.1:5556/token-exchange", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           grant_type: "authorization_code",
//           client_id: "6abb9eac788d42e08c2a50e3f5ff4e53",
//           redirect_uri: "http://localhost:5555/home",
//           code: authorizationCode,
//         }).toString(),
//       })
//         .then((response) => response.json())
//         .then((data) => setAccessToken(data.access_token))
//         .catch((error) =>
//           console.error("Error exchanging authorization code:", error)
//         );
//     } else {
//       // Redirect the user to Spotify for authentication
//       window.location.href = SPOTIFY_AUTH_URL;
//     }
//   }, []);

//   if (loading) {
//     return <div>Loading tracks...</div>;
//   }

//   if (!Array.isArray(savedTracks)) {
//     console.log("savedTracks is not an array:", savedTracks);
//     return <div>Error loading tracks</div>;
//   }

//   if (savedTracks.length === 0) {
//     return <div>No saved tracks found</div>;
//   }

//   return (
//     <>
//       <Table
//         color="default"
//         selectionMode=" "
//         defaultSelectedKeys={[]}
//         aria-label="Example static collection table"
//       >
//         <TableHeader>
//           <TableColumn>Song Title</TableColumn>
//           <TableColumn>Artist</TableColumn>
//           <TableColumn>Album</TableColumn>
//         </TableHeader>
//         <TableBody>
//           {savedTracks.map((track) => (
//             <TableRow key={track.track.id} onClick={() => SongDetail(track)}>
//               <TableCell>{track.track.name}</TableCell>
//               <TableCell>{track.track.artists[0].name}</TableCell>
//               <TableCell>{track.track.album.name}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </>
//   );
// };

// export default SavedSongTable;

import React, { useEffect } from "react";

const SpotifyAuth = () => {
  const client_secret = "2fb5a9bb603a48aeadc6dfb28eeb00a0";
  const client_id = "6abb9eac788d42e08c2a50e3f5ff4e53";
  const redirect_uri = "http://localhost:5555/home";

  useEffect(() => {
    // Function to extract the authorization code from the URL
    const getAuthorizationCode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("code");
    };

    const authorizationCode = getAuthorizationCode();
    console.log(authorizationCode);

    if (authorizationCode) {
      // Exchange the authorization code for an access token
      const authOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(client_id + ":" + client_secret),
        },
        body: new URLSearchParams({
          code: authorizationCode,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code",
        }).toString(),
      };
      console.log("Auth Options:", authOptions);

      fetch("https://accounts.spotify.com/api/token", authOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          console.log("Access Token:", data.access_token);
          console.log("Refresh Token:", data.refresh_token);
          // Handle the tokens as needed (e.g., store in state, redirect, etc.)
        })
        .catch((error) => {
          console.error("Error exchanging authorization code:", error);
          // Handle the error as needed (e.g., redirect with an error message)
        });
    } else {
      // Handle case where no authorization code is present
      console.error("No authorization code found");
    }
  }, []); // Empty dependency array to run the effect only once

  return <div>Spotify Authentication</div>;
};

export default SpotifyAuth;
