<template>
  <v-col>
    <v-card
      height="85vh"
      outlined
      style="border-color: black; position: relative"
    >
      <v-col>
        <v-row>
          <v-col cols="4">
            <div>
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                v-model="search"
                dense
                outlined
                label="ຄົ້ນຫາ..."
                style="border-color: black"
              ></v-text-field>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <div>
              <v-select
                v-model="selectedFacility"
                :items="facilities"
                item-text="name"
                item-value="fac_id"
                label="ເລືອກສະຖານທີ່"
                dense
                outlined
                style="border-color: black; min-width: 200px"
                @change="filterReviewsByFacility"
              >
                <template v-slot:prepend-item>
                  <v-list-item @click="resetFacility">
                    <v-list-item-content>
                      <v-list-item-title>Reset</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-select>
            </div>
          </v-col>
        </v-row>

        <v-data-table
          :search="search"
          :headers="headers"
          :items="filteredReviews"
          striped
          :loading="loading"
          loading-text="ກະລຸນາລໍຖ້າ....."
        >
          <template v-slot:[`item.created_at`]="{ item }">
            {{ item.created_at }}
          </template>
          <template v-slot:[`item.user`]="{ item }">
            {{ item.user.firstname }} {{ item.user.lastname }}
          </template>
          <template v-slot:[`item.facility`]="{ item }">
            {{ item.facility.name }}
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="getStatusColor(item.status)" dark>
              {{ getStatusText(item.status) }}
            </v-chip>
          </template>
        </v-data-table>

        <!-- Floating export button -->
        <v-btn
          color="primary"
          dark
          bottom
          right
          absolute
          class="ma-4"
          @click="confirmExport"
          style="border-radius: 8px"
        >
          <v-icon>mdi-file-excel</v-icon>
          ອອກລາຍງານ
        </v-btn>
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
      selectedFacility: null,
      reviews: [],
      facilities: [{ fac_id: null, name: 'All Facilities' }],
      headers: [
        { text: 'ວັນທີເວລາ', value: 'created_at' },
        { text: 'ເນື້ອໃນ', value: 'description' },
        { text: 'ຄະເເນນ', value: 'rating' },
        { text: 'ຜູ້ໃຊ້', value: 'user' },
        { text: 'ຊື່ສະຖານທີ່', value: 'facility' },
      ],
    }
  },
  computed: {
    filteredReviews() {
      let filteredReviews = this.reviews

      if (this.selectedFacility) {
        filteredReviews = filteredReviews.filter(
          (review) => review.fac_id === this.selectedFacility
        )
      }

      return filteredReviews
    },
  },
  methods: {
    async fetchReviews() {
      try {
        this.loading = true

        const { data } = await this.$apollo.query({
          query: gql`
            query GetReviews {
              reviews {
                created_at
                description
                rating
                status
                fac_id
                review_id
                user {
                  firstname
                  lastname
                  email
                  tel
                  user_id
                }
                facility {
                  name
                }
              }
            }
          `,
          fetchPolicy: 'no-cache',
        })

        this.reviews = data.reviews.map((review) => ({
          ...review,
          created_at: this.formatDateTime(review.created_at),
        }))
        this.facilities = data.reviews.map((review) => ({
          fac_id: review.fac_id,
          name: review.facility.name,
        }))
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        this.loading = false
      }
    },
    formatDateTime(dateTimeString) {
      const date = new Date(dateTimeString)
      const formattedDate = date.toISOString().split('T')[0]
      const formattedTime = date.toTimeString().split(' ')[0]
      return `${formattedDate} ${formattedTime}`
    },
    filterReviewsByFacility() {
      // Perform additional filtering or logic here if needed
    },
    async confirmExport() {
      const confirmed = await Swal.fire({
        title: 'Export to Excel',
        text: 'Are you sure you want to export the filtered reviews to Excel?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Export',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })

      if (confirmed.isConfirmed) {
        this.exportToExcel()
      }
    },
    exportToExcel() {
      const filteredData = this.filteredReviews.map((review) => ({
        'Created At': review.created_at,
        Description: review.description,
        Rating: review.rating,
        Status: review.status === 1 ? 'Active' : 'Inactive',
        User: `${review.user.firstname} ${review.user.lastname}`,
        Facility: review.facility.name,
      }))

      const facilityName = this.selectedFacility
        ? this.facilities.find((f) => f.fac_id === this.selectedFacility).name
        : 'All Facilities'
      const now = new Date()
      const formattedNow = now
        .toISOString()
        .replace(/[:.-]/g, '/')
        .split('T')
        .join('_')
        .split('Z')[0]
      const worksheet = XLSX.utils.json_to_sheet(filteredData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reviews')
      XLSX.writeFile(workbook, `Reviews_${facilityName}-${formattedNow} .xlsx`)
    },
    resetFacility() {
      this.selectedFacility = null
    },
    getStatusColor(status) {
      switch (status) {
        case 1:
          return 'green'
        case 0:
          return 'red'
        default:
          return 'grey'
      }
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return 'Active'
        case 0:
          return 'Inactive'
        default:
          return 'Unknown'
      }
    },
  },
  mounted() {
    this.fetchReviews()
  },
}
</script>

<style scoped></style>
