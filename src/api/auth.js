export default function (instance) {
    return {
        MikrotikList() {
            return instance.get('/api/device/list')
        },

        MikrotikArpPing(id,ip,vlan) {
            if (id != undefined) {
                return instance.get('/api/device/mikrotik/arp-ping/address/' + ip + '/interface/' + vlan + '/id/' + id)
            }
        },

        MikrotikInterface(id) {
            if (id != undefined) {
                return instance.get('/api/device/mikrotik/interface/' + id)
            }
        },

        MikrotikArp(id) {
            if (id != undefined) {
                return instance.get('/api/device/mikrotik/arp/' + id)
            } else {
                return instance.get('/api/device/mikrotik/arp/' + id)
            }
        },

        MikrotikLease(id ,mac_or_ip) {
            if (id != undefined) {
                return instance.get('/api/device/mikrotik/lease/mac-or-ip/' + mac_or_ip + '/id/' + id)
            }
        },

        MikrotikAddressList(id) {
            if (id != undefined) {
                return instance.get('/api/device/mikrotik/firewall/address-list/' + id)
            }
        },

        MikrotikBGPSessions(id) {
            if (id != undefined) {
                return instance.get('/api/device/mikrotik/bgp/peer/' + id)
            }
        },

        MikrotikRouteList(id) {
            if (id != undefined) {
                return instance.get('/api/device/mikrotik/ip/route/' + id)
            }
        },
       
    }
}