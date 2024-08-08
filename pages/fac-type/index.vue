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
            <div @click="$router.push('/fac-type/addfactype')">
              <v-btn color="success" large dark>
                <v-icon>mdi-plus</v-icon>
                ເພີ່ມປະເພດສະຖານທີ່ໃໝ່
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-data-table
          :search="search"
          :headers="headers"
          :items="facilityTypes"
          striped
          :loading="loading"
          loading-text="ກະລຸນາລໍຖ້າ....."
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
        // { text: 'ລະຫັດ', value: 'fac_type_id' },
        { text: 'ຊື່ພາສາລາວ', value: 'name_la' },
        { text: 'ຊື່ພາສາອັງກິດ', value: 'name_en' },

        { text: 'ປະເພດຍ່ອຍ', value: 'sub_type' },
        { text: 'ການຈັດການ', value: 'action', sortable: false },
      ],
      facilityTypes: [],
    }
  },
  methods: {
    navigateToDetailPage(item) {
      this.$router.push({
        path: `/fac-type/viewfactype`,
        query: { fac_type_id: item.fac_type_id },
      })
    },

    async fetchFacilityTypes() {
      try {
        this.loading = true
        const { data } = await this.$apollo.query({
          query: gql`
            query {
              facility_type {
                fac_type_id
                name_en
                name_la
                sub_type
              }
            }
          `,
          fetchPolicy: 'no-cache',
        })
        this.facilityTypes = data.facility_type.map((item, index) => ({
          ...item,
          index: index + 1,
        }))
      } catch (error) {
        console.error('Error fetching facility types:', error)
      } finally {
        this.loading = false
      }
    },
  },

  mounted() {
    this.fetchFacilityTypes()
    console.log('mounted already')
  },
}
</script>

<style scoped></style>
