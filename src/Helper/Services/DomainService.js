import { httpAxios } from "@/Helper/httpHelper";


export async function AddDomain(domaindata) {
    console.log(domaindata);
    console.log(2);
    
    
    try {
        const response = await httpAxios
            .post("/domains/add", domaindata)
        return response
    } catch (error) {
        throw error;
    }
}

export async function DeleteDomain(domainid) {
    console.log(domainid);
    console.log(2);
    
    
    try {
        const response = await httpAxios
            .delete(`/domains/${domainid}`)
        return response
    } catch (error) {
        throw error;
    }
}

export async function GetAllDomain() {
    
    try {
        const response = await httpAxios
            .get("/domains")
        return response
    } catch (error) {
        throw error;
    }
}