<template>
  <v-col>
    <v-card height="auto" outlined style="border-color: black" class="pa-5">
      <v-row>
        <v-col class="col-12 mb-5">
          <div class="mb-3">
            <v-icon left>mdi-table-edit</v-icon>ເເກ້ໄຂສະຖານທີ່
          </div>
          <v-divider style="border-color: black"></v-divider>
        </v-col>

        <!-- Facility Name -->
        <v-col cols="6">
          <v-text-field
            v-model="formData.name"
            label="ຊື່ສະຖານທີ່"
            outlined
            :rules="[(v) => !!v || 'Facility Name is required']"
          ></v-text-field>
        </v-col>

        <!-- Facility Type -->
        <v-col cols="6">
          <v-select
            v-model="formData.fac_type_id"
            :items="formattedFacTypeItems"
            item-value="fac_type_id"
            item-text="displayText"
            label="ເລືອກປະເພດສະຖານທີ່"
            outlined
            :rules="[(v) => !!v || 'Type is required']"
          ></v-select>
        </v-col>

        <!-- Province -->
        <v-col cols="4">
          <v-select
            v-model="formData.province"
            :items="provinceItems"
            label="ເເຂວງ"
            outlined
            @change="updateDistricts(formData.province)"
            :rules="[(v) => !!v || 'Province is required']"
          ></v-select>
        </v-col>

        <!-- District -->
        <v-col cols="4">
          <v-select
            v-model="formData.district"
            :items="districtItems"
            label="ເມືອງ"
            outlined
            :rules="[(v) => !!v || 'District is required']"
          ></v-select>
        </v-col>

        <!-- Village -->
        <v-col cols="4">
          <v-text-field
            v-model="formData.village"
            label="ບ້ານ"
            outlined
            :rules="[(v) => !!v || 'Village is required']"
          ></v-text-field>
        </v-col>

        <!-- Latitude -->
        <v-col cols="3">
          <v-text-field
            v-model="formData.latitude"
            label="ເສັ້ນຂະໜານ"
            outlined
            :rules="[(v) => !!v || 'Latitude is required']"
          ></v-text-field>
        </v-col>

        <!-- Longitude -->
        <v-col cols="3">
          <v-text-field
            v-model="formData.longitude"
            label="ເສັ້ນເເວງ"
            outlined
            :rules="[(v) => !!v || 'Longitude is required']"
          ></v-text-field>
        </v-col>

        <!-- Contact Info -->
        <v-col cols="6">
          <v-text-field
            v-model="formData.contact_info"
            label="ຂໍ້ມູນຕິດຕໍ່"
            outlined
          ></v-text-field>
        </v-col>

        <!-- File Input for Updating Image -->

        <v-col cols="12">
          <v-file-input
            v-model="selectedFile"
            label="ເລືອກຮູບພາບ"
            accept="image/*"
            outlined
          ></v-file-input>
        </v-col>

        <!-- Image Preview -->
        <v-col cols="12" v-if="imagePreview">
          <v-img :src="imagePreview" class="mt-3" max-width="300"></v-img>
        </v-col>
        <!-- Buttons -->
        <v-col cols="6">
          <v-btn color="success" @click="updateFacility" :loading="loading"
            >ບັນທຶກການເເກ້ໄຂ</v-btn
          >
        </v-col>
        <v-col cols="6">
          <v-btn color="error" @click="cancel">ຍົກເລີກ</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import { gql } from '@apollo/client/core'

const GET_FACILITY_TYPES = gql`
  query {
    facility_type {
      fac_type_id
      name_en
      name_la
      sub_type
    }
  }
`

const GET_FACILITY = gql`
  query GetFacility($_id: uuid!) {
    facilities(where: { fac_id: { _eq: $_id } }) {
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
    }
  }
`

const UPDATE_FACILITY = gql`
  mutation UpdateFacility(
    $_id: uuid!
    $name: String!
    $fac_type_id: uuid!
    $village: String!
    $district: String!
    $province: String!
    $latitude: String!
    $longitude: String!
    $contact_info: String!
    $image_url: String
    $status: Int!
  ) {
    update_facilities(
      where: { fac_id: { _eq: $_id } }
      _set: {
        name: $name
        fac_type_id: $fac_type_id
        village: $village
        district: $district
        province: $province
        Latitude: $latitude
        Longitude: $longitude
        contact_info: $contact_info
        image_url: $image_url
        status: $status
      }
    ) {
      affected_rows
    }
  }
`

