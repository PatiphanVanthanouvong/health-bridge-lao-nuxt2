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
          :items="formattedFacilityTypes"
          striped
          :loading="loading"
          loading-text="ກະລຸນາລໍຖ້າ..."
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
        { text: 'ຊື່ພາສາລາວ', value: 'name_la' },
        { text: 'ຊື່ພາສາອັງກິດ', value: 'name_en' },
        { text: 'ປະເພດຍ່ອຍ', value: 'sub_type' },
      ],
      facilityTypes: [],
    }
  },
  methods: {
    async fetchFacilityTypes() {
      try {
        this.loading = true
        const { data } = await this.$apollo.query({
          query: gql`
            query {
              facility_type {
                name_en
                name_la
                sub_type
              }
            }
          `,
          fetchPolicy: 'no-cache',
        })
        this.facilityTypes = data.facility_type
      } catch (error) {
        console.error('Error fetching facility types:', error)
      } finally {
        this.loading = false
      }
    },
    exportToExcel() {
      const filteredData = this.facilityTypes.map((type) => ({
        ຊື່ພາສາລາວ: type.name_la,
        ຊື່ພາສາອັງກິດ: type.name_en,
        ປະເພດຍ່ອຍ: type.sub_type,
      }))

      const worksheet = XLSX.utils.json_to_sheet(filteredData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Facility_Types')
      XLSX.writeFile(workbook, 'Facility_Types_Report.xlsx')
    },
  },
  computed: {
    formattedFacilityTypes() {
      return this.facilityTypes
    },
  },
  mounted() {
    this.fetchFacilityTypes()
  },
}
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
