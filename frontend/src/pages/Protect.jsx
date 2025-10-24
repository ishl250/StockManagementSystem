// // import { useEffect, useState } from 'react'
// // import { useNavigate } from 'react-router-dom'

// // function Protect({ children }) {
// //   const [loading, setLoading] = useState(true)
// //   const [authenticated, setAuthenticated] = useState(false)
// //   const navigate = useNavigate()

// //   useEffect(() => {
// //     const checkAuth = async () => {
// //       try {
// //         const res = await fetch('http://localhost:3000/api/check-auth', {
// //           credentials: 'include', // important for session cookies
// //         })

// //         if (res.ok) {
// //           setAuthenticated(true)
// //         } else {
// //           navigate('/login')
// //         }
// //       } catch (error) {
// //         console.error('Error checking auth:', error)
// //         navigate('/login')
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     checkAuth()
// //   }, [navigate])

// //   if (loading) {
// //     return <div className="text-center mt-10">Checking authentication...</div>
// //   }

// //   return authenticated ? children : null
// // }

// // export default Protect



// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Protect = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('http://localhost:3000/check-auth', { withCredentials: true })
//       .then(res => {
//         if (!res.data.authenticated) navigate('/login');
//         setLoading(false);
//       })
//       .catch(() => {
//         navigate('/login');
//       });
//   }, []);

//   if (loading) return <div className="text-center mt-10">Checking authentication...</div>;

//   return children;
// };

// export default Protect;



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Protect({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/check-auth', { withCredentials: true })
      .then(res => {
        if (!res.data.authenticated) {
          navigate('/'); 
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return children;
}


