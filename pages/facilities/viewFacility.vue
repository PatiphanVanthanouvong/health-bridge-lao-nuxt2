<template>
  <v-col>
    <v-card height="100vh" width="100vw" class="mx-auto">
      <v-col>
        <!-- Floating Buttons -->

        <v-row class="d-flex justify-space-between align-center mb-6">
          <v-col cols="auto">
            <div class="text-h5 font-weight-bold">ລາຍລະອຽດຂອງສະຖານທີ່</div>
          </v-col>
          <v-col cols="auto">
            <div>
              <v-btn
                v-if="formData && formData.status !== 2"
                color="primary"
                large
                dark
                :disabled="!formData"
                @click="navigateToAddService"
              >
                <v-icon>mdi-plus</v-icon>
                ເພິ່ມລາຍລະອຽດການບໍລິການ
              </v-btn>
              <v-btn
                v-if="formData && formData.status !== 2"
                color="success"
                large
                dark
                :disabled="!formData"
                @click="navigateToEditFacitilies"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                v-if="formData && formData.status !== 2"
                :color="
                  formData && formData.status === 1 ? 'warning' : 'secondary'
                "
                large
                dark
                :disabled="!formData"
                @click="toggleActive"
              >
                <v-icon>{{
                  formData && formData.status === 1
                    ? 'mdi-close-octagon'
                    : 'mdi-check-circle'
                }}</v-icon>
                {{ formData && formData.status === 1 ? 'ປິດ' : 'ເປີດ' }}
              </v-btn>
              <v-btn
                v-if="formData && formData.status !== 2"
                color="error"
                large
                dark
                :disabled="!formData"
                @click="confirmDeleteFacility"
              >
                <v-icon>mdi-delete-forever</v-icon>
              </v-btn>
              <v-btn
                v-if="formData && formData.status === 2"
                color="primary"
                large
                dark
                :disabled="!formData"
                @click="approveFacility"
              >
                <v-icon>mdi-check-all</v-icon>
                Approve
              </v-btn>
              <v-btn
                v-if="formData && formData.status === 2"
                color="error"
                large
                dark
                :disabled="!formData"
                @click="rejectFacility"
              >
                <v-icon>mdi-close</v-icon>
                Reject
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider height="10" color="black"></v-divider>
        <v-row v-if="!formData">
          <v-col cols="12" class="text-center">
            <v-skeleton-loader
              class="mx-auto"
              type="list-item"
            ></v-skeleton-loader>
            <custom-loading></custom-loading>
          </v-col>
        </v-row>
        <v-row v-if="formData" class="my-auto">
          <v-col cols="4">
            <div class="font-weight-bold">ປະເພດ</div>
            <div style="font-size: 16px">
              {{ formData.facility_type.name_la }}
              {{ formData.facility_type.sub_type }}
            </div>
          </v-col>

          <v-col cols="8">
            <div class="font-weight-bold">ຊື່ສະຖານທີ່</div>
            <div style="font-size: 16px">{{ formData.name }}</div>
          </v-col>
        </v-row>
        <v-divider height="10"></v-divider>
        <v-row v-if="formData" class="my-auto">
          <v-col cols="4">
            <div class="font-weight-bold">ບ້ານ</div>
            <div style="font-size: 16px">{{ formData.village }}</div>
          </v-col>
          <v-col cols="4">
            <div class="font-weight-bold">ເມືອງ</div>
            <div style="font-size: 16px">{{ formData.district }}</div>
          </v-col>
          <v-col cols="4">
            <div class="font-weight-bold">ເເຂວງ</div>
            <div style="font-size: 16px">{{ formData.province }}</div>
          </v-col>
        </v-row>
        <v-divider height="10"></v-divider>
        <v-row v-if="formData" class="my-auto">
          <v-col cols="4">
            <div class="font-weight-bold">ເສັ້ນຂະໜານ</div>
            <div style="font-size: 16px">{{ formData.Latitude }}</div>
          </v-col>
          <v-col cols="4">
            <div class="font-weight-bold">ເສັ້ນເເວງ</div>
            <div style="font-size: 16px">{{ formData.Longitude }}</div>
          </v-col>
          <v-col cols="4">
            <div class="font-weight-bold">ສະຖານະ</div>
            <div style="font-size: 16px">{{ statusText }}</div>
          </v-col>
        </v-row>
        <v-divider height="10"></v-divider>
        <v-row v-if="formData && formData.image_url">
          <v-col cols="3 mt-5">
            <v-img
              :src="formData.image_url"
              class="mt-3"
              style="
                height: 200px;
                width: auto;
                object-fit: cover;
                background-size: cover;
                background-position: center;
              "
            ></v-img>
          </v-col>
        </v-row>

        <v-col cols="6"></v-col>
        <v-col cols="6" class="my-10">
          <div>
            <v-btn
              @click="$router.push('/facilities')"
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
import CustomLoading from '~/components/CustomLoading.vue'
import Swal from 'sweetalert2'

