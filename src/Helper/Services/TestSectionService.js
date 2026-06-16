
import { httpAxios } from "@/Helper/httpHelper";

export async function GetAllTestSections() {
    try {
        const response = await httpAxios
            .get("/testsection/getall")
        return response
    } catch (error) {
        throw error;
    }
}

export async function AddTestSections(name) {
    // console.log(data);
    
    try {
        const response = await httpAxios
            .post(`/testsection/create?name=${name}`)
        return response
    } catch (error) {
        throw error;
    }
}