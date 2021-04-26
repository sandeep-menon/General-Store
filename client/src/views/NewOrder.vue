<template>
  <v-container class="blue-grey lighten-5" style="height: 100%;">
    <v-card>
      <v-card-title>
        New Order
      </v-card-title>
      <v-card-text>
        <v-divider></v-divider>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field v-model="orderData.CustomerName" label="Customer Name"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="orderData.TotalCost" label="Total amount" prefix="$" disabled></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-btn color="primary" dark @click="getProductList()" :disabled="orderData.CustomerName == ''"><v-icon class="mr-2">mdi-plus-box</v-icon>Add Item</v-btn>
          </v-row>
        </v-container>
        <v-data-table :headers="headers" :items="orderData.OrderItems" :items-per-page="5"></v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success darken-2" class="mb-4" @click="submitOrder" :disabled="enableSubmitOrder">Submit Order</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog" max-width="960px" persistent>
      <v-card>
        <v-card-title>Add Product</v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-container>
            <v-row>
              <v-select :items="selectItems" v-model="selectedItem" @input="updateDialog"></v-select>
            </v-row>
            <v-row>
              <v-text-field label="Price (per item)" prefix="$" disabled v-model="selectedItemPrice"></v-text-field>
            </v-row>
            <v-row>
              <v-text-field type="number" min="1" :rules="rulesForQuantity" :disabled="selectedItem === ''" v-model="selectedItemQuantity"></v-text-field>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary darken-1" @click="close">Close</v-btn>
          <v-btn color="primary darken-1" @click="addItem" :disabled="!isAddItemValid">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import API from "../api";
export default {
  name: 'NewOrder',

  data: () => ({
    dialog: false,
    orderData: {
      CustomerName: "",
      TotalCost: 0,
      OrderItems: []
    },
    productList: [],
    selectItems: [],
    selectedItem: "",
    selectedItemPrice: 0,
    selectedItemMaxQuantity: 0,
    selectedItemQuantity: 1,
    headers: [
      { text: "Product name", sortable: false, value: "OrderItemName" },
      { text: "Price (each)", sortable: false, value: "OrderItemPrice" },
      { text: "Quantity", sortable: false, value: "OrderItemQuantity" },
      { text: "Item Total ($)", sortable: false, value: "OrderItemTotal" },
    ]
  }),

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  computed: {
    rulesForQuantity : function() {
      return [
        value => !!value || "Required",
        value => (parseInt(value) <= this.selectedItemMaxQuantity) || `Not more than ${this.selectedItemMaxQuantity} in stock`
      ]
    },

    isAddItemValid: function() {
      return this.selectedItemQuantity <= this.selectedItemMaxQuantity && this.selectedItem != "";
    },

    enableSubmitOrder() {
      return this.orderData.CustomerName == '' || this.orderData.OrderItems.length == 0
    },
  },
  methods: {
    async getProductList() {
      this.dialog = true;
      this.productList = await API.getAllProducts();
      this.productList.forEach(element => {
        this.selectItems.push(element.ProductName);
      });
    },

    updateDialog() {
      let fullSelectedItem;
      fullSelectedItem = this.productList.filter(elem => elem.ProductName == this.selectedItem)
      this.selectedItemPrice = fullSelectedItem[0].ProductPrice;
      this.selectedItemMaxQuantity = fullSelectedItem[0].ProductQuantity;
    },

    close() {
      this.dialog = false;
    },

    addItem() {
      this.orderData.OrderItems.push({
        OrderItemName: this.selectedItem,
        OrderItemPrice: this.selectedItemPrice,
        OrderItemQuantity: parseInt(this.selectedItemQuantity),
        OrderItemTotal: parseFloat((this.selectedItemPrice * this.selectedItemQuantity).toFixed(2)),
      });
      this.orderData.TotalCost = parseFloat(this.orderData.TotalCost) + parseFloat((this.selectedItemPrice * this.selectedItemQuantity).toFixed(2));
      this.orderData.TotalCost = parseFloat(this.orderData.TotalCost.toFixed(2));

      // reset all selected item variables
      this.selectItems =  [],
      this.selectedItem =  "",
      this.selectedItemPrice =  0,
      this.selectedItemMaxQuantity =  0,
      this.selectedItemQuantity =  1,
      this.dialog = false;
    },

    async submitOrder() {
      const response = await API.createOrder(this.orderData);
      this.$router.push({ name: "orders", params: { alertMessage: response.message } });
    }
  }
}
</script>
