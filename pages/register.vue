<template>
  <v-container
    fluid
    class="d-flex flex-wrap justify-center align-center"
    style="height: 100vh; background-color: cornflowerblue"
  >
    <v-card :loading="loading" elevation-10 style="border-radius: 10px">
      <v-card width="820px" height="auto" class="px-8 d-flex align-center">
        <!-- Image on the left side -->
        <img
          class="ma-10 mr-5"
          style="
            height: 200px;
            object-fit: cover;
            background-size: cover;
            background-position: center;
          "
          src="~/assets/logo.png"
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
            @submit.prevent="registerClient"
            ref="form"
            v-model="valid"
          >
            <v-col cols="12" class="pa-0 ma-0">
              <v-text-field
                v-model="formData.firstname"
                label="ຊື່ເເທ້"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-text-field
                v-model="formData.lastname"
                label="ນາມສະກຸນ"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-text-field
                v-model="formData.email"
                label="ອີເມວ"
                outlined
                required
                :rules="emailRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-text-field
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                label="ລະຫັດ"
                outlined
                required
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showPassword = !showPassword"
                :rules="passRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-select
                v-model="formData.gender"
                :items="genders"
                label="ເພດ"
                outlined
                required
              ></v-select>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-text-field
                v-model="formData.tel"
                label="ເບີໂທລະສັບ"
                outlined
                required
                :rules="[phoneNumberRule]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="ma-0 pa-0 d-flex flex-wrap justify-center">
              <v-btn
                color="primary"
                class="font-weight-black mr-4"
                type="submit"
                :loading="loading"
                >ບັນທຶກ</v-btn
              >
              <!-- Button to navigate to login page -->
              <v-btn
                color="secondary"
                class="font-weight-black"
                @click="goToLoginPage"
                >ຍົກເລີກ</v-btn
              >
            </v-col>
          </v-form>
        </div>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2'
import { gql } from '@apollo/client/core'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

export default {
  layout: 'no-nav', // Ensure it uses the 'no-nav' layout to remove app bar and drawer

  data() {
    return {
      formData: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        gender: '',
        tel: '',
      },
      genders: ['ຊາຍ', 'ຍິງ', 'ອື່ນໆ'],
      showPassword: false,
      loading: false,
      valid: true,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passRules: [
        (v) => !!v || 'Password is required',
        (v) =>
          (v && v.length >= 6) || 'Password must be more than 6 characters',
      ],
      phoneNumberRule: (v) =>
        /^(\+85620)\s?\d{8}$/.test(v) ||
        'Phone number must be in format +85620 xxxxxxxx',
    }
  },

  methods: {
    async registerClient() {
      const valid = await this.$refs.form.validate()

      try {
        if (valid) {
          this.loading = true

          // Create user in Firebase
          const auth = getAuth()
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            this.formData.email,
            this.formData.password
          )
          const firebaseUser = userCredential.user

          // Add user to Hasura
          const { data } = await this.$apollo.mutate({
            mutation: gql`
              mutation AddUser(
                $firebase_id: String!
                $firstname: String!
                $lastname: String!
                $email: String!
                $gender: String!
                $tel: String!
                $role: String!
                $status: Int!
                $password: String!
              ) {
                insert_users(
                  objects: {
                    firebase_id: $firebase_id
                    firstname: $firstname
                    lastname: $lastname
                    email: $email
                    gender: $gender
                    tel: $tel
                    user_type: $role
                    status: $status
                    password: $password
                  }
                ) {
                  affected_rows
                }
              }
            `,
            variables: {
              firebase_id: firebaseUser.uid,
              firstname: this.formData.firstname,
              lastname: this.formData.lastname,
              email: this.formData.email,
              gender: this.formData.gender,
              tel: this.formData.tel,
              role: 'client',
              status: 1,
              password: this.formData.password,
            },
          })

          if (data.insert_users.affected_rows === 1) {
            Swal.fire({
              icon: 'success',
              title: 'ສະມັກຜູ້ໃຊ້ສໍາເລັດ',
              showConfirmButton: false,
              timer: 1500,
            })

            this.$router.push('/login') // Redirect to login page after successful registration

            // Reset form
            this.formData = {
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              gender: '',
              tel: '',
            }
          } else {
            throw new Error('Failed to register user')
          }
        }
      } catch (error) {
        console.error('Error registering user:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error Registering User',
          text: error.message || 'An error occurred',
        })
      } finally {
        this.loading = false
      }
    },

    goToLoginPage() {
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
/* Custom styles specific to Register.vue */
</style>
