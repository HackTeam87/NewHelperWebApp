<template>
  <div class="main">
    <v-container fluid grid-list-md>
     
      <v-layout row wrap>
       
        <v-toolbar flat>
           
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
          
          <v-tabs grow v-model="tab" centered icons-and-text outlined mobile-breakpoint>
            <v-tabs-slider color="#fec422"></v-tabs-slider>
            <v-tab href="#tab-1" v-on:click="DeviceInterface()">Interfaces</v-tab>
            <v-tab href="#tab-2" v-on:click="DeviceArp()">ARPs</v-tab>
            <v-tab href="#tab-3" v-on:click="DeviceRouteList()">Route List</v-tab>
            <v-tab href="#tab-4" v-on:click="DeviceAddressList()">Address-lists</v-tab>
            <v-tab href="#tab-5" v-on:click="DeviceBGPSessions()">BGP-sessions</v-tab>
          </v-tabs>
        </v-toolbar>

        <v-flex d-flex md9 sm12 xs12>
           <v-alert border="top" colored-border type="info" elevation="2" v-if="loading"> Loading ... </v-alert>
          <v-list>
            <v-list-group :value="true" prepend-icon="mdi-card-text-outline">
              <template v-slot:activator>
                <v-list-item-title>Info</v-list-item-title>
              </template>


              <v-tabs-items v-model="tab">

                <v-tab-item value="tab-1">
                  <v-container>
                    <v-card>

                      <v-card-title class="text-caption">
                        <v-text-field v-model="searchInterface" append-icon="mdi-magnify"
                          label="name, type, status, mac" single-line hide-details></v-text-field>
                      </v-card-title>


                      <v-data-table mobile-breakpoint="0" :headers="InterfaceHeaders" :items="filteredInterface"
                        item-key="name" class="elevation-1" :searchInterface="searchInterface"
                        :footer-props="footerProps">

                        <template v-slot:body="{ items }">

                          <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                              <td class="text-caption text-left">{{ item['name'] }}</td>
                              <td class="text-caption text-left">{{ item['type'] }}</td>
                              <td class="text-caption text-left">
                                <span v-html="DeviceStatus(item['running'], item['disabled'])"></span>
                              </td>
                              <td class="text-caption text-left">{{ item['mac-address'] }}</td>

                            </tr>
                          </tbody>
                        </template>
                      </v-data-table>

                    </v-card>
                  </v-container>
                </v-tab-item>


                <v-tab-item value="tab-2">
                  <v-container>
                    <v-card>

                      <v-card-title>
                        <v-text-field v-model="searchArp" append-icon="mdi-magnify" label="ip,mac,interface,comment"
                          single-line hide-details></v-text-field>
                      </v-card-title>

                      <v-data-table mobile-breakpoint="0" :headers="ArpHeaders" :items="filteredArp" item-key="name"
                        class="elevation-1" :searchArp="searchArp" :footer-props="footerProps">

                        <template v-slot:body="{ items }">

                          <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                              <td class="text-left">
                                <span v-if="item['dynamic'] === true" class="colors-blue">D</span>
                                <span v-else class="colors-black">S</span>
                                <span v-if="item['complete'] === true" class="colors-black">C</span>
                                <span v-if="item['DHCP'] === true" class="colors-violet">H</span>
                                <span v-if="item['published'] === true" class="colors-black">P</span>
                                <span v-if="item['disabled'] === true" class="colors-gray">X</span>
                                <span v-if="item['invalid'] === true" class="colors-red">I</span>

                                <template>
                                  <div class="text-center ma-2">
                                    ArpPing
                                    <v-btn icon color="green"
                                      @click="DeviceArpPing(item['address'], item['interface']), snackbar = true">
                                      <v-icon>mdi-cached</v-icon>
                                    </v-btn>

                                    <v-snackbar v-model="snackbar" :timeout="timeout">
                                      <v-subheader dark v-if="loading">Loading...</v-subheader>
                                      <v-list v-for="(ping, index) in  deviceArpPing" :key="index">
                                        <v-list-item>
                                          <v-list-item-action>
                                            <v-icon>mdi-lan-connect</v-icon>
                                          </v-list-item-action>
                                          {{ ping }}
                                        </v-list-item>
                                      </v-list>

                                      <template v-slot:action="{ attrs }">
                                        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                                          Close
                                        </v-btn>
                                      </template>
                                    </v-snackbar>
                                  </div>
                                </template>
                              </td>

                              <td>
                                <div data-app>
                                  <v-dialog transition="dialog-top-transition" max-width="600">
                                    <template v-slot:activator="{ on, attrs }">
                                      <a class="text-caption" dark color="error" v-bind="attrs" v-on="on"
                                        @click="DeviceLease(item['address'])">

                                        <v-icon>mdi-ip-network</v-icon>
                                        {{ item['address'] }}
                                      </a>
                                    </template>
                                    <template v-slot:default="dialog">
                                      <v-card>
                                        <v-toolbar color="error" dark>
                                          {{ item['address'] }}
                                        </v-toolbar>
                                        <v-card-text v-if="deviceLease != 'Empty Search Value'">


                                          <v-list v-for="(item, index) in deviceLease" :key="index">

                                            <v-list-item>

                                              <v-list-item-content>
                                                <v-list-item-title>
                                                  Status:
                                                  <span v-if="item['dynamic'] === true" class="colors-blue">D</span>
                                                  <span v-else class="colors-black">S</span>
                                                  <span v-if="item['radius'] === true" class="colors-violet">R</span>
                                                  <span v-if="item['blocked'] === true" class="colors-black">B</span>
                                                  <span v-if="item['disabled'] === true" class="colors-gray">X</span>

                                                  (<span v-if="item['status'] === 'bound'" class="colors-green">
                                                    {{ item['status'] }}</span>
                                                  <span v-else class="colors-red"> {{ item['status'] }}</span>)
                                                </v-list-item-title>
                                              </v-list-item-content>


                                            </v-list-item>


                                            <v-list-item v-if="item['host-name']">

                                              <v-list-item-action>
                                                <v-icon>mdi-lan-connect</v-icon>
                                              </v-list-item-action>

                                              <v-list-item-content>
                                                <v-list-item-title>: {{ item['host-name'] }}</v-list-item-title>
                                              </v-list-item-content>

                                              <v-list-item-action>
                                                <v-icon>mdi-flag-outline</v-icon>
                                              </v-list-item-action>

                                              <v-list-item-content>
                                                <v-list-item-title> dhcp-option: {{ item['dhcp-option'] }}
                                                </v-list-item-title>
                                              </v-list-item-content>

                                            </v-list-item>


                                            <v-list-item>

                                              <v-list-item-action>
                                                <v-icon>mdi-numeric</v-icon>
                                              </v-list-item-action>

                                              <v-list-item-content>
                                                <v-list-item-title> IP: {{ item['address'] }}</v-list-item-title>
                                              </v-list-item-content>

                                              <v-list-item-action>
                                                <v-icon>mdi-numeric</v-icon>
                                              </v-list-item-action>

                                              <v-list-item-content>
                                                <v-list-item-title> active-IP: {{ item['active-address'] }}
                                                </v-list-item-title>
                                              </v-list-item-content>

                                            </v-list-item>



                                            <v-list-item>

                                              <v-list-item-action>
                                                <v-icon>mdi-alphabetical</v-icon>
                                              </v-list-item-action>

                                              <v-list-item-content>
                                                <v-list-item-title> Mac: {{ item['mac-address'] }}</v-list-item-title>
                                              </v-list-item-content>


                                              <v-list-item-action>
                                                <v-icon>mdi-server-network</v-icon>
                                              </v-list-item-action>

                                              <v-list-item-content>
                                                <v-list-item-title> server: {{ item['server'] }}</v-list-item-title>
                                              </v-list-item-content>

                                            </v-list-item>




                                            <v-list-item>

                                              <v-list-item-action>
                                                <v-icon>mdi-account-search</v-icon>
                                              </v-list-item-action>

                                              <v-list-item-content>
                                                <v-list-item-title> last-seen: {{ item['last-seen'] }}
                                                </v-list-item-title>
                                              </v-list-item-content>


                                              <v-list-item-action>
                                                <v-icon>mdi-content-paste</v-icon>
                                              </v-list-item-action>

                                              <v-list-item-content>
                                                <v-list-item-title>: {{ item['comment'] }}</v-list-item-title>
                                              </v-list-item-content>

                                            </v-list-item>



                                            <v-list-item>

                                              <v-list-item-action>
                                                <v-icon>mdi-rotate-right</v-icon>
                                              </v-list-item-action>

                                              <v-list-item-content>
                                                <v-list-item-title> expires-after: {{ item['expires-after'] }}
                                                </v-list-item-title>
                                              </v-list-item-content>


                                              <v-list-item-action>
                                                <v-icon>mdi-format-list-checks</v-icon>
                                              </v-list-item-action>

                                              <v-list-item-content>
                                                <v-list-item-title> address-lists: {{ item['address-lists'] }}
                                                </v-list-item-title>
                                              </v-list-item-content>

                                            </v-list-item>

                                          </v-list>

                                        </v-card-text>

                                        <v-card-text v-else>
                                          Not Found in DHCP Server
                                        </v-card-text>

                                        <v-card-actions class="justify-end">
                                          <v-spacer></v-spacer>
                                          <v-btn text @click="dialog.value = false">Close
                                          </v-btn>
                                        </v-card-actions>
                                      </v-card>

                                    </template>
                                  </v-dialog>
                                </div>
                              </td>
                              <td class="text-caption text-left">{{ item['mac-address'] }}</td>
                              <td class="text-caption text-left">{{ item['interface'] }}</td>

                              <td class="text-caption text-left">{{ item['comment'] }}</td>

                            </tr>
                          </tbody>
                        </template>
                      </v-data-table>

                    </v-card>
                  </v-container>
                </v-tab-item>

                <v-tab-item value="tab-3">
                  <v-container>
                    <v-card>
                      <v-card-title class="text-caption">
                        <v-text-field v-model="searchRoute" append-icon="mdi-magnify"
                          label="dst-address, pref-src, gateway, distance" single-line hide-details></v-text-field>
                      </v-card-title>


                      <v-data-table mobile-breakpoint="0" :headers="RouteHeaders" :items="filteredRoute" item-key="name"
                        class="elevation-1" :searchRoute="searchRoute" :footer-props="footerProps">

                        <template v-slot:body="{ items }">

                          <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                              <td class="text-caption text-left">
                                <span v-if="item['disabled'] === true">X</span>
                                <span v-if="item['active'] === true">A</span>
                                <span v-if="item['dynamic'] === true">D</span>
                                <span v-else>S</span>
                              </td>
                              <td class="text-caption text-left">
                                <span v-if="item['active'] === false" class="colors-inactive">
                                  {{ item['dst-address'] }}
                                </span>
                                <span v-else>
                                  {{ item['dst-address'] }}
                                </span>
                              </td>
                              <td class="text-caption text-left">{{ item['pref-src'] }}</td>
                              <td class="text-caption text-left">
                                <span v-if="item['active'] === false" class="colors-inactive">
                                  {{ item['gateway'] }}
                                </span>
                                <span v-else>
                                  {{ item['gateway'] }}
                                </span>
                              </td>
                              <td class="text-caption text-left">

                                <span v-if="item['active'] === false" class="colors-inactive">
                                  {{ item['gateway-status'] }}
                                </span>
                                <span v-else>
                                  {{ item['gateway-status'] }}
                                </span>

                              </td>

                              <td class="text-caption text-left">

                                <span v-if="item['active'] === false" class="colors-inactive">
                                  {{ item['distance'] }}
                                </span>
                                <span v-else>
                                  {{ item['distance'] }}
                                </span>

                              </td>
                              <td class="text-caption text-left">

                                <span v-if="item['active'] === false" class="colors-inactive">
                                  {{ item['scope'] }}
                                </span>
                                <span v-else>
                                  {{ item['scope'] }}
                                </span>

                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-container>
                </v-tab-item>

                <v-tab-item value="tab-4">
                  <v-container>
                    <v-card-title class="text-caption">
                      <v-text-field v-model="searchAddressList" append-icon="mdi-magnify" label="list,address"
                        single-line hide-details></v-text-field>
                    </v-card-title>

                    <v-card>
                      <v-data-table mobile-breakpoint="0" :headers="AddressListHeaders" :items="filteredAddressList"
                        class="elevation-1" :searchAddressList="searchAddressList" :footer-props="footerProps">

                        <template v-slot:body="{ items }">

                          <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                              <td class="text-caption text-left">
                                <span v-if="item['disabled'] === true" class="colors-gray">X</span>
                                <span v-if="item['dynamic'] === true" class="colors-blue">D</span>
                                <span v-else class="colors-black">S</span>
                              </td>
                              <td class="text-caption text-left">{{ item['list'] }}</td>
                              <td class="text-caption text-left">{{ item['address'] }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-container>
                </v-tab-item>

                <v-tab-item value="tab-5">
                  <v-container>
                    <v-card v-if="deviceBGPSessions != 'Empty Search Value'">

                      <v-data-table mobile-breakpoint="0" :headers="BGPHeaders" :items="deviceBGPSessions"
                        item-key="name" class="elevation-1" :footer-props="footerProps">

                        <template v-slot:body="{ items }">

                          <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                              <td class="text-caption text-left">{{ item['instance'] }}</td>
                              <td class="text-caption text-left">{{ item['remote-address'] }}</td>
                              <td class="text-caption text-left">{{ item['local-address'] }}</td>
                              <td class="text-caption text-left">{{ item['remote-as'] }}</td>
                              <td class="text-caption text-left">{{ item['nexthop-choice'] }}</td>
                              <td class="text-caption text-left">{{ item['default-originate'] }}</td>

                              <td class="text-caption text-left">
                                <span v-html="DeviceBGPStatus(item['established'], item['disabled'])"></span>
                              </td>

                            </tr>
                          </tbody>
                        </template>
                      </v-data-table>
                    </v-card>

                    <v-card v-else>
                      <v-card-text>
                        Not Found in BGP Sessions
                      </v-card-text>
                    </v-card>
                  </v-container>
                </v-tab-item>



              </v-tabs-items>
            </v-list-group>
          </v-list>
        </v-flex>

        <v-flex d-flex md3 sm12 xs12>
          <v-list>

            <v-list-group :value="false" prepend-icon="mdi-atom">
              <template v-slot:activator>
                <v-list-item-title>Atom</v-list-item-title>
              </template>

              <v-card>

                <v-img class="white--text align-end" height="150px"
                  src="https://images.prom.ua/3653457679_marshrutizator-mikrotik-cloud.jpg">
                </v-img>

                <v-card-title>
                  <span class="colors-blue">D-Dynamic</span>
                  <v-spacer></v-spacer>
                  <span class="colors-black"> C-Complite</span>
                  <v-spacer></v-spacer>
                  <span class="colors-violet">H-DHCP</span>
                  <v-spacer></v-spacer>
                  <span class="colors-violet">R-Radius</span>
                  <v-spacer></v-spacer>
                  <span class="colors-gray">P-Published</span>
                  <v-spacer></v-spacer>
                  <span class="colors-black">S-Static</span>
                  <v-spacer></v-spacer>
                  <span class="colors-gray">X-Disabled</span>
                  <v-spacer></v-spacer>
                  <span class="colors-red">I-invalid</span>
                  <v-spacer></v-spacer>
                </v-card-title>
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
      deviceList: [],

      InterfaceHeaders: [
        { text: 'name', width: "25%", show: true, value: '' },
        { text: 'type', width: "25%", show: true, value: '' },
        { text: 'status', width: "25%", show: true, value: '' },
        { text: 'mac-address', width: "25%", show: true, value: '' },
      ],
      deviceInterface: [],

      ArpHeaders: [
        { text: 'flags', width: "12%", show: true, value: '' },
        { text: 'ip', width: "22%", show: true, value: '' },
        { text: 'mac-address', width: "22%", show: true, value: '' },
        { text: 'interface', width: "22%", show: true, value: '' },
        { text: 'comment', width: "22%", show: true, value: '' },
      ],
      deviceArp: [],

      BGPHeaders: [
        { text: 'instance', width: "12%", show: true, value: '' },
        { text: 'remote-address', width: "13%", show: true, value: '' },
        { text: 'local-address', width: "13%", show: true, value: '' },
        { text: 'remote-as', width: "10%", show: true, value: '' },
        { text: 'nexthop-choice', width: "13%", show: true, value: '' },
        { text: 'default-originate', width: "10%", show: true, value: '' },
        { text: 'state', width: "10%", show: true, value: '' },
      ],
      deviceBGPSessions: [],

      RouteHeaders: [
        { text: 'flags', width: "10%", show: true, value: '' },
        { text: 'dst-address', width: "20%", show: true, value: '' },
        { text: 'pref-src', width: "15%", show: true, value: '' },
        { text: 'gateway', width: "15%", show: true, value: '' },
        { text: 'gateway-status', width: "15%", show: true, value: '' },
        { text: 'distance', width: "10%", show: true, value: '' },
        { text: 'scope', width: "10%", show: true, value: '' },
      ],
      deviceRouteList: [],

      AddressListHeaders: [
        { text: 'flags', width: "10%", show: true, value: '' },
        { text: 'list', width: "45%", show: true, value: '' },
        { text: 'address', width: "45%", show: true, value: '' },
      ],

      deviceAddressList: [],
      deviceLease: [],
      deviceArpPing: [],


      snackbar: false,
      timeout: 50000,
      tab: null,
      active_tab: 3,
      value: 0,
      loading: false,
      deviceId: '',
      searchInterface: '',
      searchAddressList: '',
      searchArp: '',
      searchBGP: '',
      searchRoute: '',
      footerProps: { 'items-per-page-options': [5, 10, -1] },
    }
  },
  created() {
    this.deviceId = this.getIdFromQuery()
    this.DeviceRouteList()
  },
  methods: {
    async DeviceInterface() {

      const response0 = await this.$api.auth.MikrotikInterface(this.deviceId).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceInterface = response0.data
    },

    async DeviceList() {

      const response1 = await this.$api.auth.MikrotikList().catch(() => {
        this.error = 'ERROR'
      })
      this.deviceList = response1.data
    },
    async DeviceArp() {
      this.loading = true;
      const response2 = await this.$api.auth.MikrotikArp(this.deviceId).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceArp = response2.data
      this.loading = false;
    },

    async DeviceLease(deviceMacOrIp) {

      const response3 = await this.$api.auth.MikrotikLease(this.deviceId, deviceMacOrIp).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceLease = response3.data
    },

    async DeviceArpPing(Ip, Vlan) {
      this.loading = true;
      const response4 = await this.$api.auth.MikrotikArpPing(this.deviceId, Ip, Vlan).catch(() => {
        this.error = 'ERROR'
      })
      setTimeout(this.deviceArpPing = response4.data, 2000);
      this.loading = false;
    },

    async DeviceBGPSessions() {

      const response5 = await this.$api.auth.MikrotikBGPSessions(this.deviceId).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceBGPSessions = response5.data
    },

    async DeviceRouteList() {

      const response6 = await this.$api.auth.MikrotikRouteList(this.deviceId).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceRouteList = response6.data
    },

    async DeviceAddressList() {
      this.loading = true;
      const response7 = await this.$api.auth.MikrotikAddressList(this.deviceId).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceAddressList = response7.data
      this.loading = false;
    },

    getIdFromQuery() {
      console.log(this.$route);
      if (typeof this.$route.query.id !== 'undefined') {
        return this.$route.query.id;
      }
      return "";
    },

    DeviceStatus(running, disabled) {
      if (disabled === true) { return "<p style='color:grey;'>DISABLED</p>"; }
      if (running === false) { return "<p style='color:red;'>DOWN</p>"; }
      else return "<p style='color:green;'>UP</p>";
    },
    DeviceBGPStatus(established, disabled) {
      if (disabled === true) { return "<p style='color:grey;'>DISABLED</p>"; }
      if (established === false) { return "<p style='color:red;'>DOWN</p>"; }
      else return "<p style='color:green;'>ESTABLISHED</p>";
    }
  },

  mounted() {
    this.tab = 'tab-3';
  },

  computed: {
    filteredAddressList() {
      return this.deviceAddressList.filter((i) => {
        return !this.searchAddressList || (i['list'] + '||' + i['address'])
          .toUpperCase().indexOf(this.searchAddressList.toUpperCase()) !== -1
      })
    },
    filteredInterface() {
      return this.deviceInterface.filter((i) => {
        return !this.searchInterface || (i['name'] + '||' + i['type'] + '||' + i['mac-address'])
          .toUpperCase().indexOf(this.searchInterface.toUpperCase()) !== -1
      })
    },
    filteredRoute() {
      return this.deviceRouteList.filter((i) => {
        return !this.searchRoute || (i['dst-address'] + '||' + i['pref-src'] + '||' + i['gateway'] + '||' + i['distance'])
          .toUpperCase().indexOf(this.searchRoute.toUpperCase()) !== -1
      })
    },
    filteredArp() {
      return this.deviceArp.filter((i) => {
        return !this.searchArp || (i['address'] + '||' + i['mac-address'] + '||' + i['interface'] + '||' + i['comment'])
          .toUpperCase().indexOf(this.searchArp.toUpperCase()) !== -1
      })
    }
  }

}


</script>


<style scoped>
.colors-inactive {
  color: #3f51b5;
}

.colors-blue {
  color: lightskyblue;
}

.colors-black {
  color: black;
}

.colors-gray {
  color: gray;
}

.colors-violet {
  color: darkviolet;
}

.colors-red {
  color: red;
}

.colors-green {
  color: green;
}
</style>