export default {
  data() {
    return {
      formData: {
        name: '',
        fac_type_id: null,
        village: '',
        district: '',
        province: '',
        latitude: '',
        longitude: '',
        contact_info: '',
        image_url: '', // Store the current image URL here
        status: 1,
      },
      facTypeItems: [],
      selectedFile: null,
      imagePreview: null,
      loading: false,
      provinceItems: [
        { text: 'ນະຄອນຫຼວງວຽງຈັນ', value: 'ນະຄອນຫຼວງວຽງຈັນ' },
        { text: 'Other Province', value: 'Other Province' },
        // Add other provinces here
      ],
      allDistricts: {
        ນະຄອນຫຼວງວຽງຈັນ: [
          'ຈັນທະບູລີ',
          'ສີໂຄດຕະບອງ',
          'ໄຊເສດຖາ',
          'ສີສັດຕະນາກ',
          'ນາຊາຍທອງ',
          'ໄຊທານີ',
          'ຫາດຊາຍຟອງ	',
          'ສັງທອງ',
          'ປາກງື່ມ',
        ],
        'Other Province': [
          'ເມືອງ 1',
          'ເມືອງ 2',
          // Add other districts here
        ],
        // Add other provinces and their districts here
      },
      districtItems: [],
    }
  },
  apollo: {
    facTypeItems: {
      query: GET_FACILITY_TYPES,
      update: (data) => data.facility_type,
    },
  },
  computed: {
    formattedFacTypeItems() {
      return this.facTypeItems.map((item) => ({
        ...item,
        displayText: `${item.name_la} (${item.sub_type})`,
      }))
    },
  },
  watch: {
    selectedFile(newFile) {
      if (newFile) {
        this.imagePreview = URL.createObjectURL(newFile)
      } else {
        this.imagePreview = null
      }
    },
  },
  mounted() {
    this.loadFacilityData()
  },
  methods: {
    cancel() {
      const fac_id = this.$route.query.fac_id
      if (fac_id) {
        this.$router.push(`/facilities/viewFacility/?fac_id=${fac_id}`)
      }
    },
    async loadFacilityData() {
      const fac_id = this.$route.query.fac_id

      if (fac_id) {
        try {
          const { data } = await this.$apollo.query({
            query: GET_FACILITY,
            variables: { _id: fac_id },
            fetchPolicy: 'no-cache',
          })
          const facility = data.facilities[0]
          this.formData = {
            name: facility.name,
            fac_type_id: facility.fac_type_id,
            village: facility.village,
            district: facility.district,
            province: facility.province,
            latitude: facility.Latitude,
            longitude: facility.Longitude,
            contact_info: facility.contact_info,
            image_url: facility.image_url, // Set the current image URL
            status: facility.status,
          }
          this.updateDistricts(facility.province) // Update districts based on the loaded province
        } catch (error) {
          console.error('Error fetching facility:', error)
        }
      } else {
        console.error('Facility ID not provided in route query')
      }
    },
    updateDistricts(province) {
      console.log('Updating districts for province:', province)
      this.districtItems = this.allDistricts[province] || []
      console.log('District items:', this.districtItems)
      // this.formData.district = '' // Ensure formData.district is cleared when province changes
    },
    async updateFacility() {
      this.loading = true
      try {
        let imageUrl = this.formData.image_url // Initialize with the current image URL

        // Handle image upload if a new file is selected
        if (this.selectedFile) {
          // Delete old image if it exists
          if (this.formData.image_url) {
            await this.deleteImage(this.formData.image_url)
          }

          // Upload new image
          const uploadTask = await this.$fire.storage
            .ref(`facilities/${this.$route.query.fac_id}`)
            .put(this.selectedFile)
          imageUrl = await uploadTask.ref.getDownloadURL()
        }

        // Update facility data in GraphQL
        await this.$apollo.mutate({
          mutation: UPDATE_FACILITY,
          variables: {
            _id: this.$route.query.fac_id,
            name: this.formData.name,
            fac_type_id: this.formData.fac_type_id,
            village: this.formData.village,
            district: this.formData.district,
            province: this.formData.province,
            latitude: this.formData.latitude.toString(),
            longitude: this.formData.longitude.toString(),
            contact_info: this.formData.contact_info,
            image_url: imageUrl, // Use the updated image URL
            status: this.formData.status,
          },
        })

        this.$router.push('/facilities')
      } catch (error) {
        console.error('Error updating facility:', error)
      } finally {
        this.loading = false
      }
    },
    async deleteImage(imageUrl) {
      try {
        // Delete image from Firebase Storage
        const imageRef = this.$fire.storage.refFromURL(imageUrl)
        await imageRef.delete()
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    },
  },
}
</script>

<style scoped></style>
