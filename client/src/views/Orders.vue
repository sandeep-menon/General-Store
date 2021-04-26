<template>
  <v-container class="blue-grey lighten-5" style="height: 100%;">
    <v-alert type="success" border="left" color="green lighten-2" dismissible v-if="this.$route.params.alertMessage">
      {{ this.$route.params.alertMessage }}
    </v-alert>
    <v-card>
      <v-card-title>
        Order History
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field append-icon="mdi-magnify" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-card-title>
      <v-card-text flat>
        <v-divider></v-divider>
        <v-data-table :headers="headers" :items="orders" :search="search" :items-per-page="5">
          <template v-slot:[`item.OrderDate`]="{ item }">
            <span>{{ new Date(item.OrderDate).toLocaleString() }}</span>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <span>
              <v-icon @click="moreDetails(item)">mdi-dots-horizontal</v-icon>
            </span>
          </template>
          <template v-slot:no-data>
            <div class="text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
          </template>
          <template v-slot:no-results>
            <v-alert class="mt-4" :value="true" color="warning" icon="mdi-alert-circle">Order by customer name "{{ search }}" is not found.</v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="960px" persistent>
      <v-card>
        <v-card-title>
          Order Details
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field v-model="moreDetailItem._id" label="Order ID" disabled></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="moreDetailItem.OrderDate" label="Date" disabled></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="moreDetailItem.CustomerName" label="Customer name" disabled></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="moreDetailItem.TotalCost" prefix="$" label="Total amount" disabled></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-data-table :headers="headersItems" :items="moreDetailItem.OrderItems" :items-per-page="5"></v-data-table>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary darken-1" @click="printOrderDetails"><v-icon class="mr-2">mdi-printer</v-icon>Print</v-btn>
          <v-btn color="primary darken-1" @click="close">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="custom-info mt-2">
      <div class="custom-info-icon mr-2"><v-icon>mdi-information</v-icon></div>
      <div class="custom-info-text mt-1"><div class="text-subtitle-2 font-weight-light">All orders are by default sorted by date</div></div>
    </div>
  </v-container>
</template>

<script>
import API from "../api";
export default {
  name: 'Orders',
  data: () => ({
    dialog: false,
    orders: [],
    search: "",
    alertMessage: "",
    headers: [
      {text: "Date", sortable: false, value:'OrderDate'},
      {text: "Customer Name", sortable: false, value:'CustomerName'},
      {text: "Total amount ($)", sortable: false, value:'TotalCost'},
      {text: "Action", sortable: false, value:'action'}
    ],
    headersItems: [
      {text: "Product Name", sortable: false, value: 'OrderItemName'},
      {text: "Selling Price (each)", sortable: false, value: 'OrderItemPrice'},
      {text: "Quantity Sold", sortable: false, value: 'OrderItemQuantity'},
    ],
    moreDetailIndex: -1,
    moreDetailItem: {
      CustomerName: '',
      TotalCost: 0,
      OrderDate: '',
      OrderItems: [
        {OrderItemName: "", OrderItemPrice: 0, OrderItemQuantity: 0},
      ]
    },
  }),

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  async created() {
    this.orders = await API.fetchAllOrders();
  },

  methods: {
    formatDate(date) {
      let s = new Date(date);
      return (s.toString());
    },

    moreDetails(item) {
      item.OrderDate = this.formatDate(item.OrderDate);
      this.moreDetailIndex = this.orders.indexOf(item);
      this.moreDetailItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },

    printOrderDetails() {
      window.print();
      return false;
    }
  }
}
</script>
<style scoped>
    .custom-info {
        display: flex;
    }
</style>