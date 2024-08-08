<template>
  <v-col>
    <v-card height="80vh" outlined style="border-color: black" class="pa-5">
      <v-row no-gutters>
        <v-col class="col-12 mb-5">
          <div style="font-weight: bold">
            <v-icon left>mdi-table-edit</v-icon>ການເພີ່ມປະເພດສະຖານທີ່ໃໝ່
          </div>
        </v-col>

        <v-col cols="6" class="pr-3">
          <v-text-field
            v-model="formData.name_en"
            label="ຊື່ປະເພດສະຖານທີ່ (English)"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pl-3">
          <v-text-field
            v-model="formData.name_la"
            label="ຊື່ປະເພດສະຖານທີ່ (Lao)"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="4" class="pr-3">
          <v-text-field
            v-model="formData.sub_type"
            label="ປະເພດຍ່ອຍ"
            outlined
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
          <v-btn color="success" @click="addFacilityType">ບັນທຶກ</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn color="error" @click="$router.push('/fac-type')"
            >ຍົກເລີກ</v-btn
          >
        </v-col>
      </v-row>
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
    }
  },
  methods: {
    async addFacilityType() {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation AddFactype(
              $name_en: String!
              $name_la: String!
              $sub_type: String!
              $description: String!
            ) {
              insert_facility_type(
                objects: {
                  name_en: $name_en
                  name_la: $name_la
                  sub_type: $sub_type
                  description: $description
                }
              ) {
                affected_rows
                returning {
                  fac_type_id
                  name_en
                  name_la
                  sub_type
                  description
                }
              }
            }
          `,
          variables: {
            name_en: this.formData.name_en,
            name_la: this.formData.name_la,
            sub_type: this.formData.sub_type,
            description: this.formData.description,
          },
        })
        Swal.fire({
          title: 'ສຳເລັດ',
          text: 'ເພີິ່ມປະເພດສະຖານທີ່ສໍາເລັດເເລ້ວ!',
          icon: 'success',
          confirmButtonText: 'ຕົກລົງ',
        }).then((result) => {
          console.log('result here:', result)
          this.$router.push('/fac-type')
          // return result
        })

        this.formData = {
          name_en: '',
          name_la: '',
          sub_type: '',
          description: '',
        }
      } catch (error) {
        console.error('Error adding facility type:', error)
      }
    },
  },
}
</script>
