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
            <!-- Export button -->
            <div @click="exportToExcel">
              <v-btn color="primary" large dark>
                <v-icon>mdi-file-excel</v-icon>
                ອອກລາຍງານ Excel
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Data Table -->
        <v-data-table
          :search="search"
          :headers="headers"
          :items="services"
          :loading="loading"
          loading-text="Loading... Please wait"
          item-key="service_id"
        >
        </v-data-table>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { gql } from '@apollo/client/core'
import * as XLSX from 'xlsx'

export default {
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        { text: 'ຊື່ພາສາອັງກິດ', value: 'name_en' },
        { text: 'ຊື່ພາສາລາວ', value: 'name_la' },
        { text: 'ປະເພດ', value: 'type_name' },
        // { text: 'ຈັດການ', value: 'action', sortable: false },
      ],
      services: [],
    }
  },
  methods: {
    async fetchServices() {
      try {
        this.loading = true
        const { data } = await this.$apollo.query({
          query: gql`
            query services {
              services {
                name_en
                name_la
                service_id
                type_name
              }
            }
          `,
          fetchPolicy: 'no-cache',
        })
        this.services = data.services
      } catch (error) {
        console.error('Error fetching services:', error.message)
        // Handle error notification or logging as needed
      } finally {
        this.loading = false
      }
    },
    navigateToDetailPage(item) {
      this.$router.push({
        path: `/services/viewService`,
        query: { service_id: item.service_id },
      })
    },
    exportToExcel() {
      const filteredData = this.services.map((service) => ({
        ຊື່ພາສາອັງກິດ: service.name_en,
        ຊື່ພາສາລາວ: service.name_la,
        ປະເພດ: service.type_name,
      }))

      const worksheet = XLSX.utils.json_to_sheet(filteredData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Services')
      XLSX.writeFile(workbook, 'Services_Report.xlsx')
    },
  },
  mounted() {
    this.fetchServices()
  },
}
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
