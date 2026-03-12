
import { httpAxios } from "@/Helper/httpHelper";

export async function GetAllTestSeries(domainid, token) {
    try {
        
        const response = await httpAxios
            .get(`/domains/${domainid}/test_series`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        return response
    } catch (error) {
        throw error;
    }
}

export async function AddTestSeries(data,domainid) {
    try {
        const response = await httpAxios.post(`/domains/${domainid}/test_series/add`, data
        );
    return response;
    } catch (error) {
        throw error;
    }
}

export async function DeleteTestSeries(test_series_id) {
    console.log(test_series_id);
    
    
    try {
        const response = await httpAxios
            .delete(`/test_series/${test_series_id}`)
        return response
    } catch (error) {
        throw error;
    }
}