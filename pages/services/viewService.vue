<template>
  <v-col>
    <v-card height="100vh" width="100vw" class="mx-auto">
      <v-col>
        <v-row class="d-flex justify-space-between align-center mb-6">
          <v-col cols="auto">
            <div class="text-h5 font-weight-bold">ລາຍລະອຽດການບໍລິການ</div>
          </v-col>

          <v-col cols="auto">
            <div>
              <v-btn color="success" large dark @click="navigateToEdit">
                <v-icon>mdi-pencil</v-icon>
                ເເກ້ໄຂ
              </v-btn>
              <v-btn color="error" large dark @click="confirmDeleteService">
                <v-icon>mdi-delete-forever</v-icon>
                ລືບ
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider height="10" color="black"></v-divider>
        <v-row v-if="formData" class="my-auto">
          <v-col cols="6">
            <div class="font-weight-bold">ຊື່ການບໍລິການ (English)</div>
            <div style="font-size: 16px">{{ formData.name_en }}</div>
          </v-col>
          <v-col cols="6">
            <div class="font-weight-bold">ຊື່ການບໍລິການ (Lao)</div>
            <div>{{ formData.name_la }}</div>
          </v-col>
        </v-row>
        <v-divider height="10"></v-divider>
        <v-row v-if="formData" class="my-auto">
          <v-col cols="6">
            <div class="font-weight-bold">ປະເພດ</div>
            <div>{{ formData.type_name }}</div>
          </v-col>
          <!-- Add more fields here if needed -->
        </v-row>
        <v-divider height="10"></v-divider>
        <v-row v-if="!formData">
          <v-col cols="12" class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
        </v-row>
        <v-row v-if="formData">
          <v-col cols="12" class="text-center">
            <div>{{ formData.id }}</div>
          </v-col>
        </v-row>
        <v-col cols="6" class="my-10">
          <div>
            <v-btn
              @click="$router.push('/services')"
              style="font-weight: bold; font-size: 18px"
              >ກັບຄືນ</v-btn
            >
          </div>
        </v-col>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { gql } from '@apollo/client/core'
import Swal from 'sweetalert2'
export default {
  methods: {
    navigateToEdit() {
      this.$router.push({
        path: '/services/editService',
        query: { service_id: this.formData.service_id },
      })
    },
    confirmDeleteService() {
      Swal.fire({
        title: 'ຢືນຢັນການລຶບ',
        text: 'ຕ້ອງການລຶບການບໍລິການນີ້ແທ້ບໍ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ຕົກລົງ',
        cancelButtonText: 'ຍົກເລີກ',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteService()
        }
      })
    },
    async deleteService() {
      try {
        const { data } = await this.$apollo
          .mutate({
            mutation: gql`
              mutation DeleteService($_id: uuid) {
                delete_services(where: { service_id: { _eq: $_id } }) {
                  affected_rows
                }
              }
            `,
            variables: {
              _id: this.$route.query.service_id,
            },
          })
          .then((result) => {
            console.log(result)
            this.$router.push('/services')
            return result
          })

        // console.log(
        //   ' facility type_name has been deleted:',
        //   data.delete_facility_type_name
        // )

        // this.$router.push('/fac-type_name')
      } catch (error) {
        console.error('Error deleting facility type_name:', error)
        this.errorMessage =
          'An error occurred while deleting facility type_name.'
        this.errorDialog = true
      }
    },
  },

  data() {
    return {
      formData: null,
    }
  },

  created() {
    // Access the service_id passed as a query parameter through Vue Router
    const service_id = this.$route.query.service_id

    // Execute the GraphQL query with the service_id variable
    this.$apollo
      .query({
        query: gql`
          query services($_id: uuid!) {
            services(where: { service_id: { _eq: $_id } }) {
              name_en
              name_la
              service_id
              type_name
            }
          }
        `,
        variables: {
          _id: service_id, // Update variable name here
        },
      })
      .then((response) => {
        // Check if data is available and has correct structure
        if (response.data && response.data.services.length > 0) {
          // Set the formData with the first service data
          this.formData = response.data.services[0]
        } else {
          console.error('Service not found')
          // Optionally, provide feedback to the user about the missing service
        }
      })
      .catch((error) => {
        console.error('Error fetching Service:', error)
        // Optionally, provide feedback to the user about the error
      })
  },
}
</script>

<style scoped></style>
