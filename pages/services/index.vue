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
            <div @click="$router.push('/services/addService')">
              <v-btn color="success" large dark>
                <v-icon>mdi-plus</v-icon>
                ເພີ່ມການບໍລິການໃໝ່
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-data-table
          :search="search"
          :headers="headers"
          :items="services"
          striped
          :loading="loading"
          loading-text="Loading... Please wait"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon
              @click="navigateToDetailPage(item)"
              class="mx-2"
              color="primary"
            >
              mdi-eye
            </v-icon>
          </template></v-data-table
        >
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { gql } from '@apollo/client/core'

export default {
  data() {
    return {
      search: '',
      loading: false,

      headers: [
        // { text: 'Index', value: 'index' },
        // { text: 'ລະຫັດ', value: 'service_id' },
        { text: 'ຊື່ພາສາອັງກິດ', value: 'name_en' },
        { text: 'ຊື່ພາສາລາວ', value: 'name_la' },
        { text: 'ປະເພດ', value: 'type_name' },
        { text: 'ຈັດການ', value: 'action', sortable: false },
      ],
      services: [],
    }
  },
  methods: {
    navigateToDetailPage(item) {
      this.$router.push({
        path: `/services/viewService`,
        query: { service_id: item.service_id },
      })
    },

    async fetchServices() {
      try {
        this.loading = true
        const { data } = await this.$apollo.query({
          query: gql`
            query services {
              services {
                name_en
                name_la
                service_id
                type_name
              }
            }
          `,
          fetchPolicy: 'no-cache',
        })
        this.services = data.services.map((item, index) => ({
          ...item,
          index: index + 1,
        }))
      } catch (error) {
        console.error('Error fetching service type_names:', error)
      } finally {
        this.loading = false
      }
    },
  },

  mounted() {
    this.fetchServices()
    console.log('mounted already')
  },
}
</script>

<style scoped></style>
