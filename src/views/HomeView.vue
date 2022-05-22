<template>

  <div class="main">
    <v-container fluid grid-list-md>

      <v-layout row wrap>
        <v-flex d-flex md12 sm12 xs12>
          <v-alert outlined dense type="success" v-if="loading">Loading ...</v-alert>
        </v-flex>

        <v-flex d-flex md2 sm12 xs12>

          <v-list>

            <v-list-group :value="height()" prepend-icon="mdi-atom">
              <template v-slot:activator>
                <v-list-item-title>Atom</v-list-item-title>
              </template>

              <v-card>

                <v-img class="white--text align-end" height="140px"
                  src="https://images.prom.ua/3653457679_marshrutizator-mikrotik-cloud.jpg">
                </v-img>

                <v-app>
                  <v-card-text v-for="(item, index) in deviceBase" :key="index">

                    <div class="d-flex justify-space-between text-caption">
                      <v-icon>mdi-file-document-multiple-outline</v-icon>
                      Board: {{ item['board-name'] }}
                    </div>

                    <div class="d-flex justify-space-between text-caption">
                      <v-icon>mdi-globe-model</v-icon>
                      Version: {{ item['version'] }}
                    </div>


                    <div class="d-flex justify-space-between text-caption">
                      <v-icon>mdi-sort-clock-descending-outline</v-icon>
                      Uptime: {{ item['uptime'] }}
                    </div>
                    <br>
                    <v-divider color="#fec422"> </v-divider>
                    <br>
                    <div>

                      Cpu:
                      <v-progress-linear v-model="item['cpu-load']" :color="getColor(item['cpu-load'])" height="20">
                        <strong><span>{{ item['cpu-load'] }}</span>%</strong>
                      </v-progress-linear>
                      <br>
                      Memory:
                      <v-progress-linear v-model="memory"
                        :color="getColor(calcMem(item['total-memory'], item['free-memory']))" height="20">
                        <strong><span v-html="calcMem(item['total-memory'], item['free-memory'])"></span>%</strong>
                      </v-progress-linear>
                      <br>
                      Flash:
                      <v-progress-linear v-model="flash"
                        :color="getColor(calcFlash(item['total-hdd-space'], item['free-hdd-space']))" height="20">
                        <strong><span
                            v-html="calcFlash(item['total-hdd-space'], item['free-hdd-space'])"></span>%</strong>
                      </v-progress-linear>
                    </div>


                  </v-card-text>

                  <v-card-title class="overline">
                    <span class="colors-black ">A-Active</span>
                    <v-spacer></v-spacer>
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
                </v-app>

              </v-card>
            </v-list-group>
          </v-list>
        </v-flex>

        <v-flex d-flex md10 sm12 xs12>

          <v-list app bottom fixed style="width: 100%;" padless>
            <v-list-group :value="true" prepend-icon="mdi-card-text-outline">
              <template v-slot:activator>
                <v-list-item-title>Info</v-list-item-title>
              </template>

              <v-toolbar flat v-if="height()">

                <v-tabs grow v-model="tab" centered outlined mobile-breakpoint>
                  <v-tabs-slider color="#fec422"></v-tabs-slider>

                  <v-tab href="#tab-2" @click="DeviceArp()">
                    <v-icon> mdi-format-vertical-align-center</v-icon>
                    ARPs
                  </v-tab>

                  <v-tab href="#tab-6" @click="DeviceQueue()">
                    <v-icon>mdi-speedometer</v-icon>
                    Speed
                  </v-tab>

                  <v-tab href="#tab-4" @click="DeviceAddressList()">
                    <v-icon>mdi-clipboard-list-outline</v-icon>
                    Address-lists
                  </v-tab>

                  <v-tab href="#tab-3" @click="DeviceRouteList()">
                    <v-icon>mdi-routes</v-icon>
                    Route List
                  </v-tab>

                  <v-tab href="#tab-5" @click="DeviceBGPSessions()">
                    <v-icon>mdi-alpha-b-circle-outline</v-icon>
                    BGP-sessions
                  </v-tab>

                  <v-tab href="#tab-1" @click="DeviceInterface()">
                    <v-icon>mdi-ethernet</v-icon>
                    Interfaces
                  </v-tab>

                </v-tabs>

              </v-toolbar>


              <v-tabs-items v-model="tab" touchless>
                <v-app>

                  <v-tab-item value="tab-1" data-app>
                    <v-container>
                      <v-card>

                        <v-card-title class="text-caption">
                          <v-text-field v-model="searchInterface" append-icon="mdi-magnify"
                            label="name, type, status, mac" single-line hide-details></v-text-field>
                        </v-card-title>


                        <v-data-table light calculate-widths mobile-breakpoint="0" :headers="InterfaceHeaders"
                          :items="filteredInterface" item-key="name" :searchInterface="searchInterface"
                          :footer-props="footerProps">

                          <template v-slot:body="{ items }">

                            <tbody>
                              <tr v-for="(item, index) in items" :key="index">
                                <td>{{ item['name'] }}</td>
                                <td>{{ item['type'] }}</td>
                                <td>
                                  <span v-html="DeviceStatus(item['running'], item['disabled'])"></span>
                                </td>
                                <td>{{ item['mac-address'] }}</td>

                              </tr>
                            </tbody>
                          </template>
                        </v-data-table>

                      </v-card>
                    </v-container>
                  </v-tab-item>

                  <v-tab-item value="tab-6" data-app>
                    <v-container>
                      <v-card  v-if="deviceQueue != 'Empty Search Value'">

                        <v-card-title class="text-caption">
                          <v-text-field v-model="searchQueue" append-icon="mdi-magnify" label="name, target, max-limit"
                            single-line hide-details></v-text-field>
                        </v-card-title>


                        <v-data-table light calculate-widths mobile-breakpoint="0" :headers="QueueHeaders"
                          :items="filteredQueue" item-key="name" :searchQueue="searchQueue" :footer-props="footerProps">

                          <template v-slot:body="{ items }">

                            <tbody>
                              <tr v-for="(item, index) in items" :key="index">
                                <td>
                                  <span v-if="item['dynamic'] === true" class="colors-blue">D</span>
                                  <span v-else class="colors-black">S</span>
                                  <span v-if="item['disabled'] === true" class="colors-gray">X</span>
                                  <span v-if="item['invalid'] === true" class="colors-red">I</span>
                                </td>
                                <td>{{ item['name'] }}</td>
                                <td>{{ item['target'] }}</td>
                                <td>
                                  <v-icon color="green">mdi-sort</v-icon>
                                  <span v-html="toMB(item['max-limit'])"></span>
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-data-table>
                      </v-card>

                      <v-card v-else>
                        <v-card-text>
                          Not Found in Queue
                        </v-card-text>
                      </v-card>

                    </v-container>
                  </v-tab-item>


                  <v-tab-item value="tab-2" data-app>
                    <v-container>
                      <v-card>

                        <v-card-title>
                          <v-text-field v-model="searchArp" append-icon="mdi-magnify" label="ip,mac,interface,comment"
                            single-line hide-details></v-text-field>
                        </v-card-title>

                        <v-data-table light calculate-widths mobile-breakpoint="0" :headers="ArpHeaders"
                          :items="filteredArp" item-key="name" class="elevation-1" :searchArp="searchArp"
                          :footer-props="footerProps">

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
                                      <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
                                        Close
                                      </v-btn>
                                    </template>
                                  </v-snackbar>

                                </td>

                                <td>
                                  <template>
                                    <div class="text-left">


                                      <a class="text-caption" dark color="error"
                                        @click="DeviceLease(item['address']), snackbar2 = true">

                                        <v-icon>mdi-ip-network</v-icon>

                                      </a>
                                      {{ item['address'] }}
                                      <v-snackbar v-model="snackbar2" :timeout="timeout"
                                        v-if="deviceLease != 'Empty Search Value'">
                                        <v-subheader dark v-if="loading">Loading...</v-subheader>
                                        <v-list v-for="(item, index) in deviceLease" :key="index">


                                          <v-list-item>
                                            <v-list-item-action>
                                              <v-icon>mdi-lan-connect</v-icon>
                                            </v-list-item-action>

                                            <span v-if="item['dynamic'] === true" class="colors-blue">D</span>
                                            <span v-else class="colors-black">S</span>
                                            <span v-if="item['radius'] === true" class="colors-violet">R</span>
                                            <span v-if="item['blocked'] === true" class="colors-black">B</span>
                                            <span v-if="item['disabled'] === true" class="colors-gray">X</span>

                                            (<span v-if="item['status'] === 'bound'" class="colors-green">
                                              {{ item['status'] }}</span>
                                            <span v-else class="colors-red"> {{ item['status'] }}</span>)
                                            active-IP: {{ item['active-address'] }}
                                          </v-list-item>

                                          <v-list-item v-if="item['host-name']">
                                            <v-list-item-action>
                                              <v-icon>mdi-router-wireless</v-icon>
                                            </v-list-item-action>
                                            {{ item['host-name'] }}
                                          </v-list-item>

                                          <v-list-item>
                                            IP: {{ item['address'] }} Mac: {{ item['mac-address'] }}
                                          </v-list-item>

                                          <v-list-item>
                                            Last-Seen: {{ item['last-seen'] }} Expires-After: {{ item['expires-after']
                                            }}
                                          </v-list-item>

                                          <v-list-item>
                                            <span>Server: {{ item['server'] }}</span>
                                            <span v-if="item['comment']">Comment: {{ item['comment'] }}</span>
                                          </v-list-item>

                                          <v-list-item>
                                            <span v-if="item['dhcp-option']"> Dhcp-Option: {{ item['dhcp-option']
                                            }}</span>
                                            <span v-if="item['address-lists']"> Address-Lists: {{ item['address-lists']
                                            }}</span>
                                          </v-list-item>

                                        </v-list>

                                        <template v-slot:action="{ attrs }">
                                          <v-btn color="white" text v-bind="attrs" @click="snackbar2 = false">
                                            Close
                                          </v-btn>
                                        </template>
                                      </v-snackbar>

                                      <v-snackbar v-model="snackbar2" :timeout="timeout" v-else>
                                        <v-subheader dark>Not Found in DHCP Server</v-subheader>
                                        <template v-slot:action="{ attrs }">
                                          <v-btn color="pink" text v-bind="attrs" @click="snackbar2 = false">
                                            Close
                                          </v-btn>
                                        </template>
                                      </v-snackbar>
                                    </div>
                                  </template>



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

                  <v-tab-item value="tab-3" data-app>
                    <v-container>
                      <v-card>
                        <v-card-title class="text-caption">
                          <v-text-field v-model="searchRoute" append-icon="mdi-magnify"
                            label="dst-address, pref-src, gateway, distance" single-line hide-details></v-text-field>
                        </v-card-title>


                        <v-data-table light calculate-widths mobile-breakpoint="0" :headers="RouteHeaders"
                          :items="filteredRoute" item-key="name" class="elevation-1" :searchRoute="searchRoute"
                          :footer-props="footerProps">

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

                  <v-tab-item value="tab-4" data-app>
                    <v-container>
                      <v-card-title class="text-caption">
                        <v-text-field v-model="searchAddressList" append-icon="mdi-magnify" label="list,address"
                          single-line hide-details></v-text-field>
                      </v-card-title>

                      <v-card>
                        <v-data-table light calculate-widths mobile-breakpoint="0" :headers="AddressListHeaders"
                          :items="filteredAddressList" class="elevation-1" :searchAddressList="searchAddressList"
                          :footer-props="footerProps">

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

                  <v-tab-item value="tab-5" data-app>
                    <v-container>
                      <v-card v-if="deviceBGPSessions != 'Empty Search Value'">

                        <v-data-table light calculate-widths mobile-breakpoint="0" :headers="BGPHeaders"
                          :items="deviceBGPSessions" item-key="name" class="elevation-1" :footer-props="footerProps">

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

                </v-app>

              </v-tabs-items>

            </v-list-group>
          </v-list>


        </v-flex>




        <v-footer app bottom fixed style="width: 100%;" padless>
          <v-card class="flex" flat tile>
            <v-card-title class="teal">
              <v-spacer></v-spacer>

              <v-btn class="mx-4" icon @click="seletedTab('tab-2'), DeviceArp()">
                <v-icon size="28px">mdi-format-vertical-align-center</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mx-4" icon @click="seletedTab('tab-6'), DeviceQueue()">
                <v-icon size="28px">mdi-speedometer</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mx-4" icon @click="seletedTab('tab-4'), DeviceAddressList()">
                <v-icon size="28px">mdi-clipboard-list-outline</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mx-4" icon @click="seletedTab('tab-3'), DeviceRouteList()">
                <v-icon size="28px">mdi-routes</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mx-4" icon @click="seletedTab('tab-5'), DeviceBGPSessions()">
                <v-icon size="28px">mdi-alpha-b-circle-outline</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mx-4" icon @click="seletedTab('tab-1'), DeviceInterface()">
                <v-icon size="28px">mdi-ethernet</v-icon>
              </v-btn>
              <v-spacer></v-spacer>

            </v-card-title>


            <v-card-text class="teal">
              <v-spacer></v-spacer>
              {{ new Date().getFullYear() }} — <strong>Helper 1.1</strong>
              <v-spacer></v-spacer>
            </v-card-text>

          </v-card>
        </v-footer>


      </v-layout>

    </v-container>

  </div>

