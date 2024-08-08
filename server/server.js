// const express = require('express')
// const admin = require('firebase-admin')
// const bodyParser = require('body-parser')

// // Path to your service account key file
// const serviceAccount = require('./path/to/your/serviceAccountKey.json')

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// })

// const app = express()
// app.use(bodyParser.json())

// // Endpoint to delete a user
// app.post('/deleteUser', async (req, res) => {
//   const { firebaseId } = req.body

//   if (!firebaseId) {
//     return res.status(400).send('Firebase ID is required')
//   }

//   try {
//     await admin.auth().deleteUser(firebaseId)
//     res.status(200).send('User deleted successfully')
//   } catch (error) {
//     console.error('Error deleting user:', error)
//     res.status(500).send('Error deleting user')
//   }
// })

// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)
// })
