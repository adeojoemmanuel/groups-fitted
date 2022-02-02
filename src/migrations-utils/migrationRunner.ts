// // var migrate = require('migrate')
// import * as migrate from 'migrate';
// import { DbStore } from './mongoStore';

// migrate.load(
//   {
//     stateStore: new DbStore(), // '.migrate'
//   },
//   (err, set): any => {
//     if (err) {
//       throw err;
//     }
//     set.up((error): any => {
//       if (error) {
//         throw error;
//       }
//       console.log('migrations successfully ran');
//     });
//   },
// );
