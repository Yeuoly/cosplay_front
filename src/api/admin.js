import { api_base } from './base'

export const api_get_unchecked_cosplay_point = (page, len) => 
    api_base('/location/admin/unchecked', 'get', { page, len })

export const api_preview_cosplay_point = (cid, status) =>
    api_base('/location/admin/preview', 'post', { cid, status })