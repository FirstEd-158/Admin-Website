import { httpAxios } from "../httpHelper";

export async function GetAllQuestionsFromDomain(domainid) {
    
    try {
        const response = await httpAxios
            .get(`/domains/${domainid}/questions`)
        return response
    } catch (error) {
        throw error;
    }
}

export async function GetSingleTestquestion(question_id) {
    try {
        const response = await httpAxios
            .get(`/questions/${question_id}`)
        return response
    } catch (error) {
        throw error;
    }
}


