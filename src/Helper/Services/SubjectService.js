
import { httpAxios } from "@/Helper/httpHelper";

export async function GetAllSubjects(domain_id) {
    console.log(domain_id);
    
    try {
        const response = await httpAxios
            .get(`/domains/${domain_id}/subjects`)
        return response
    } catch (error) {
        throw error;
    }
}

export async function AddSubject(data,domainid) {
    console.log("123");
    console.log(data);
    console.log(domainid);
    try {
        const response = await httpAxios.post(`/domains/${domainid}/subjects/add`, data
        );
    return response;
    } catch (error) {
        throw error;
    }
}

export async function DeleteSubject(subjectid) {
    console.log(subjectid);
    console.log(2);
    
    
    try {
        const response = await httpAxios
            .delete(`/subjects/${subjectid}`)
        return response
    } catch (error) {
        throw error;
    }
}