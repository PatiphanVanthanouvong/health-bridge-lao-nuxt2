<template>
  <v-col>
    <v-card height="100vh" outlined style="border-color: black" class="pa-5">
      <v-row no-gutters>
        <v-col class="col-12 mb-5">
          <div><v-icon left>mdi-account-edit</v-icon>ແກ້ໄຂຜູ້ດູເເລລະບົບ</div>
        </v-col>

        <v-col cols="6" class="pr-3">
          <v-text-field
            v-model="formData.firstname"
            label="ຊື່"
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
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pl-3">
          <v-select
            v-model="formData.gender"
            :items="genders"
            label="ເພດ"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="6" class="pr-3">
          <v-text-field
            v-model="formData.tel"
            label="ເບີໂທ"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="6"></v-col>
        <v-col cols="6">
          <v-btn color="success" @click="updateUser">ບັນທຶກການປັບປຸງ</v-btn>
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
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      formData: {
        user_id: '',
        firstname: '',
        lastname: '',
        email: '',
        user_type: 'admin', // Default to admin and disabled for editing
        gender: '',
        tel: '',
        status: 1, // Default to active
      },
      genders: ['ຊາຍ', 'ຍິງ', 'ອື່ນໆ'], // Gender list in Lao
    }
  },
  methods: {
    async fetchUserDetails() {
      const userId = this.$route.query.user_id
      if (!userId) {
        this.$router.push('/users')
        return
      }

      try {
        const { data } = await this.$apollo.query({
          query: gql`
            query GetUser($user_id: uuid!) {
              users(where: { user_id: { _eq: $user_id } }) {
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
          `,
          variables: { user_id: userId },
          fetchPolicy: 'no-cache',
        })

        if (data.users.length === 0) {
          this.$router.push('/users')
          return
        }

        this.formData = { ...data.users[0] }
      } catch (error) {
        console.error('Error fetching user details:', error)
        this.$router.push('/users')
      }
    },
    async updateUser() {
      try {
        Swal.fire({
          title: 'ກຳລັງປັບປຸງຜູ້ໃຊ້',
          text: 'ກະລຸນາລໍຖ້າ...',
          icon: 'info',
          allowOutsideClick: false,
          showConfirmButton: false,
        })

        const { data } = await this.$apollo.mutate({
          mutation: gql`
            mutation UpdateUser(
              $user_id: uuid!
              $firstname: String!
              $lastname: String!
              $gender: String!
              $tel: String!
            ) {
              update_users(
                where: { user_id: { _eq: $user_id } }
                _set: {
                  firstname: $firstname
                  lastname: $lastname
                  gender: $gender
                  tel: $tel
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
            user_id: this.formData.user_id,
            firstname: this.formData.firstname,
            lastname: this.formData.lastname,
            gender: this.formData.gender,
            tel: this.formData.tel,
          },
        })

        console.log('Updated user:', data)

        // Show success message
        Swal.fire({
          title: 'ສຳເລັດ',
          text: 'ຜູ້ໃຊ້ໄດ້ປັບປຸງສົມບູນ',
          icon: 'success',
        })

        this.$router.push('/users')
      } catch (error) {
        console.error('Error updating user:', error)

        // Show error message
        Swal.fire({
          title: 'ຂໍ້ຜິດພາດ',
          text: 'ບໍ່ສາມາດປັບປຸງຜູ້ໃຊ້ໄດ້',
          icon: 'error',
        })
      }
    },
  },
  mounted() {
    this.fetchUserDetails()
  },
}
</script>
