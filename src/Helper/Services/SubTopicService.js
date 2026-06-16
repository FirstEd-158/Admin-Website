
import { httpAxios } from "@/Helper/httpHelper";

export async function GetAllSubTopics(topicid) {
    console.log(topicid);
    
    try {
        const response = await httpAxios
            .get(`/topics/${topicid}/subtopics`)
        return response
    } catch (error) {
        throw error;
    }
}

export async function AddSubTopic(data,topicid) {
    console.log(data);
    console.log(topicid);
    try {
        const response = await httpAxios.post(`/topics/${topicid}/subtopics/add`, data
        );
    return response;
    } catch (error) {
        throw error;
    }
}

export async function DeleteSubTopic(subtopicid) {
    console.log(subtopicid);
    console.log(2);
    
    
    try {
        const response = await httpAxios
            .delete(`/subtopics/${subtopicid}`)
        return response
    } catch (error) {
        throw error;
    }
}