import { api_base } from "./base"
import { stringify } from 'querystring'

export const api_get_csrftoken = () => api_base('auth/csrf', 'post')

export const api_captcha_phone = (method, phone) => api_base('captcha/phone', 'post', stringify({ method, phone }))

export const api_fastlogin_phone = captcha => api_base('auth/fastlogin/phone', 'post', stringify({ captcha }))

export const api_auth_check = () => api_base('auth/check', 'post')