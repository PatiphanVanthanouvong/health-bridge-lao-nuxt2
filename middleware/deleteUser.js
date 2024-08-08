// // middleware/deleteUser.js
// import admin from '/plugins/firebase-admin' // Adjust the path accordingly

// export default async function (req, res, next) {
//   const { userId } = req.body // Assuming userId is passed in the request body

//   try {
//     // Check if userId is provided
//     if (!userId) {
//       return res.status(400).json({ error: 'User ID is required.' })
//     }

//     // Delete the user from Firebase Authentication using Firebase Admin SDK
//     await admin.auth().deleteUser(userId)

//     // Respond with success
//     res.status(200).json({ message: 'User deleted successfully.' })
//   } catch (error) {
//     console.error('Error deleting user:', error)

//     // Handle error response
//     res.status(500).json({ error: 'Error deleting user.' })
//   }
// }