</template>


<script>
export default {
  data() {
    return {
      memory: 0,
      flash: 0,


      deviceBase: [],
      deviceList: [],

      InterfaceHeaders: [
        { text: 'name', show: true, value: '' },
        { text: 'type', show: true, value: '' },
        { text: 'status', show: true, value: '' },
        { text: 'mac-address', show: true, value: '' },
      ],
      deviceInterface: [],

      QueueHeaders: [
        { text: 'flags', show: true, value: '' },
        { text: 'name', show: true, value: '' },
        { text: 'target', show: true, value: '' },
        { text: 'max-limit', show: true, value: '' },
      ],
      deviceQueue: [],

      ArpHeaders: [
        { text: 'flags/ArpPing', show: true, value: '' },
        { text: 'ip/DHCP', show: true, value: '' },
        { text: 'mac-address', show: true, value: '' },
        { text: 'interface', show: true, value: '' },
        { text: 'comment', show: true, value: '' },
      ],
      deviceArp: [],

      BGPHeaders: [
        { text: 'instance', show: true, value: '' },
        { text: 'remote-address', show: true, value: '' },
        { text: 'local-address', show: true, value: '' },
        { text: 'remote-as', show: true, value: '' },
        { text: 'nexthop-choice', show: true, value: '' },
        { text: 'default-originate', show: true, value: '' },
        { text: 'state', show: true, value: '' },
      ],
      deviceBGPSessions: [],

      RouteHeaders: [
        { text: 'flags', show: true, value: '' },
        { text: 'dst-address', show: true, value: '' },
        { text: 'pref-src', show: true, value: '' },
        { text: 'gateway', show: true, value: '' },
        { text: 'gateway-status', show: true, value: '' },
        { text: 'distance', show: true, value: '' },
        { text: 'scope', show: true, value: '' },
      ],
      deviceRouteList: [],

      AddressListHeaders: [
        { text: 'flags', show: true, value: '' },
        { text: 'list', show: true, value: '' },
        { text: 'address', show: true, value: '' },
      ],

      deviceAddressList: [],
      deviceLease: [],
      deviceArpPing: [],

      snackbar: false,
      snackbar2: false,
      timeout: 50000,
      tab: null,
      active_tab: 3,
      value: 0,
      AtomValue: 1,
      loading: false,
      deviceId: '',
      searchInterface: '',
      searchAddressList: '',
      searchArp: '',
      searchQueue: '',
      searchBGP: '',
      searchRoute: '',
      footerProps: { 'items-per-page-options': [3, -1] },
    }
  },
  created() {
    this.deviceId = this.getIdFromQuery()
    this.DeviceBase()
    this.DeviceRouteList()
  },
  methods: {

    convertSize(el) {
      let out = '';
      if (el < 1000) out = el + "B";
      if (el === 0) out = el;
      if (el > 1000) out = (el / 1000).toFixed(0) + "K";
      if (el > 1000000) out = (el / 1000000).toFixed(0) + "M";
      if (el > 1000000000) out = (el / 1000000000).toFixed(0) + "G";
      if (el > 1000000000000) out = (el / 1000000000000).toFixed(0) + "T";
      return out;
    },

    toMB(int) {
      let str = int.split("/")
      let r1 = str[0]
      let r2 = str[1]
      let r3 = this.convertSize(r1) + '/' + this.convertSize(r2)
      return r3


    },
    getColor(val) {
      if (val < 50) return 'green'
      if (val > 50 && val < 76) return 'yellow'
      else return 'error'
    },
    calcMem(allMem, freeMem) {
      let i = parseInt(allMem) - parseInt(freeMem);
      let r = (i / parseInt(allMem) * 100).toFixed(2);
      this.memory = r
      return r
    },
    calcFlash(allFlash, freeFlash) {
      let i = parseInt(allFlash) - parseInt(freeFlash);
      let r = (i / parseInt(allFlash) * 100).toFixed(2);
      this.flash = r
      return r
    },
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return false
        case 'sm': return false
        case 'md': return true
        case 'lg': return true
        case 'xl': return true
      }
    },

    async seletedTab(stab) {
      this.tab = stab;
    },

    async DeviceBase() {
      const response = await this.$api.auth.MikrotikBase(this.deviceId).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceBase = response.data
    },

    async DeviceInterface() {
      this.loading = true;
      const response0 = await this.$api.auth.MikrotikInterface(this.deviceId).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceInterface = response0.data
      this.loading = false;
    },

    async DeviceQueue() {
      this.loading = true;
      const response10 = await this.$api.auth.MikrotikQueue(this.deviceId).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceQueue = response10.data
      this.loading = false;
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
      this.loading = true;
      const response5 = await this.$api.auth.MikrotikBGPSessions(this.deviceId).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceBGPSessions = response5.data
      this.loading = false;
    },

    async DeviceRouteList() {
      this.loading = true;
      const response6 = await this.$api.auth.MikrotikRouteList(this.deviceId).catch(() => {
        this.error = 'ERROR'
      })
      this.deviceRouteList = response6.data
      this.loading = false;
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

    filteredQueue() {
      return this.deviceQueue.filter((i) => {
        return !this.searchQueue || (i['name'] + '||' + i['target'] + '||' + i['max-limit'])
          .toUpperCase().indexOf(this.searchQueue.toUpperCase()) !== -1
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


