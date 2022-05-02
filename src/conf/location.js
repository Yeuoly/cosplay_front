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