export default {
  components: { CustomLoading },
  data() {
    return {
      formData: null,
    }
  },
  methods: {
    navigateToEditFacitilies() {
      this.$router.push({
        path: '/facilities/editFacility',
        query: { fac_id: this.formData.fac_id },
      })
    },
    navigateToAddService() {
      this.$router.push({
        path: '/facilities/addServiceDetail',
        query: { fac_id: this.formData.fac_id },
      })
    },
    async deleteFacilityType() {
      try {
        Swal.fire({
          title: 'ກຳລັງລຶບ...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        // Check if image_url is a full URL
        if (this.formData.image_url) {
          let imageRef

          // Check if image_url is a full URL
          if (
            this.formData.image_url.startsWith('http') ||
            this.formData.image_url.startsWith('https')
          ) {
            imageRef = this.$fire.storage.refFromURL(this.formData.image_url)
          } else {
            imageRef = this.$fire.storage.ref(this.formData.image_url)
          }

          // Check if imageRef is not a root reference
          if (imageRef.fullPath !== '/') {
            try {
              await imageRef.delete()
            } catch (error) {
              if (error.code === 'storage/object-not-found') {
                console.warn('Image not found, skipping image deletion.')
              } else {
                throw error
              }
            }
          }
        }
        //         mutation MyMutation {
        //   delete_reviews(where: {fac_id: {_eq: ""}})
        // }
        await this.$apollo.mutate({
          mutation: gql`
            mutation DeleteReviews($_eq: uuid!) {
              delete_reviews(where: { fac_id: { _eq: $_eq } }) {
                affected_rows
              }
            }
          `,
          variables: {
            _eq: this.$route.query.fac_id,
          },
        })
        // Delete service details associated with the facility
        await this.$apollo.mutate({
          mutation: gql`
            mutation DeleteServiceDetail($_eq: uuid!) {
              delete_service_detail(where: { fac_id: { _eq: $_eq } }) {
                affected_rows
              }
            }
          `,
          variables: {
            _eq: this.$route.query.fac_id,
          },
        })

        // Proceed to delete the facility from Hasura
        const { data } = await this.$apollo.mutate({
          mutation: gql`
            mutation DeleteFacility($_id: uuid!) {
              delete_facilities(where: { fac_id: { _eq: $_id } }) {
                affected_rows
              }
            }
          `,
          variables: {
            _id: this.$route.query.fac_id,
          },
        })

        Swal.close()

        Swal.fire({
          title: 'ສຳເລັດ',
          text: 'ລຶບສະຖານທີ່ສຳເລັດແລ້ວ',
          icon: 'success',
        }).then(() => {
          this.$router.push('/facilities')
        })
      } catch (error) {
        console.error('Error deleting facility:', error)

        // Additional logging for Apollo Client errors
        if (error.networkError) {
          console.error('Network Error:', error.networkError)
        }
        if (error.graphQLErrors) {
          console.error('GraphQL Errors:', error.graphQLErrors)
        }

        Swal.fire({
          title: 'ມີບັນຫາໃນການລຶບສະຖານທີ່',
          text: 'ມີບາງຢ່າງຜິດພາດ',
          icon: 'error',
        })
      }
    },
    confirmDeleteFacility() {
      Swal.fire({
        title: 'ຢືນຢັນການລຶບ',
        text: 'ຕ້ອງການລຶບສະຖານທີ່ນີ້ແທ້ບໍ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ຕົກລົງ',
        cancelButtonText: 'ຍົກເລີກ',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteFacilityType()
        }
      })
    },
    async toggleActive() {
      const newStatus = this.formData.status === 1 ? 0 : 1
      const action = newStatus === 1 ? 'activate' : 'deactivate'

      const confirmResult = await Swal.fire({
        title: `ຕ້ອງການ${action}ສະຖານທີ່ຫຼືບໍ່?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ຕົກລົງ',
        cancelButtonText: 'ຍົກເລີກ',
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmResult.isConfirmed) {
        try {
          const { data } = await this.$apollo.mutate({
            mutation: gql`
              mutation UpdateFacilityStatus($_id: uuid!, $status: Int!) {
                update_facilities_by_pk(
                  pk_columns: { fac_id: $_id }
                  _set: { status: $status }
                ) {
                  status
                }
              }
            `,
            variables: {
              _id: this.formData.fac_id,
              status: newStatus,
            },
          })

          // Update local data with the new status
          this.formData.status = data.update_facilities_by_pk.status

          // Show success message
          Swal.fire({
            title: 'ສຳເລັດ',
            text: `${action}ສະຖານທີ່ສຳເລັດແລ້ວ`,
            icon: 'success',
          })
        } catch (error) {
          console.error('Error updating facility status:', error)
          Swal.fire({
            title: `ມີບັນຫາໃນການ${action}ສະຖານທີ່`,
            text: `ແລ້ວໃຫ້ພົບລະບົບແລ້ວ`,
            icon: 'error',
          })
        }
      }
    },
    async approveFacility() {
      const confirmResult = await Swal.fire({
        title: 'Confirm Approval',
        text: 'Are you sure you want to approve this facility?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Approve',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmResult.isConfirmed) {
        try {
          const { data } = await this.$apollo.mutate({
            mutation: gql`
              mutation ApproveFacility($_id: uuid!) {
                update_facilities_by_pk(
                  pk_columns: { fac_id: $_id }
                  _set: { status: 1 }
                ) {
                  status
                }
              }
            `,
            variables: {
              _id: this.formData.fac_id,
            },
          })

          this.formData.status = data.update_facilities_by_pk.status

          Swal.fire({
            title: 'Approved',
            text: 'Facility approved successfully',
            icon: 'success',
          })
        } catch (error) {
          console.error('Error approving facility:', error)
          Swal.fire({
            title: 'Error',
            text: 'There was an error approving the facility',
            icon: 'error',
          })
        }
      }
    },
    async rejectFacility() {
      const confirmResult = await Swal.fire({
        title: 'Confirm Rejection',
        text: 'Are you sure you want to reject this facility?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmResult.isConfirmed) {
        try {
          const { data } = await this.$apollo.mutate({
            mutation: gql`
              mutation RejectFacility($_id: uuid!) {
                update_facilities_by_pk(
                  pk_columns: { fac_id: $_id }
                  _set: { status: 3 }
                ) {
                  status
                }
              }
            `,
            variables: {
              _id: this.formData.fac_id,
            },
          })

          this.formData.status = data.update_facilities_by_pk.status

          Swal.fire({
            title: 'Rejected',
            text: 'Facility rejected successfully',
            icon: 'success',
          }).then(() => {
            this.$router.push('/facilities')
          })
        } catch (error) {
          console.error('Error rejecting facility:', error)
          Swal.fire({
            title: 'Error',
            text: 'There was an error rejecting the facility',
            icon: 'error',
          })
        }
      }
    },
  },
  computed: {
    statusText() {
      if (!this.formData) return ''
      switch (this.formData.status) {
        case 1:
          return 'ເປີດໃຊ້ງານ'
        case 3:
          return 'ປິດໃຊ້ງານ'
        case 2:
          return 'ກໍາລັງລໍຖ້າ'
        case 3:
          return 'ປະຕິເສດ'
        default:
          return 'Unknown'
      }
    },
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
                image_url
                rating_count
                facility_type {
                  name_en
                  name_la
                  sub_type
                }
              }
            }
          `,
          variables: {
            _id: fac_id,
          },
          fetchPolicy: 'no-cache',
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

<style scoped></style>
