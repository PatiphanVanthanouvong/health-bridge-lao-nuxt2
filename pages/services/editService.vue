<template>
  <v-col>
    <v-card height="100vh" outlined style="border-color: black" class="pa-5">
      <v-row no-gutters>
        <v-col class="col-12 mb-5">
          <div><v-icon left>mdi-table-edit</v-icon>ເເກ້ໄຂການບໍລິການ</div>
        </v-col>

        <v-col cols="6" class="pr-3">
          <v-text-field
            v-model="formData.name_en"
            label="ຊື່ພາສາອັງກິດ"
            outlined
            :rules="[(v) => !!v || 'English Name is required']"
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pl-3">
          <v-text-field
            v-model="formData.name_la"
            label="ຊື່ພາສາລາວ"
            outlined
            :rules="[(v) => !!v || 'Latin Name is required']"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="formData.type_name"
            label="ປະເພດ"
            outlined
            :rules="[(v) => !!v || 'type_name is required']"
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-btn color="success" @click="updateService">ບັນທຶກການເເກ້ໄຂ</v-btn>
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

const GET_SERVICE = gql`
  query GetService($_id: uuid!) {
    services(where: { service_id: { _eq: $_id } }) {
      service_id
      name_en
      name_la
      type_name
    }
  }
`

const UPDATE_SERVICE = gql`
  mutation UpdateService(
    $_id: uuid!
    $name_en: String!
    $name_la: String!
    $type_name: String!
  ) {
    update_services(
      where: { service_id: { _eq: $_id } }
      _set: { name_en: $name_en, name_la: $name_la, type_name: $type_name }
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
`

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
  apollo: {
    formData: {
      query: GET_SERVICE,
      variables() {
        return {
          _id: this.$route.query.service_id,
        }
      },
      update: (data) => ({
        ...data.services[0],
      }),
    },
  },
  methods: {
    async updateService() {
      try {
        const result = await this.$apollo.mutate({
          mutation: UPDATE_SERVICE,
          variables: {
            _id: this.$route.query.service_id,
            name_en: this.formData.name_en,
            name_la: this.formData.name_la,
            type_name: this.formData.type_name,
          },
        })
        console.log('Service updated:', result)
        this.$router.push('/services')
      } catch (error) {
        console.error('Error updating Service:', error)
      }
    },
  },
}
</script>
