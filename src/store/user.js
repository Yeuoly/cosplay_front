export const user = {
    online: false,
    uid: -1,
    username: '游客',
    attach: null
}

export const GetUserName = () => {
    return user.username
}

export const GetUid = () => {
    return user.uid
}

export const SetUserName = username => {
    user.username = username
}

export const SetUid = uid => {
    user.uid = uid
}

export const SetOnline = state => {
    user.online = state
}

export const IsOnline = () => {
    return user.online
}

export const SetAttach = attach => {
    user.attach = attach
}

export const GetAttach = () => {
    return user.attach
}