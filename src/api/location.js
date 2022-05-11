import { api_base } from './base'

export const api_list_country_cosplay_points = (country, page, len) => 
    api_base('/location/list/country', 'get', { country, page, len })

export const api_list_province_cosplay_points = (province, page, len) =>
    api_base('/location/list/province', 'get', { province, page, len })

export const api_list_city_cosplay_points = (city, page, len) =>
    api_base('/location/list/city', 'get', { city, page, len })

export const api_search_cosplay_points = (keyword, country, province, city, page, len) =>
    api_base('/location/search', 'get', { keyword, country, province, city, page, len })

export const api_get_cosplay_point = id => 
    api_base('/location/get', 'get', { id })

export const api_create_cosplay_point = (name, description, country, province, city, latitude, longitude) => 
    api_base('/location/create', 'post', { name, description, country, province, city, latitude, longitude })

export const api_update_cosplay_point = (id, name, description, country, province, city, latitude, longitude) =>
    api_base('/location/update', 'post', { id, name, description, country, province, city, latitude, longitude })

export const api_upload_cosplay_point_cover = (cid, rid) =>
    api_base('/location/create/cover/add', 'post', { cid, rid })

export const api_delete_cosplay_point_cover = (cid, rid) =>
    api_base('/location/create/cover/del', 'post', { cid, rid })

export const api_delete_cosplay_point = cid => 
    api_base('/location/delete', 'post', { cid })

export const api_like_cosplay_point = cid =>
    api_base('/location/like', 'post', { cid })

export const api_unlike_cosplay_point = cid =>
    api_base('/location/unlike', 'post', { cid })

export const api_get_scatter_cosplay_points_by_city = city => 
    api_base('/location/scatter/city', 'get', { city })