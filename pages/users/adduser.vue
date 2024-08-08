<template>
  <v-col>
    <v-card height="100vh" outlined style="border-color: black" class="pa-5">
      <v-row no-gutters>
        <v-col class="col-12 mb-5">
          <div><v-icon left>mdi-account-plus</v-icon>ເພີ່ມຜູ້ດູເເລລະບົບ</div>
        </v-col>

        <v-col cols="6" class="pr-3">
          <v-text-field
            v-model="formData.firstname"
            label="ຊື່ເເທ້"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pl-3">
          <v-text-field
            v-model="formData.lastname"
            label="ນາມສະກຸນ"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pr-3">
          <v-text-field
            v-model="formData.email"
            label="ອີເມວ"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pl-3">
          <v-text-field
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            label="ລະຫັດ"
            outlined
          >
            <template v-slot:append>
              <v-icon @click="togglePasswordVisibility">
                {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="6" class="pr-3">
          <v-select
            v-model="formData.gender"
            :items="genders"
            label="ເພດ"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="6" class="pl-3">
          <v-text-field
            v-model="formData.tel"
            label="ເບີໂທລະສັບ"
            outlined
            :rules="[phoneNumberRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pr-3">
          <v-text-field
            v-model="formData.user_type"
            label="ປະເພດຜູ້ໃຊ້ລະບົບ"
            outlined
            readonly
          ></v-text-field>
        </v-col>

        <v-col cols="6" class="pl-3">
          <v-text-field
            v-model="formData.status"
            label="ສະຖານະ"
            outlined
            readonly
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-btn color="success" @click="addUser">ບັນທຶກ</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn color="error" @click="$router.push('/users')">ຍົກເລີກ</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>
<script>
import { gql } from '@apollo/client/core'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      formData: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        user_type: 'ຜູ້ດູເເລລະບົບ', // Fixed to 'admin'
        gender: '',
        tel: '',
        status: 'ເປີດໃຊ້ງານ', // Show 'Active' but store 1
      },
      userTypes: ['user', 'admin'],
      genders: ['ຊາຍ', 'ຍິງ', 'ອື່ນໆ'],
      showPassword: false,
      phoneNumberRule: (v) =>
        /^(\+85620)\s?\d{8}$/.test(v) ||
        'Phone number must be in format +85620 xxxxxxxx',
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    async addUser() {
      try {
        // Validate phone number format
        if (!this.phoneNumberRule(this.formData.tel)) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Phone Number',
            text: 'Phone number must be in format +85620 xxxxxxxx',
          })
          return
        }

        Swal.fire({
          title: 'Adding User...',
          didOpen: () => {
            Swal.showLoading()
          },
          allowOutsideClick: false,
        })

        // Create user in Firebase
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.formData.email,
          this.formData.password
        )
        const firebaseUser = userCredential.user

        // Add user to Hasura
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation AddUser(
              $firebase_id: String!
              $firstname: String!
              $lastname: String!
              $email: String!
              $user_type: String!
              $gender: String!
              $tel: String!
              $status: Int!
            ) {
              insert_users(
                objects: {
                  firebase_id: $firebase_id
                  firstname: $firstname
                  lastname: $lastname
                  email: $email
                  user_type: $user_type
                  gender: $gender
                  tel: $tel
                  status: $status
                }
              ) {
                affected_rows
                returning {
                  user_id
                  firstname
                  lastname
                  email
                  user_type
                  gender
                  tel
                  status
                }
              }
            }
          `,
          variables: {
            firebase_id: firebaseUser.uid,
            firstname: this.formData.firstname,
            lastname: this.formData.lastname,
            email: this.formData.email,
            user_type: 'admin',
            gender: this.formData.gender,
            tel: this.formData.tel,
            status: 1, // Store 1 for active
          },
        })

        Swal.fire({
          icon: 'success',
          title: 'ເພີ່ມຜູ້ດູເເລລະບົບສໍາເລັດ',
          showConfirmButton: false,
          timer: 1500,
        })

        this.$router.push('/users')

        // Reset form
        this.formData = {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          user_type: 'ຜູ້ດູເເລລະບົບ',
          gender: '',
          tel: '',
          status: 'ເປີດໃຊ້ງານ',
        }
      } catch (error) {
        console.error('Error adding user:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error Adding User',
          text: error.message,
        })
      }
    },
  },
}
</script>
