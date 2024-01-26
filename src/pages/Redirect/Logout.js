// import React, { useEffect } from 'react';
// import Box from '@material-ui/core/Box';
// import config from 'config';

// function post(path, params, method = 'post') {
//   // The rest of this code assumes you are not using a library.
//   // It can be made less wordy if you use one.
//   const form = document.createElement('form');
//   form.method = method;
//   form.action = path;

//   for (const key in params) {
//     if (params.hasOwnProperty(key)) {
//       const hiddenField = document.createElement('input');
//       hiddenField.type = 'hidden';
//       hiddenField.name = key;
//       hiddenField.value = params[key];
//       form.appendChild(hiddenField);
//     }
//   }

//   document.body.appendChild(form);
//   form.submit();
// }

// export default function Logout() {
//   useEffect(() => {
//     localStorage.removeItem('token');
//     post(
//       `${config['oauth.logout_uri']}`,
//       {
//         redirect: config['oauth.login_uri']
//       },
//       'post'
//     );
//   }, []);
//   return <Box p={2}>Logging out...</Box>;
// }
