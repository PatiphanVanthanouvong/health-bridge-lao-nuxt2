<template>
  <v-col>
    <v-card height="100vh" width="100vw" class="mx-auto">
      <v-col>
        <v-row class="d-flex justify-space-between align-center mb-6">
          <!-- Title -->
          <v-col cols="auto">
            <div class="text-h5 font-weight-bold">ລາຍລະອຽດຜູ້ດູເເລລະບົບ</div>
          </v-col>

          <!-- Buttons section -->
          <v-col cols="auto" v-if="userData">
            <div>
              <v-btn color="success" large dark @click="navigateToEditUser">
                <v-icon>mdi-pencil</v-icon>
                ເເກ້ໄຂ
              </v-btn>
              <v-btn
                :color="userData.status === 1 ? 'warning' : 'success'"
                large
                dark
                @click="toggleUserStatus"
              >
                <v-icon>
                  {{
                    userData.status === 1 ? 'mdi-account-off' : 'mdi-account'
                  }}
                </v-icon>
                {{ userData.status === 1 ? 'ປິດໃຊ້ງານ' : 'ເປີດໃຊ້ງານ' }}
              </v-btn>
              <v-btn color="error" large dark @click="deleteUserAdmin">
                <v-icon>mdi-delete-forever</v-icon>
                ລືບ
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-divider height="10" color="black"></v-divider>

        <v-divider height="10"></v-divider>
        <v-row v-if="userData" class="my-auto">
          <v-col cols="4">
            <div class="font-weight-bold">ຊື່ເເທ້</div>
            <div style="font-size: 16px">{{ userData.firstname }}</div>
          </v-col>
          <v-col cols="4">
            <div class="font-weight-bold">ນາມສະກຸນ</div>
            <div>{{ userData.lastname }}</div>
          </v-col>
          <v-col cols="4">
            <div class="font-weight-bold">ລະຫັດຕົວຕົນ</div>
            <div style="font-size: 16px">{{ userData.user_id }}</div>
          </v-col>
        </v-row>
        <v-divider height="10"></v-divider>
        <v-row v-if="userData" class="my-auto">
          <v-col cols="4">
            <div class="font-weight-bold">ອິເມວ</div>
            <div>{{ userData.email }}</div>
          </v-col>
          <v-col cols="4">
            <div class="font-weight-bold">ເບິໂທລະສັບ</div>
            <div>{{ userData.tel }}</div>
          </v-col>
          <v-col cols="4">
            <div class="font-weight-bold">
              ລະຫັດຜ່ານ
              <i
                class="mdi"
                :class="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click="showPassword = !showPassword"
              ></i>
            </div>

            <div class="password-field">
              <div v-if="showPassword">{{ userData.password }}</div>
              <div v-else>••••••••</div>
            </div>
          </v-col>
        </v-row>
        <v-divider height="10"></v-divider>
        <v-row v-if="userData" class="my-auto">
          <v-col cols="4">
            <div class="font-weight-bold">ເພດ</div>
            <div>{{ userData.gender }}</div>
          </v-col>
          <v-col cols="8">
            <div class="font-weight-bold">ສະຖານະ</div>
            <div>{{ userData.status === 1 ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ' }}</div>
          </v-col>
        </v-row>
        <v-divider height="10"></v-divider>
        <v-row v-if="!userData">
          <v-col cols="12" class="text-center">
            <custom-loading></custom-loading>
          </v-col>
        </v-row>

        <v-col cols="6" class="my-10">
          <div>
            <v-btn
              @click="$router.push('/users')"
              style="font-weight: bold; font-size: 18px"
              >ກັບຄືນ</v-btn
            >
          </div>
        </v-col>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { gql } from '@apollo/client/core'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      userData: null,
      errorMessage: '',
      errorDialog: false,
      showPassword: false, // Track visibility of password
    }
  },
  methods: {
    // Navigation method
    navigateToEditUser() {
      this.$router.push({
        path: '/users/edituser',
        query: { user_id: this.$route.query.user_id },
      })
    },

    // Delete user method
    async deleteUserAdmin() {
      const userId = this.$route.query.user_id

      if (!userId) {
        this.errorMessage = 'No user ID provided.'
        this.errorDialog = true
        return
      }

      try {
        // Delete the user from your database (Hasura)
        const deleteData = await this.$apollo.mutate({
          mutation: gql`
            mutation DeleteUser($user_id: uuid!) {
              delete_users(where: { user_id: { _eq: $user_id } }) {
                affected_rows
              }
            }
          `,
          variables: { user_id: userId },
          fetchPolicy: 'no-cache',
        })

        console.log(deleteData)

        // Show success message with SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'User Deleted Successfully',
          text: 'The user has been deleted successfully.',
        })

        // Redirect to users list
        this.$router.push('/users')
      } catch (error) {
        console.error('Error deleting user:', error)

        // Show error message with SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error Deleting User',
          text: error.message || 'An error occurred while deleting user.',
        })

        this.errorMessage =
          error.message || 'An error occurred while deleting user.'
        this.errorDialog = true
      }
    },

    // Toggle user status method
    async toggleUserStatus() {
      const userId = this.$route.query.user_id
      const newStatus = this.userData.status === 1 ? 0 : 1

      if (!userId) {
        this.errorMessage = 'No user ID provided.'
        this.errorDialog = true
        return
      }

      try {
        // Update the user's status in the database (Hasura)
        const toggleData = await this.$apollo.mutate({
          mutation: gql`
            mutation ToggleUserStatus($user_id: uuid!, $status: Int!) {
              update_users(
                where: { user_id: { _eq: $user_id } }
                _set: { status: $status }
              ) {
                affected_rows
              }
            }
          `,
          variables: { user_id: userId, status: newStatus },
          fetchPolicy: 'no-cache',
        })

        console.log(toggleData)

        // Show success message with SweetAlert
        Swal.fire({
          icon: 'success',
          title: `User ${
            newStatus === 1 ? 'Activated' : 'Suspended'
          } Successfully`,
          text: `The user has been ${
            newStatus === 1 ? 'activated' : 'suspended'
          } successfully.`,
        })

        // Update the userData status locally to reflect the change
        this.userData.status = newStatus
      } catch (error) {
        console.error(
          `Error ${newStatus === 1 ? 'activating' : 'suspending'} user:`,
          error
        )

        // Show error message with SweetAlert
        Swal.fire({
          icon: 'error',
          title: `Error ${newStatus === 1 ? 'Activating' : 'Suspending'} User`,
          text:
            error.message ||
            `An error occurred while ${
              newStatus === 1 ? 'activating' : 'suspending'
            } user.`,
        })

        this.errorMessage =
          error.message || 'An error occurred while suspending user.'
        this.errorDialog = true
      }
    },
  },
  created() {
    // Fetch user data on component creation
    const user_id = this.$route.query.user_id

    this.$apollo
      .query({
        query: gql`
          query GetUser($user_id: uuid!) {
            users(where: { user_id: { _eq: $user_id } }) {
              user_id
              email
              firstname
              lastname
              gender
              tel
              status
              password
            }
          }
        `,
        variables: {
          user_id: user_id,
        },
        fetchPolicy: 'no-cache',
      })
      .then((response) => {
        // Set the userData with the response data
        this.userData = response.data.users[0]
      })
      .catch((error) => {
        console.error('Error fetching user:', error)
        // Optionally, you can provide feedback to the user about the error
      })
  },
}
</script>
