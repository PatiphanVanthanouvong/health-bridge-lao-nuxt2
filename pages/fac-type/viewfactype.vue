<template>
  <v-col>
    <v-card height="100vh" width="100vw" class="mx-auto">
      <v-col>
        <v-row class="d-flex justify-space-between align-center mb-6">
          <v-col cols="auto">
            <div class="text-h5 font-weight-bold">ລາຍລະອຽດຂອງປະເພດສະຖານທີ່</div>
          </v-col>

          <v-col cols="auto">
            <div>
              <v-btn color="success" large dark @click="navigateToEditFacType">
                ເເກ້ໄຂ<v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn color="error" large dark @click="deleteFacilityType">
                ລືບ
                <v-icon>mdi-delete-forever</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-divider height="10" color="black"></v-divider>
        <v-row v-if="formData" class="my-auto">
          <v-col cols="6">
            <div class="font-weight-bold">ຊື່ພາສາອັງກິດ</div>
            <div style="font-size: 16px">{{ formData.name_en }}</div>
          </v-col>
          <v-col cols="6">
            <div class="font-weight-bold">ຊື່ພາສາລາວ</div>
            <div>{{ formData.name_la }}</div>
          </v-col>
        </v-row>
        <v-divider height="10"></v-divider>
        <v-row v-if="formData" class="my-auto">
          <v-col cols="6">
            <div class="font-weight-bold">ປະເພດຍ່ອຍ</div>
            <div>{{ formData.sub_type }}</div>
          </v-col>
          <v-col cols="6">
            <div class="font-weight-bold">ຄໍາອະທິບາຍ</div>
            <div>{{ formData.description }}</div>
          </v-col>
        </v-row>
        <v-divider height="10"></v-divider>
        <v-row v-if="!formData">
          <v-col cols="12" class="text-center">
            <custom-loading> </custom-loading>
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
              @click="$router.push('/fac-type')"
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
export default {
  
  methods: {
    navigateToEditFacType() {
      this.$router.push({
        path: '/fac-type/editfactype',
        query: { fac_type_id: this.formData.fac_type_id },
      })
    },
    async deleteFacilityType() {
      try {
        const { data } = await this.$apollo
          .mutate({
            mutation: gql`
              mutation DeleteFacType($_id: uuid) {
                delete_facility_type(where: { fac_type_id: { _eq: $_id } }) {
                  affected_rows
                }
              }
            `,
            variables: {
              _id: this.$route.query.fac_type_id,
            },
            fetchPolicy: 'no-cache',
          })
          .then((result) => {
            console.log(result)
            this.$router.push('/fac-type')
            return result
          })
      } catch (error) {
        console.error('Error deleting facility type:', error)
        this.errorMessage = 'An error occurred while deleting facility type.'
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
    const fac_type_id = this.$route.query.fac_type_id

    this.$apollo
      .query({
        query: gql`
          query MyQuery($_id: uuid!) {
            facility_type(where: { fac_type_id: { _eq: $_id } }) {
              fac_type_id
              name_en
              name_la
              sub_type
              description
            }
          }
        `,
        variables: {
          _id: fac_type_id,
        },
        fetchPolicy: 'no-cache',
      })
      .then((response) => {
        // Set the formData with the response data
        this.formData = response.data.facility_type[0]
      })
      .catch((error) => {
        console.error('Error fetching facility type:', error)
        // Optionally, you can provide feedback to the user about the error
      })
  },
}
</script>

<style scoped></style>
