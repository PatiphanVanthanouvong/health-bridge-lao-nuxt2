<template>
  <v-col>
    <v-card height="85vh" outlined style="border-color: black">
      <v-col>
        <v-row>
          <v-col cols="3">
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
          <v-col cols="3">
            <div>
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                dense
                outlined
                style="border-color: black"
                placeholder="Filter by Status"
              ></v-select>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <div @click="confirmExport">
              <v-btn color="primary" large dark>
                <v-icon>mdi-file-excel</v-icon>
                ອອກລາຍງານ Excel
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
        </v-data-table>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { gql } from '@apollo/client/core'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      search: '',
      loading: false,
      statusFilter: null,
      statusOptions: [
        { text: 'All', value: null },
        { text: 'ເປີດໃຊ້ງານ', value: 1 },
        { text: 'ປິດໃຊ້ງານ', value: 0 },
      ],
      headers: [
        { text: 'ອີເມວ', value: 'email' },
        { text: 'ຊື່ເເທ້', value: 'firstname' },
        { text: 'ນາມສະກຸນ', value: 'lastname' },
        { text: 'ເບີໂທລະສັບ', value: 'tel' },
        { text: 'ສະຖານະ', value: 'status' },
      ],
      users: [],
    }
  },
  methods: {
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
    async confirmExport() {
      const result = await Swal.fire({
        title: 'Confirm Export',
        text: 'Do you want to export the data to Excel?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, export it!',
        cancelButtonText: 'No, cancel',
      })

      if (result.isConfirmed) {
        this.exportToExcel()
      }
    },
    exportToExcel() {
      const filteredData = this.filteredAdmins.map((user) => ({
        Email: user.email,
        'First Name': user.firstname,
        'Last Name': user.lastname,
        Phone: user.tel,
        Status: user.status === 1 ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ',
      }))

      const worksheet = XLSX.utils.json_to_sheet(filteredData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Admins')
      XLSX.writeFile(workbook, 'Admins_Report.xlsx')
    },
  },
  computed: {
    filteredAdmins() {
      return this.users.filter((user) => {
        const matchesType = user.user_type === 'admin'
        const matchesStatus =
          this.statusFilter === null || user.status === this.statusFilter
        return matchesType && matchesStatus
      })
    },
  },
  mounted() {
    this.fetchUsers()
    console.log('mounted already')
  },
}
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
