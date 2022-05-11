<template>
  <div class="main">
    <v-container fluid grid-list-md>
      <v-layout row wrap>


        <v-flex d-flex md4 sm12 xs12>
          <v-list>

            <v-list-group :value="true" prepend-icon="mdi-atom">
              <template v-slot:activator>
                <v-list-item-title>Atom</v-list-item-title>
              </template>

              <v-card>

                <v-img class="white--text align-end" height="150px"
                  src="https://images.prom.ua/3653457679_marshrutizator-mikrotik-cloud.jpg">
                </v-img>

                <v-card-text>
                  <v-divider color="#fec422"> </v-divider>
                  <br>

                  <div class="d-flex justify-space-between text-caption">
                    <v-icon>mdi-file-document-multiple-outline</v-icon>
                    Name:
                  </div>

                  <div class="d-flex justify-space-between text-caption">
                    <v-icon>mdi-map-marker-radius-outline</v-icon>
                    IP:
                  </div>

                  <div class="d-flex justify-space-between text-caption">
                    <v-icon>mdi-globe-model</v-icon>
                    Model:
                  </div>

                  <div class="d-flex justify-space-between text-caption">
                    <v-icon>mdi-sort-clock-descending-outline</v-icon>
                    Uptime:
                  </div>

                </v-card-text>

              </v-card>
            </v-list-group>
          </v-list>

          <v-list>

            <v-list-group :value="true" prepend-icon="mdi-atom">
              <template v-slot:activator>
                <v-list-item-title>Atom</v-list-item-title>
              </template>

              <v-card hover data-aos="zoom-in" data-aos-easing="ease" href="/">

                <v-img class="white--text align-end" height="150px"
                  src="https://images.prom.ua/3653457679_marshrutizator-mikrotik-cloud.jpg">
                </v-img>

                <v-card-text>
                  <v-divider color="#fec422"> </v-divider>
                  <br>

                  <div class="d-flex justify-space-between text-caption">
                    <v-icon>mdi-file-document-multiple-outline</v-icon>
                    Name:
                  </div>

                  <div class="d-flex justify-space-between text-caption">
                    <v-icon>mdi-map-marker-radius-outline</v-icon>
                    IP:
                  </div>

                  <div class="d-flex justify-space-between text-caption">
                    <v-icon>mdi-globe-model</v-icon>
                    Model:
                  </div>

                  <div class="d-flex justify-space-between text-caption">
                    <v-icon>mdi-sort-clock-descending-outline</v-icon>
                    Uptime:
                  </div>

                </v-card-text>

              </v-card>
            </v-list-group>
          </v-list>
        </v-flex>



        <v-flex d-flex md8 sm12 xs12>
          <v-list>
            <v-list-group :value="true" prepend-icon="mdi-card-text-outline">
              <template v-slot:activator>
                <v-list-item-title>Info</v-list-item-title>
              </template>



              <v-tabs v-model="tab" centered icons-and-text outlined>
                <v-tabs-slider color="#fec422"></v-tabs-slider>
                <v-tab href="#tab-1">Interfaces</v-tab>
                <v-tab href="#tab-2">ARPs</v-tab>
                <v-tab href="#tab-3">Leases</v-tab>
                <v-tab href="#tab-4">DHCP-servers</v-tab>
                <v-tab href="#tab-5">Address-lists</v-tab>
                <v-tab href="#tab-6">BGP-sessions</v-tab>
                <v-tab href="#tab-7">Connections</v-tab>
              </v-tabs>



              <v-tabs-items v-model="tab">

                <v-tab-item value="tab-1">
                  <v-container>
                    <v-card >


                      <v-data-table :headers="headers" :items="desserts" item-key="name" class="elevation-1"
                        :search="search" :custom-filter="filterOnlyCapsText">
                        <template v-slot:top>
                          <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
                        </template>
                       
                          <tr>
                            <td></td>
                            <td>
                              <v-text-field v-model="calories" type="number" label="Less than"></v-text-field>
                            </td>
                            <td colspan="4"></td>
                          </tr>
                      
                      </v-data-table>

                    </v-card>
                  </v-container>
                </v-tab-item>


                <v-tab-item value="tab-2">
                  <v-container>
                    <v-card hover data-aos="zoom-in" data-aos-easing="ease" href="/">
                      <v-card-title class="font-weight-medium headline">Right</v-card-title>
                      <v-card-text>2</v-card-text>
                    </v-card>
                  </v-container>
                </v-tab-item>

                <v-tab-item value="tab-3">
                  <v-container>
                    <v-card hover data-aos="zoom-in" data-aos-easing="ease" href="/">
                      <v-card-title class="font-weight-medium headline">Right</v-card-title>
                      <v-card-text>3</v-card-text>
                    </v-card>
                  </v-container>
                </v-tab-item>

                <v-tab-item value="tab-4">
                  <v-container>
                    <v-card hover data-aos="zoom-in" data-aos-easing="ease" href="/">
                      <v-card-title class="font-weight-medium headline">Right</v-card-title>
                      <v-card-text>4</v-card-text>
                    </v-card>
                  </v-container>
                </v-tab-item>

                <v-tab-item value="tab-5">
                  <v-container>
                    <v-card hover data-aos="zoom-in" data-aos-easing="ease" href="/">
                      <v-card-title class="font-weight-medium headline">Right</v-card-title>
                      <v-card-text>5</v-card-text>
                    </v-card>
                  </v-container>
                </v-tab-item>

                <v-tab-item value="tab-6">
                  <v-container>
                    <v-card hover data-aos="zoom-in" data-aos-easing="ease" href="/">
                      <v-card-title class="font-weight-medium headline">Right</v-card-title>
                      <v-card-text>6</v-card-text>
                    </v-card>
                  </v-container>
                </v-tab-item>

                <v-tab-item value="tab-7">
                  <v-container>
                    <v-card hover data-aos="zoom-in" data-aos-easing="ease" href="/">
                      <v-card-title class="font-weight-medium headline">Right</v-card-title>
                      <v-card-text>7</v-card-text>
                    </v-card>
                  </v-container>
                </v-tab-item>
              </v-tabs-items>
            </v-list-group>
          </v-list>
        </v-flex>

        <v-flex d-flex md12 sm12 xs12>
          <p class="text-center">Helper 1.1</p>
        </v-flex>

      </v-layout>

    </v-container>

  </div>
</template>


<script>
export default {
  data() {
    return {
      tab: null,
      search: '',
      calories: '',
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
        },
      ],
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Calories',
          value: 'calories',
          filter: value => {
            if (!this.calories) return true

            return value < parseInt(this.calories)
          },
        },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ]
    },
    filteredItems() {
                return this.desserts.filter((i) => {
                    return !this.search || (i['Dessert'] + '||' + i['Calories'] + '||' + i['Fat'])
                        .toUpperCase().indexOf(this.search.toUpperCase()) !== -1
                })
            }
  },
  
}
</script>


