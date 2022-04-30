import bus from 'vue3-eventbus'

export const HideBottomNav = () => {
    bus.emit('hide-bottom-nav')
}

export const ShowBottomNav = () => {
    bus.emit('show-bottom-nav')
}