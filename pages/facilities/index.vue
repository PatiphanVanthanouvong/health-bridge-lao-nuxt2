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
            <div @click="$router.push('/facilities/addFacility')">
              <v-btn color="success" large dark>
                <v-icon>mdi-plus</v-icon>
                ເພິ່ມສະຖານທີ່ທາງການເເພດໃໝ່
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Tab Bar -->
        <v-tabs v-model="tab">
          <v-tab>All Facilities</v-tab>
          <v-tab>Pending Facilities</v-tab>
          <v-tab>User Facilities</v-tab>
        </v-tabs>

        <!-- Tab Content -->
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-data-table
              :search="search"
              :headers="headers"
              :items="formattedFacilities"
              striped
              :loading="loading"
              loading-text="ກະລຸນາລໍຖ້າ....."
              class="elevate"
            >
              <!-- Customize action column -->
              <template v-slot:[`item.action`]="{ item }">
                <v-icon
                  @click="viewFacility(item)"
                  class="mx-2"
                  color="primary"
                >
                  mdi-eye
                </v-icon>
              </template>

              <!-- Customize status chip -->
              <template v-slot:[`item.status`]="{ item }">
                <v-chip :color="getColor(item.status)" dark>
                  {{ item.status }}
                </v-chip>
              </template>
            </v-data-table>
          </v-tab-item>

          <v-tab-item>
            <v-data-table
              :search="search"
              :headers="headers"
              :items="pendingFacilities"
              striped
              :loading="loading"
              loading-text="ກະລຸນາລໍຖ້າ....."
              class="elevate"
            >
              <!-- Customize action column -->
              <template v-slot:[`item.action`]="{ item }">
                <v-icon
                  @click="viewFacility(item)"
                  class="mx-2"
                  color="primary"
                >
                  mdi-eye
                </v-icon>
              </template>

              <!-- Customize status chip -->
              <template v-slot:[`item.status`]="{ item }">
                <v-chip :color="getColor(item.status)" dark>
                  {{ item.status }}
                </v-chip>
              </template>
            </v-data-table>
          </v-tab-item>

          <v-tab-item>
            <v-data-table
              :search="search"
              :headers="headers"
              :items="userFacilities"
              striped
              :loading="loading"
              loading-text="ກະລຸນາລໍຖ້າ....."
              class="elevate"
            >
              <!-- Customize action column -->
              <template v-slot:[`item.action`]="{ item }">
                <v-icon
                  @click="viewFacility(item)"
                  class="mx-2"
                  color="primary"
                >
                  mdi-eye
                </v-icon>
              </template>

              <!-- Customize status chip -->
              <template v-slot:[`item.status`]="{ item }">
                <v-chip :color="getColor(item.status)" dark>
                  {{ item.status }}
                </v-chip>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { gql } from '@apollo/client/core'
import fetchFacilitiesQuery from '~/gql/querys/fetchFacilities.gql'

export default {
  data() {
    return {
      search: '',
      loading: false,
      facilities: [],
      tab: 0,
      headers: [
        { text: 'ປະເພດ', align: 'start', value: 'type' },
        { text: 'ຊື່ສະຖານທີ່', align: 'start', value: 'name' },
        { text: 'ບ້ານ', align: 'start', value: 'village' },
        { text: 'ເມືອງ', align: 'start', value: 'district' },
        { text: 'ເເຂວງ', align: 'start', value: 'province' },
        { text: 'ຂໍ້ມູນຕິດຕໍ່', align: 'start', value: 'contact_info' },
        { text: 'ສະຖານະ', align: 'start', value: 'status' },
        { text: 'ການຈັດການ', align: 'start', value: 'action', sortable: false },
      ],
    }
  },
  methods: {
    getColor(status) {
      if (status === 'ເປີດໃຊ້ງານ') return 'green'
      if (status === 'ປິດໃຊ້ງານ') return 'red'
      if (status === 'ກໍາລັງລໍຖ້າ') return 'primary'
      return 'red'
    },

    async fetchFacilities() {
      try {
        this.loading = true

        const result = await this.$apollo.query({
          query: fetchFacilitiesQuery,
          fetchPolicy: 'no-cache',
        })

        console.log(result)
        this.facilities = result.data.facilities
      } catch (error) {
        console.error('Error fetching facilities:', error)
      } finally {
        this.loading = false
      }
    },
    viewFacility(item) {
      this.$router.push({
        path: `/facilities/viewFacility/`,
        query: {
          fac_id: item.fac_id,
        },
      })
    },

    getStatusText(status) {
      if (status === 1) return 'ເປີດໃຊ້ງານ'
      if (status === 0) return 'ປິດໃຊ້ງານ'
      if (status === 2) return 'ກໍາລັງລໍຖ້າ'
      if (status === 3) return 'ປະຕິເສດ'
      return 'Unknown'
    },
  },
  computed: {
    formattedFacilities() {
      return this.facilities.map((facility) => ({
        ...facility,
        type: `${facility.facility_type.name_la} - ${facility.facility_type.sub_type}`,
        status: this.getStatusText(facility.status),
      }))
    },
    pendingFacilities() {
      return this.formattedFacilities.filter(
        (facility) => facility.status === 'ກໍາລັງລໍຖ້າ'
      )
    },
    userFacilities() {
      return this.formattedFacilities.filter(
        (facility) =>
          facility.user_id !== null &&
          facility.user_id !== '' &&
          facility.status !== 'ກໍາລັງລໍຖ້າ'
      )
    },
  },
  mounted() {
    this.fetchFacilities()
  },
}
</script>
