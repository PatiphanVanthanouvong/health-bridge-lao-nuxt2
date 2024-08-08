<template>
  <v-col>
    <v-card height="100vh" outlined style="border-color: black" class="pa-5">
      <v-row no-gutters>
        <v-col class="col-12">
          <div>
            <v-icon left>mdi-table-edit</v-icon>
            ລາຍລະອຽດການບໍລິການຂອງສະຖານທີ່ນີ້
          </div>
        </v-col>

        <v-col cols="12">
          <v-autocomplete
            auto-select-first
            chips
            clearable
            deletable-chips
            multiple
            :items="filteredServiceList"
            item-value="service_id"
            item-text="name_la"
            v-model="service_id_list"
          ></v-autocomplete>
        </v-col>

        <v-col cols="11">
          <v-btn color="success" @click="insertServiceDetail">ບັນທຶກ</v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn color="error" @click="cancel">ຍົກເລີກ</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="mt-4">
          <v-data-table
            :headers="headers"
            :items="serviceDetails"
            item-key="detail_id"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:[`item.service.name_en`]="{ item }">
              {{ item.service.name_en }}
            </template>
            <template v-slot:[`item.service.name_la`]="{ item }">
              {{ item.service.name_la }}
            </template>
            <template v-slot:[`item.service.type_name`]="{ item }">
              {{ item.service.type_name }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon @click="deleteServiceDetail(item.detail_id)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <!-- 
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row> -->
    </v-card>
  </v-col>
</template>

<script>
import { gql } from '@apollo/client/core'
import Swal from 'sweetalert2'

const GET_SERVICE_DETAILS = gql`
  query GetServiceDetails($_eq: uuid = "") {
    service_detail(where: { fac_id: { _eq: $_eq } }) {
      detail_id
      service {
        name_en
        name_la
        type_name
        service_id
      }
    }
  }
`

const DELETE_SERVICE_DETAIL = gql`
  mutation DeleteServiceDetail($detail_id: uuid!) {
    delete_service_detail_by_pk(detail_id: $detail_id) {
      detail_id
    }
  }
`

import fetchService from '~/gql/querys/fetchService.gql'
import insertServiceDetail from '~/gql/mutations/insertServiceDetail.gql'

export default {
  data() {
    return {
      formData: {},
      service_id_list: [],
      serviceDetails: [],
      service_list: [],
      loading: false,

      headers: [
        // { text: 'Service Detail ID', value: 'detail_id' },
        { text: 'ຊື່ການບໍລິການ (English)', value: 'service.name_en' },
        { text: 'ຊື່ການບໍລິການ (Lao)', value: 'service.name_la' },
        { text: 'ປະເພດ', value: 'service.type_name' },
        { text: 'ການຈັດການ', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    filteredServiceList() {
      const selectedServiceIds = this.serviceDetails.map(
        (item) => item.service.service_id
      )

      return this.service_list.filter(
        (service) => !selectedServiceIds.includes(service.service_id)
      )
    },
  },
  methods: {
    cancel() {
      const fac_id = this.$route.query.fac_id
      if (fac_id) {
        this.$router.push(`/facilities/viewFacility/?fac_id=${fac_id}`)
      }
    },
    async fetchServiceDetails() {
      try {
        const fac_id = this.$route.query.fac_id
        if (!fac_id) {
          throw new Error('Facility ID not provided in route query')
        }

        const result = await this.$apollo.query({
          query: GET_SERVICE_DETAILS,
          variables: { _eq: fac_id },
          fetchPolicy: 'no-cache',
        })
        console.log(result)
        this.serviceDetails = result.data.service_detail
      } catch (error) {
        console.error('Error fetching service details:', error)
      }
    },
    async insertServiceDetail() {
      try {
        this.loading = true
        const data = []
        this.service_id_list.forEach((e) => {
          data.push({
            service_id: e,
            fac_id: this.$route.query.fac_id,
          })
        })

        await this.$apollo.mutate({
          mutation: insertServiceDetail,
          variables: {
            objects: data,
          },
          fetchPolicy: 'no-cache',
        })

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Service detail added successfully',
        }).then(() => {
          this.fetchServiceDetails()
        })
      } catch (error) {
        console.error('Error inserting service detail:', error)
      } finally {
        this.loading = false
      }
    },
    async deleteServiceDetail(detail_id) {
      try {
        this.loading = true

        await this.$apollo.mutate({
          mutation: DELETE_SERVICE_DETAIL,
          variables: {
            detail_id: detail_id,
          },
          fetchPolicy: 'no-cache',
        })

        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Service detail deleted successfully',
        }).then(() => {
          this.fetchServiceDetails()
        })
      } catch (error) {
        console.error('Error deleting service detail:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchServices() {
      try {
        this.loading = true

        const result = await this.$apollo.query({
          query: fetchService,
          fetchPolicy: 'no-cache',
        })

        this.service_list = result.data.services
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        this.loading = false
      }
    },
  },

  mounted() {
    this.fetchServices()

    this.fetchServiceDetails() // Fetch service details on component mount
  },
  created() {
    const fac_id = this.$route.query.fac_id

    if (fac_id) {
      this.$apollo
        .query({
          query: gql`
            query GetFacility($_id: uuid!) {
              facilities_by_pk(fac_id: $_id) {
                fac_id
                name
                fac_type_id
                village
                district
                province
                Latitude
                Longitude
                contact_info
                status
                rating_count
                facility_type {
                  name_en
                  name_la
                  type
                }
              }
            }
          `,
          variables: {
            _id: fac_id,
          },
        })
        .then((response) => {
          this.formData = response.data.facilities_by_pk
        })
        .catch((error) => {
          console.error('Error fetching facility:', error)
        })
    } else {
      console.error('Facility ID not provided in route query')
    }
  },
}
</script>
