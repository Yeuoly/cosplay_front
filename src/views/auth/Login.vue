<template>
    <el-form class="cos-login-form">
        <el-form-item label="手机号">
            <el-input
                v-model="form.phone_number"
            ></el-input>
        </el-form-item>
        <el-form-item label="验证码">
            <el-input
                v-model="form.captcha"
            >
                <template #append>
                    <el-button @click="SendCaptcha" :disabled="CaptchaLastTime > 0">
                        {{ CaptchaLastTime > 0 ? `${CaptchaLastTime}秒后重试` : '发送验证码' }}
                    </el-button>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="Login">登陆</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { ref } from 'vue'
import { api_captcha_phone, api_fastlogin_phone } from '../../api/auth'
import { SuccessMessage, ErrorMessage } from '../../event/message'

export default {
    setup() {
        const form = ref({
            phone_number: '',
            captcha : ''
        })

        let timer = null
        const CaptchaLastTime = ref(0)
        const WaitForSecond = (sec) => {
            CaptchaLastTime.value = sec
            clearInterval(timer)
            timer = setInterval(() => {
                if(CaptchaLastTime.value-- == 0) {
                    clearInterval(timer)
                }
            }, 1000)
        }
        const SendCaptcha = async () => {
            const { data } = await api_captcha_phone('fastlogin', form.value.phone_number)
            if(data && data['res'] == 0){
                SuccessMessage('短信发送成功')
                WaitForSecond(60)
            }else{
                ErrorMessage(data ? data['err'] : '网络错误')
            }
        }

        const Login = async () => {
            const { data } = await api_fastlogin_phone(form.value.captcha)
            if(data && data['res'] == 0){
                SuccessMessage('注册成功，将在两秒后跳转')
                setTimeout(() => {
                    location.href = '/'
                }, 2000)
            }else{
                ErrorMessage(data ? data['err'] : '网络错误')
            }
        }

        return {
            CaptchaLastTime,
            SendCaptcha,
            form,
            Login
        }
    }
}
</script>

<style>
.cos-login-form {
    padding-top: 60px;
    padding-left: 30px;
    padding-right: 30px;
}
</style>