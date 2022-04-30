import { ElMessage } from "element-plus";

export const SuccessMessage = message => ElMessage({
    message: message,
    grouping: true,
    type: 'success'
})

export const ErrorMessage = message => ElMessage({
    message: message,
    grouping: true,
    type: 'error'
})