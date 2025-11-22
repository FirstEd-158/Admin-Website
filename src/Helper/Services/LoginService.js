import { httpAxios } from "@/Helper/httpHelper";


export async function SigninFunction(SigninData) {
    console.log("123");
    
    try {
        const response = await httpAxios.post("/auth/login-json", SigninData
        );
    return response;
    } catch (error) {
        throw error;
    }
}