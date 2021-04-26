<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            General Store
          </v-list-item-title>
          <v-list-item-subtitle>
            Menu
          </v-list-item-subtitle>
          <v-divider class="mt-2"></v-divider>
        </v-list-item-content>
      </v-list-item>

      <v-list rounded>
        <v-subheader>What do you want to do today?</v-subheader>
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>General Store</v-toolbar-title>
      <!-- <v-switch v-model="$vuetify.theme.dark"></v-switch> -->
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ 
      drawer: null,
      selectedItem: 0,
      items: [
        { title: 'Dashboard', icon: 'mdi-home', link: "/" },
        { title: 'New Order', icon: 'mdi-cart-plus', link: "/newOrder" },
        { title: 'Product Inventory', icon: 'mdi-clipboard-list-outline', link: "/products" },
        { title: 'Order History', icon: 'mdi-history', link: "/orders" },
      ], 
      }),
  }
</script>