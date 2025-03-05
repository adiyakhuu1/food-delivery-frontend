// import { useAuth } from "@clerk/nextjs";
// import { useEffect, useState } from "react";

// export const useTokenHook = () => {
//   const { getToken } = useAuth();
//   const [token, setToken] = useState<string>();
//   useEffect(() => {
//     const fetchData = async () => {
//       const tokeen = await getToken();
//       if (tokeen) {
//         setToken(tokeen);
//       }
//     };
//     fetchData();
//   }, [token]);
//   return { token };
// };
