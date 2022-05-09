export const allowed_locations = [{
    name: '湖南',
    children: ['长沙', '常德']
}]

const map = [['湖南', 'hunan']]

export const city_cn2en = cn => {
    for(const i of map){
        if(i[0] == cn){
            return i[1]
        }
    }
    return 'unknown'
}

export const city_en2cn = en => {
    for(const i of map){
        if(i[1] == en){
            return i[0]
        }
    }
    return 'unknown'
}

export const isLocationAllowed = location => {
    for(let i in allowed_locations){
        if(allowed_locations[i].name == location){
            return true
        }else{
            for(let j in allowed_locations[i].children){
                if(allowed_locations[i].children[j] == location){
                    return true
                }
            }
        }
    }

    return false
}

export const cosplay_points_code = [{
    country: '中国',
    code: 0x1,
    provinces: [{
        name: '北京',
        code: 0x1,
        cities: []
    }, {
        name: '天津',
        code: 0x2,
        cities: []
    }, {
        name: '河北',
        code: 0x3,
        cities: []
    }, {
        name: '山西',
        code: 0x4,
        cities: []
    }, {
        name: '内蒙古',
        code: 0x5,
        cities: []
    }, {
        name: '辽宁',
        code: 0x6,
        cities: []
    }, {
        name: '吉林',
        code: 0x7,
        cities: []
    }, {
        name: '黑龙江',
        code: 0x8,
        cities: []
    }, {
        name: '山东',
        code: 0x9,
        cities: []   
    }, {
        name: '江苏',
        code: 0xA,
        cities: []
    }, {
        name: '广东',
        code: 0xB,
        cities: []
    }, {
        name: '广西',
        code: 0xC,
        cities: []
    }, {
        name: '海南',
        code: 0xD,
        cities: []
    }, {
        name: '重庆',
        code: 0xE,
        cities: []
    }, {
        name: '四川',
        code: 0xF,
        cities: []
    }, {
        name: '贵州',
        code: 0x10,
        cities: []
    }, {
        name: '云南',
        code: 0x11,
        cities: []
    }, {
        name: '西藏',
        code: 0x12,
        cities: []
    }, {
        name: '宁夏',
        code: 0x13,
        cities: []
    }, {
        name: '青海',
        code: 0x14,
        cities: []
    }, {
        name: '香港',
        code: 0x15,
        cities: []
    }, {
        name: '台湾',
        code: 0x16,
        cities: []
    }, {
        name: '西安',
        code: 0x17,
        cities: []
    }, {
        name: '澳门',
        code: 0x18,
        cities: []
    }, {
        name: '湖南',
        code: 0x1c,
        cities: [{
            name: '长沙',
            code: 0x1
        }, {
            name: '湘潭',
            code: 0x2
        }, {
            name: '株洲',
            code: 0x3
        }, {
            name: '衡阳',
            code: 0x4
        }, {
            name: '益阳',
            code: 0x5
        }, {
            name: '常德',
            code: 0x6
        }]
    }]
}, {
    country: '美国',
    code: 0x2,
    provinces: []
}]

export const getPlaceNameByCityCode = city_code => {
    for(var i in cosplay_points_code) {
        for(var j in cosplay_points_code[i].provinces) {
            for(var k in cosplay_points_code[i].provinces[j].cities) {
                if(cosplay_points_code[i].provinces[j].cities[k].code == city_code) {
                    return cosplay_points_code[i].provinces[j].cities[k].name
                }
            }
        }
    }
}
export const makePlaceComplete = place => {
    if(place.r_meta == null){
        place.r_meta = {
            id: 0,
            cid: place.id,
            likes: 0,
            comments: 0,
            views: 0,
            time: 0,
            flag: 0
        }
    }
    if(place.r_cover == null){
        place.r_cover = [{
            id: 0,
            cid: place.id,
            uid: 0,
            rid: 0,
            time: 0,
            flag: 0,
            r_resource: {
                id: 0,
                type: 0,
                time: 0,
                user: 0,
                flag: 0,
                extra: '',
                key: '',
                r_user : {}
            },
        }]
    }
    if(place.r_address == null){
        place.r_address = {
            id: 0,
            longitude: 0,
            latitude: 0,
            flag: 0,
            time: 0,
            name: '地址加载失败',
        }
    }
}