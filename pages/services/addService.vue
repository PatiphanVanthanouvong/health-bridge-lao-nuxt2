<template>
  <v-col>
    <v-card height="100vh" outlined style="border-color: black" class="pa-5">
      <v-row no-gutters>
        <v-col class="col-12 mb-5">
          <div><v-icon left>mdi-table-edit</v-icon>ເພີ່ມຂໍ້ມູນການບໍລິການ</div>
        </v-col>

        <v-col cols="6" class="pr-3">
          <v-text-field
            v-model="formData.name_en"
            label="ຊື່ພາສາອັງກິດ"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pl-3">
          <v-text-field
            v-model="formData.name_la"
            label="ຊື່ພາສາລາວ"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="formData.type_name"
            label="ປະເພດ"
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-btn color="success" @click="addService">ບັນທຶກ</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn color="error" @click="$router.push('/services')"
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
        type_name: '',
      },
    }
  },
  methods: {
    async addService() {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation addService(
              $name_en: String!
              $name_la: String!
              $type_name: String!
            ) {
              insert_services(
                objects: {
                  name_en: $name_en
                  name_la: $name_la
                  type_name: $type_name
                }
              ) {
                affected_rows
                returning {
                  service_id
                  name_en
                  name_la
                  type_name
                }
              }
            }
          `,
          variables: {
            name_en: this.formData.name_en,
            name_la: this.formData.name_la,
            type_name: this.formData.type_name,
          },
        })
        Swal.fire({
          title: 'ສຳເລັດ',
          text: 'ເພີ່ມການບໍລິການສໍາເລັດເເລ້ວ!',
          icon: 'success',
          confirmButtonText: 'ຕົກລົງ',
        }).then(async (result) => {
          console.log('result here:', result)

          this.$router.push('/services')
          // return result
        })

        this.formData = {
          name_en: '',
          name_la: '',
          type_name: '',
        }
      } catch (error) {
        console.error('Error adding Service:', error)
      }
    },
  },
}
</script>
