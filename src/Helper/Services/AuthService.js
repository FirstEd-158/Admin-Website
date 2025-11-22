import { httpAxios } from "@/Helper/httpHelper";


export async function SignupFunction(SignupData) {
    console.log(SignupData);
    console.log(2);
    
    
    try {
        const response = await httpAxios
            .post("/auth/register", SignupData)
        return response
    } catch (error) {
        throw error;
    }
}