
import { httpAxios } from "@/Helper/httpHelper";

export async function GetAllTopics(subjectid) {
    console.log(subjectid);
    
    try {
        const response = await httpAxios
            .get(`/subjects/${subjectid}/topics`)
        return response
    } catch (error) {
        throw error;
    }
}

export async function AddTopic(data,subjectid) {
    console.log("123");
    console.log(data);
    console.log(subjectid);
    try {
        const response = await httpAxios.post(`/subjects/${subjectid}/topics/add`, data
        );
    return response;
    } catch (error) {
        throw error;
    }
}



export async function DeleteTopic(topicid) {
    console.log(topicid);
    console.log(2);
    
    
    try {
        const response = await httpAxios
            .delete(`/topics/${topicid}`)
        return response
    } catch (error) {
        throw error;
    }
}