<template>
  <v-container fluid>
    <!-- <h1>Welcome {{ userType || 'Guest' }}</h1> -->
    <h1>Counter: {{ this.$store.state.getRole.counter }}</h1>
    <v-row>
      <v-col cols="6">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h4 white--text primary">
            ສະຖານທີ່ທັງໝົດ
          </v-card-title>

          <v-card-title>
            <v-icon x-large left class="mr-5">mdi-hospital-building</v-icon>
            <span v-if="loading">ກຳລັງໂຫລດ...</span>
            <span v-else class="text-h2">{{ totalFacilities }}</span>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h4 white--text primary"
            >ປະເພດສະຖານທີ່ທັງໝົດ</v-card-title
          >
          <v-card-title>
            <v-icon x-large left class="mr-5">mdi-domain</v-icon>
            <span v-if="loading">ກຳລັງໂຫລດ...</span>
            <span class="text-h2" v-else>{{ totalFacilityTypes }}</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h4 white--text primary"
            >ຜູ້ໃຊ້ທັງໝົດ</v-card-title
          >
          <v-card-title>
            <v-icon x-large left class="mr-5">mdi-account</v-icon>
            <span v-if="loading">ກຳລັງໂຫລດ...</span>
            <span class="text-h2" v-else>{{ totalUsers }}</span>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h4 white--text primary"
            >ການບໍລິການທັງໝົດ</v-card-title
          >
          <v-card-title>
            <v-icon x-large left class="mr-5">mdi-medication</v-icon>
            <span v-if="loading">ກຳລັງໂຫລດ...</span>
            <span class="text-h2" v-else>{{ totalServices }}</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { gql } from '@apollo/client/core'
import Cookies from 'js-cookie'

const DASHBOARD_QUERY = gql`
  query DashboardData {
    facilities_aggregate {
      aggregate {
        count
      }
    }
    facility_type_aggregate {
      aggregate {
        count
      }
    }
    services_aggregate {
      aggregate {
        count
      }
    }
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`

export default {
  data() {
    return {
      userType: '',

      totalFacilities: 0,
      totalFacilityTypes: 0,
      totalUsers: 0,
      loading: true,
    }
  },
  // created() {
  //   // Retrieve userType from cookie on component creation
  //   this.userType = Cookies.get('userType')
  // },
  // computed: {
  //   userType() {
  //     return Cookies.get('userType') || 'Guest' // Default to 'Guest' if userType cookie is not found
  //   },
  // },
  apollo: {
    dashboardData: {
      query: DASHBOARD_QUERY,
      result({ data }) {
        if (data) {
          this.totalFacilities = data.facilities_aggregate.aggregate.count
          this.totalFacilityTypes = data.facility_type_aggregate.aggregate.count
          this.totalUsers = data.users_aggregate.aggregate.count
          this.totalServices = data.services_aggregate.aggregate.count
        } else {
          console.error('No data returned from Apollo query')
        }
        this.loading = false
      },
      error(error) {
        console.error('Error fetching dashboard data:', error)
        this.loading = false
      },
    },
  },
}
</script>

<style scoped></style>
