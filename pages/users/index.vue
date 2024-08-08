<template>
  <v-col>
    <v-card height="85vh" outlined style="border-color: black">
      <v-col>
        <v-row>
          <v-col cols="4">
            <div>
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                v-model="search"
                dense
                outlined
                style="border-color: black"
                placeholder="ຄົ້ນຫາ..."
              ></v-text-field>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <div @click="$router.push('/users/adduser')">
              <v-btn color="success" large dark>
                <v-icon>mdi-plus</v-icon>
                ເພີ່ມຜູ້ດູເເລລະບົບ
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-data-table
          :search="search"
          :headers="headers"
          :items="filteredAdmins"
          striped
          :loading="loading"
          loading-text="ກໍາລັງໂຫຼດ... ກະລຸນາລໍຖ້າ"
        >
          <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="item.status === 1 ? 'green' : 'red'" dark>
              {{ item.status === 1 ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ' }}
            </v-chip>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-icon
              @click="navigateToDetailPage(item)"
              class="mx-2"
              color="primary"
            >
              mdi-eye
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { gql } from '@apollo/client/core'

export default {
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        // { text: 'User ID', value: 'user_id' },
        { text: 'ອີເມວ', value: 'email' },
        { text: 'ຊື່ເເທ້', value: 'firstname' },
        { text: 'ນາມສະກຸນ', value: 'lastname' },
        // { text: 'Gender', value: 'gender' },
        { text: 'ເບີໂທລະສັບ', value: 'tel' },
        { text: 'ສະຖານະ', value: 'status' },
        // { text: 'User Type', value: 'user_type' },
        { text: 'ການຈັດການ', value: 'action', sortable: false },
      ],
      users: [],
    }
  },
  methods: {
    navigateToDetailPage(item) {
      this.$router.push({
        path: `/users/viewuser`,
        query: { user_id: item.user_id },
      })
    },
    async fetchUsers() {
      try {
        this.loading = true
        const { data } = await this.$apollo.query({
          query: gql`
            query MyQuery {
              users {
                email
                firebase_id
                firstname
                lastname
                gender
                password
                status
                tel
                user_id
                user_type
              }
            }
          `,
          fetchPolicy: 'no-cache',
        })
        this.users = data.users
        console.log('Fetched users:', this.users)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        this.loading = false
      }
    },
  },
  computed: {
    filteredAdmins() {
      return this.users.filter((user) => user.user_type === 'admin')
    },
  },
  mounted() {
    this.fetchUsers()
    console.log('mounted already')
  },
}
</script>

<style scoped></style>
