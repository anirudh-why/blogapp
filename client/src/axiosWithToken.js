import axios from "axios";

const token=localStorage.getItem('token')
export const axiosWithToken=axios.create({
    headers:{Authorization:`Bearer ${token}`}
})