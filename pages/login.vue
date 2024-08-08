<template>
  <v-container
    fluid
    class="d-flex flex-wrap justify-center align-center"
    style="height: 100vh; background-color: cornflowerblue"
  >
    <v-card :loading="loading" elevation-10 style="border-radius: 10px">
      <v-card width="820px" height="450px" class="px-8 d-flex align-center">
        <img
          class="ma-10 mr-5"
          style="
            height: 200px;
            object-fit: cover;
            background-size: cover;
            background-position: center;
          "
          :src="require('~/assets/logo.png')"
        />

        <div class="flex-grow-1">
          <div
            class="text-center font-weight-black my-2"
            style="font-size: 30px"
          >
            Health Bridge Laos Management
          </div>

          <v-form
            class="my-5 py-5"
            @submit.prevent="loginForm"
            ref="form"
            v-model="valid"
          >
            <v-col cols="12" class="pa-0 ma-0">
              <v-text-field
                v-model="email"
                placeholder="ອີເມວ"
                outlined
                required
                :rules="emailRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="ລະຫັດຜ່ານ"
                outlined
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showPassword = !showPassword"
                :rules="passRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="ma-0 pa-0 d-flex flex-wrap justify-center">
              <v-btn
                color="primary"
                class="font-weight-black mr-5"
                type="submit"
                :loading="loading"
              >
                ເຂົ້າສູ່ລະບົບ
              </v-btn>
              <v-btn
                color="secondary"
                class="font-weight-black ml-5"
                @click="goToRegisterPage"
              >
                ລົງທະບຽນ
              </v-btn>
            </v-col>
          </v-form>
        </div>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import mainMixins from '@/mixins/main'
import Swal from 'sweetalert2'
import { gql } from '@apollo/client/core'
import Cookies from 'js-cookie'

export default {
  layout: 'no-nav',
  mixins: [mainMixins],
  data() {
    return {
      email: '',
      password: '',
      valid: true,
      loading: false,
      showPassword: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passRules: [
        (v) => !!v || 'Password is required',
        (v) =>
          (v && v.length >= 6) || 'Password must be more than 6 characters',
      ],
    }
  },
  methods: {
    async loginForm() {
      const valid = await this.$refs.form.validate()

      try {
        if (valid) {
          this.loading = true

          const userStatus = await this.checkUserStatus()

          if (userStatus !== 1) {
            Swal.fire({
              icon: 'error',
              title: 'ບໍ່ສາມາດເຂົ້າສູ່ລະບົບໄດ້',
              text: 'ອີເມວນີ້ຖືກປິດການໃຊ້ງານ',
            })
            return
          }

          await this.$fire.auth.signInWithEmailAndPassword(
            this.email,
            this.password
          )

          const userType = await this.getUserType()
          console.log('User type:', userType)

          const userData = {
            email: this.email,
            userType: userType,
          }
          Cookies.set('userType', userData.userType)

          Swal.fire({
            icon: 'success',
            title: 'ທ່ານກໍາລັງຈະເຂົ້າສູ່ລະບົບ!',
          })

          if (userData.userType === 'client') {
            this.$router.push('/client/client_page')
          } else {
            this.$router.push('/fac-type')
          }
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: 'Please Check your email and password again!',
        })
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async checkUserStatus() {
      try {
        const { data } = await this.$apollo.query({
          query: gql`
            query GetUserStatus($email: String!) {
              users(where: { email: { _eq: $email } }) {
                status
              }
            }
          `,
          variables: { email: this.email },
        })

        if (data.users.length === 0) {
          Swal.fire({
            icon: 'error',
            title: 'ບໍ່ພົບຜູ້ໃຊ້',
            text: 'ອີເມວນີ້ບໍ່ພົບໃນລະບົບ',
          })
          return null
        }

        return data.users[0].status
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error checking user status',
          text:
            error.message || 'An error occurred while checking user status.',
        })
        console.error('Error checking user status:', error)
        return null
      }
    },

    async getUserType() {
      try {
        const { data } = await this.$apollo.query({
          query: gql`
            query GetUserType($email: String!) {
              users(where: { email: { _eq: $email } }) {
                user_type
              }
            }
          `,
          variables: { email: this.email },
        })
        console.log('Fetched user type:', data.users[0].user_type)
        return data.users[0].user_type
      } catch (error) {
        console.error('Error fetching user type:', error)
        return null
      }
    },

    goToRegisterPage() {
      this.$router.push('/register')
    },
  },
}
</script>
