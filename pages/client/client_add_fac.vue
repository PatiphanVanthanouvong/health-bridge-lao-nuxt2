<template>
  <v-col>
    <v-card height="100vh" outlined style="border-color: black" class="pa-5">
      <v-row>
        <v-col class="col-12 mb-5">
          <div class="mb-3">
            <v-icon left>mdi-table-edit</v-icon>ເພິ່ມສະຖານທີ່ທາງການເເພດໃໝ່
          </div>
          <v-divider style="border-color: black"></v-divider>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="formData.name"
            label="ຊື່ຂອງສະຖານທີ່"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="formData.fac_type_id"
            :items="formattedFacTypeItems"
            item-value="fac_type_id"
            item-text="displayText"
            label="ເລືອກປະເພດສະຖານທີ່"
            outlined
          ></v-select>
        </v-col>

        <v-col cols="4">
          <v-select
            v-model="formData.province"
            :items="provinceItems"
            label="ເເຂວງ"
            outlined
            @change="updateDistricts"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="formData.district"
            :items="districtItems"
            label="ເມືອງ"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="formData.village"
            label="ບ້ານ"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.latitude"
            label="ເສັ້ນຂະໜານ"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.longitude"
            label="ເສັ້ນເເວງ"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="formData.contact_info"
            label="ຂໍ້ມູນຕິດຕໍ່"
            outlined
          ></v-text-field>
        </v-col>

        <!-- Image Upload Field -->
        <v-col cols="6">
          <v-file-input
            v-model="selectedFile"
            label="ເພີ່ມຮູບພາບ"
            accept="image/*"
            outlined
          ></v-file-input>
        </v-col>

        <!-- Image Preview Container -->
        <v-col cols="6">
          <v-img :src="imagePreview" class="mt-3" max-width="150"></v-img>
        </v-col>

        <v-col cols="6">
          <v-btn color="success" @click="addFacility" :loading="loading"
            >ບັນທຶກ</v-btn
          >
        </v-col>
        <v-col cols="6">
          <v-btn color="error" @click="$router.push('/facilities')"
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

const ADD_FACILITY = gql`
  mutation AddFacility(
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
    insert_facilities(
      objects: {
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
  layout: 'default_client',
  data() {
    return {
      formData: {
        name: 'ໂຮງໝໍ ແມ່ ແລະ ເດັກເກີດໃໝ່',
        fac_type_id: null, // Assuming fac_type_id is selected from the list of options
        village: 'ໜອງພະຍາ',
        district: '', // Will be populated based on the selected province
        province: null, // Initial value set to the first province
        latitude: '18.034897',
        longitude: '102.60202',
        contact_info: '021 617 051',

        image_url: null,
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
    'formData.province'(newProvince) {
      this.updateDistricts(newProvince)
    },
  },
  methods: {
    updateDistricts(province) {
      this.districtItems = this.allDistricts[province] || []
      this.formData.district = '' // Reset the district when the province changes
    },
    async uploadImage(file) {
      const storageRef = this.$fire.storage.ref()
      const fileRef = storageRef.child(
        `facilities/${this.formData.name}-${file.name}`
      )
      await fileRef.put(file)
      return await fileRef.getDownloadURL()
    },
    async addFacility() {
      this.loading = true
      try {
        Swal.fire({
          title: 'ກຳລັງບັນທຶກ...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        if (this.selectedFile) {
          const imageUrl = await this.uploadImage(this.selectedFile)
          this.formData.image_url = imageUrl
        } else {
          this.formData.image_url = null
        }

        const result = await this.$apollo.mutate({
          mutation: ADD_FACILITY,
          variables: {
            ...this.formData,
            latitude: this.formData.latitude.toString(),
            longitude: this.formData.longitude.toString(),
          },
        })
        console.log('Facility added:', result)

        Swal.fire({
          title: 'ສຳເລັດ',
          text: 'ເພິ່ມສະຖານທີ່ສຳເລັດແລ້ວ',
          icon: 'success',
        }).then(() => {
          this.$router.push('/facilities')
        })
      } catch (error) {
        console.error('Error adding facility:', error)
        Swal.fire({
          title: 'ມີບັນຫາໃນການເພິ່ມສະຖານທີ່',
          text: 'ກະລຸນາລອງໃໝ່',
          icon: 'error',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
