<template>
    <v-container class="blue-grey lighten-5" style="height: 100%;">
      <v-alert type="success" border="left" color="green lighten-2" dismissible v-if="this.alertMessage">
        {{ this.alertMessage }}
      </v-alert>
        <v-data-table :headers="headers" :items="products" class="elevation-1" :search="search" :items-per-page="5">
            <template v-slot:top>
                <v-card-title>Product Inventory</v-card-title>
                <v-divider></v-divider>
                <v-row class="text-center">
                    <v-spacer></v-spacer>
                    <v-col>
                        <v-dialog v-model="dialog" max-width="670px" persistent>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mt-4" v-bind="attrs" v-on="on" >
                                    <v-icon class="mr-2">mdi-plus-box</v-icon>Add Product
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row v-if="formTitle == 'Update Product'">
                                            <v-text-field v-model="editedItem._id" disabled label="Product ID"></v-text-field>
                                        </v-row>
                                        <v-row>
                                            <v-text-field v-model="editedItem.ProductName" label="Product name" :rules="rulesForProductName"></v-text-field>
                                        </v-row>
                                        <v-row>
                                            <v-text-field v-model="editedItem.ProductPrice" label="Price (per item)" prefix="$" type="number" min="0.01" max="10" step="0.01"></v-text-field>
                                        </v-row>
                                        <v-row>
                                            <v-text-field v-model="editedItem.ProductQuantity" label="Quantity in stock" type="number" min="0" max="100" step="1"></v-text-field>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="secondary darken-1" @click="close">Cancel</v-btn>
                                    <v-btn color="primary darken-1" @click="save" :disabled="!formValid">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col>
                        <v-text-field append-icon="mdi-magnify" label="Search" single-line hide-details v-model="search"></v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>

                <v-dialog v-model="dialogDelete" max-width="670px" persistent>
                    <v-card>
                        <v-card-title class="headline" style="justify-content: center;">Are you sure you want to delete this item?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="secondary darken-1" @click="closeDelete">No</v-btn>
                            <v-btn color="error darken-1" @click="deleteItemConfirm">Yes</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                    
            </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
        <div class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        </template>
        <template v-slot:no-results>
            <v-alert class="mt-4" :value="true" color="warning" icon="mdi-alert-circle">Product with name "{{ search }}" is not found.</v-alert>
        </template>
    </v-data-table>
</v-container>
  
</template>
<script>
  import API from "../api";
  export default {
    data: () => ({
      alertMessage: "",
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Product name', sortable: false, value: 'ProductName', },
        { text: 'Price ($ each)', sortable: false, value: 'ProductPrice', },
        { text: 'Quantity in stock', sortable: false, value: 'ProductQuantity', },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      products: [],
      editedIndex: -1,
      editedItem: {
        ProductName: '',
        ProductPrice: 0,
        ProductQuantity: 0,
      },
      defaultItem: {
        ProductName: '',
        ProductPrice: 0,
        ProductQuantity: 0,
      },
      search: "",
      rulesForProductName: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters',
        value => (value && value.length <= 30) || 'Max 30 characters',
      ],
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Add Product' : 'Update Product'
      },
      formValid () {
        return this.editedItem.ProductName != "" && this.editedItem.ProductName.length > 3 && this.editedItem.ProductName.length < 30
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    async created () {
      await this.initialize()
    },

    methods: {
      async initialize () {
        this.products = await API.getAllProducts();
      },

      editItem (item) {
        this.editedIndex = this.products.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.products.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        const formData = {
          id: this.editedItem._id,
        }
        const response = await API.deleteProduct(formData);
        this.alertMessage = response.message;
        this.products.splice(this.editedIndex, 1);
        this.closeDelete();
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      async save () {
        if (this.editedIndex > -1) {
          const formData = {
            ProductName: this.editedItem.ProductName,
            ProductPrice: this.editedItem.ProductPrice,
            ProductQuantity: this.editedItem.ProductQuantity,
            id: this.editedItem._id,
          }
          const response = await API.updateProduct(formData);
          this.alertMessage = response.message;
          Object.assign(this.products[this.editedIndex], this.editedItem)
        } else {
          // this.products.push(this.editedItem)
          const formData = {
            ProductName : this.editedItem.ProductName,
            ProductPrice : this.editedItem.ProductPrice,
            ProductQuantity : this.editedItem.ProductQuantity,
          }
          const response = await API.createProduct(formData);
          this.alertMessage = response.message;
          formData._id = response.newProductId;
          this.products.push(formData);
        }
        this.close();
      },
    },
  }
</script>