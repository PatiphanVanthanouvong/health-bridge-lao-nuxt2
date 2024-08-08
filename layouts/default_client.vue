<template>
  <v-app :dark="themeDark">
    <v-navigation-drawer
      color="primary"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <template v-slot:prepend>
        <v-toolbar flat color="primary" class="white--text">
          <!-- <v-toolbar-title>Health Bridge Lao</v-toolbar-title> -->
        </v-toolbar>
      </template>
      <v-list dense shaped>
        <v-list-item-group
          v-model="activeItem"
          active-class="active-item-class"
        >
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon class="white--text">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="white--text">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click.stop="signOut()" class="black--text"
            >ອອກຈາກລະບົບ</v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app color="#222b4e">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="white--text" />
      <v-btn icon @click.stop="miniVariant = !miniVariant" class="white--text">
        <v-icon>mdi-chevron-{{ miniVariant ? 'right' : 'left' }}</v-icon>
      </v-btn>
      <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-menu offset-y> </v-menu>
      <v-btn icon @click="toggleTheme()" class="white--text">
        <v-icon>
          {{
            themeDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'
          }}
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'ClientLayout',
  created() {
    const dark = process.client ? localStorage.getItem('dark') : false
    this.$vuetify.theme.dark = dark === 'true'
  },
  data() {
    return {
      clipped: true,
      drawer: false,
      miniVariant: false,
      themeDark: false,
      activeItem: 0,
      activeGroup: null,
      items: [
        { icon: 'mdi-view-dashboard', title: 'ໜ້າຫຼັກ', to: '/' },
        {
          icon: 'mdi-hospital-building',
          title: 'ຈັດການສະຖານທີ່ທາງການເເພດ',
          to: '/facilities',
        },
        {
          icon: 'mdi-map-marker-path',
          title: 'ຈັດການປະເພດສະຖານທີ່ທາງການເເພດ',
          to: '/fac-type',
        },
        {
          icon: 'mdi-medication',
          title: 'ຈັດການການບໍລິການທາງການເເພດ',
          to: '/services',
        },
        {
          icon: 'mdi-account-card',
          title: 'ຈັດການຜູ້ດູເເລລະບົບ',
          to: '/users',
        },
      ],
      title: 'Health Bridge Lao Welcome Our Client',
    }
  },
  methods: {
    async signOut() {
      try {
        await this.$fire.auth.signOut()
        Cookies.remove('userType') // Remove userType cookie
        Cookies.remove('access_token')
        this.$router.push('/login')
      } catch (error) {
        console.error(error)
      }
    },
    toggleTheme() {
      this.themeDark = !this.themeDark
      this.$vuetify.theme.dark = this.themeDark
      localStorage.setItem('dark', this.themeDark)
    },
  },
}
</script>

<style scoped>
.v-main {
  margin: 30px;
}
.v-navigation-drawer {
  background-color: #243168;
}
.v-toolbar {
  background-color: #243168;
}
.v-btn {
  color: black;
}
.v-footer {
  background-color: #243168;
  height: 30px;
}
.v-list-group__header .v-list-item__icon .v-icon,
.v-list-group__header .v-icon,
.v-list-group__header .v-list-item__content {
  color: white !important; /* Ensure the arrow icon and text are white */
}
</style>
