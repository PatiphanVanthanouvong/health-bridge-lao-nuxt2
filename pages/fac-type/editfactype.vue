<template>
  <v-col>
    <v-card height="80vh" outlined style="border-color: black" class="pa-5">
      <v-form ref="form">
        <v-row no-gutters>
          <v-col class="col-12 mb-5">
            <div style="font-weight: bold">
              <v-icon left>mdi-table-edit</v-icon>ເເກ້ໄຂປະເພດສະຖານທີ່
            </div>
          </v-col>

          <v-col cols="6" class="pr-3">
            <v-text-field
              v-model="formData.name_en"
              label="ຊື່ປະເພດສະຖານທີ່ (English) "
              outlined
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6" class="pl-3">
            <v-text-field
              v-model="formData.name_la"
              label="ຊື່ປະເພດສະຖານທີ່ (ລາວ)"
              outlined
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4" class="pr-3">
            <v-text-field
              v-model="formData.sub_type"
              label="ປະເພດຍ່ອຍ"
              outlined
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="8">
            <v-text-field
              v-model="formData.description"
              label="ຄໍາອະທິບາຍ"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-btn color="success" @click="updateFacilityType">ບັນທຶກ</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn color="error" @click="cancel">ຍົກເລີກ</v-btn>
          </v-col>
        </v-row>
      </v-form>
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
        name_en: '',
        name_la: '',
        sub_type: '',
        description: '',
      },
      rules: {
        required: (value) => !!value || 'This field is required',
      },
    }
  },
  methods: {
    cancel() {
      const facTypeId = this.$route.query.fac_type_id
      if (facTypeId) {
        this.$router.push(`/fac-type/viewfactype/?fac_type_id=${facTypeId}`)
      }
    },
    async updateFacilityType() {
      if (this.$refs.form.validate()) {
        try {
          Swal.fire({
            title: 'ກໍາລັງໂຫຼດ...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            },
          })

          const { data } = await this.$apollo.mutate({
            mutation: gql`
              mutation UpdateFactype(
                $name_en: String!
                $name_la: String!
                $sub_type: String!
                $description: String!
                $_id: uuid!
              ) {
                update_facility_type(
                  where: { fac_type_id: { _eq: $_id } }
                  _set: {
                    name_en: $name_en
                    name_la: $name_la
                    sub_type: $sub_type
                    description: $description
                  }
                ) {
                  affected_rows
                }
              }
            `,
            variables: {
              _id: this.$route.query.fac_type_id,
              name_en: this.formData.name_en,
              name_la: this.formData.name_la,
              sub_type: this.formData.sub_type,
              description: this.formData.description,
            },
          })

          Swal.fire({
            title: 'ສຳເລັດ',
            text: 'ເເກ້ໄຂປະເພດສະຖານທີ່ສໍາເລັດເເລ້ວ!',
            icon: 'success',
            confirmButtonText: 'ຕົກລົງ',
          }).then(() => {
            this.$router.push('/fac-type')
          })
        } catch (error) {
          Swal.fire({
            title: 'ເກີດຂໍ້ຜິດພາດ',
            text: 'ເກີດການຜິດພາດບາງຢ່າງ...',
            icon: 'error',
            confirmButtonText: 'ປິດ',
          })
        }
      }
    },
  },
  mounted() {
    const facTypeId = this.$route.query.fac_type_id

    if (facTypeId) {
      this.$apollo
        .query({
          query: gql`
            query GetFacilityType($_id: uuid!) {
              facility_type(where: { fac_type_id: { _eq: $_id } }) {
                name_en
                name_la
                sub_type
                description
              }
            }
          `,
          variables: { _id: facTypeId },
          fetchPolicy: 'no-cache',
        })
        .then((response) => {
          const facilityType = response.data.facility_type[0]
          if (facilityType) {
            this.formData = {
              name_en: facilityType.name_en,
              name_la: facilityType.name_la,
              sub_type: facilityType.sub_type,
              description: facilityType.description,
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching facility type:', error)
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while fetching the facility type.',
            icon: 'error',
            confirmButtonText: 'Close',
          })
        })
    }
  },
}
</script>
