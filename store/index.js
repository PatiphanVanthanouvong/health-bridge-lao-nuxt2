// import Vue from 'vue'
// import Vuex from 'vuex'
// import Swal from 'sweetalert2'
// import { gql } from '@apollo/client/core'

// Vue.use(Vuex)

export const state = () => ({
  counter: 15,
})
// const createStore = () => {
//   return new Vuex.Store({
//     state: {
//       user: {
//         email: '',
//         userType: null,
//       },
//     },
//     mutations: {
//       setUser(state, userData) {
//         state.user = userData
//       },
//       clearUser(state) {
//         state.user = {
//           email: '',
//           userType: null,
//         }
//       },
//     },
//     actions: {
//       async login({ commit, dispatch }, { email, password }) {
//         try {
//           // Perform login logic here (using Firebase, GraphQL, etc.)
//           // Example using Firebase Authentication:
//           await this.$fire.auth.signInWithEmailAndPassword(email, password)

//           // Fetch user data after login
//           const userData = await dispatch('fetchUserData', email)

//           // Commit user data to Vuex store
//           commit('setUser', userData)

//           // Display success message (using SweetAlert2 for example)
//           Swal.fire({
//             icon: 'success',
//             title: 'Logged in successfully!',
//             showConfirmButton: false,
//             timer: 1500,
//           })

//           // Navigate to another page (e.g., '/fac-type')
//           this.$router.push('/fac-type')
//         } catch (error) {
//           console.error('Login error:', error)
//           // Display error message
//           Swal.fire({
//             icon: 'error',
//             title: 'Login Failed',
//             text: 'Please check your email and password.',
//           })
//         }
//       },

//       async fetchUserData({ commit }, email) {
//         try {
//           // Perform GraphQL query to fetch user data
//           const { data } = await this.$apollo.query({
//             query: gql`
//               query GetUser($email: String!) {
//                 users(where: { email: { _eq: $email } }) {
//                   email
//                   user_type
//                   status
//                 }
//               }
//             `,
//             variables: { email },
//           })

//           if (data.users.length === 0) {
//             throw new Error('User not found')
//           }

//           return {
//             email: data.users[0].email,
//             userType: data.users[0].user_type,
//             status: data.users[0].status,
//           }
//         } catch (error) {
//           console.error('Fetch user data error:', error)
//           throw error
//         }
//       },
//     },
//     getters: {
//       isLoggedIn: (state) => !!state.user.email,
//       userType: (state) => state.user.userType,
//     },
//   })
// }

// export default createStore
