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


export async function GetQuestioninbulk(questionarray) {
    try {
        console.log(questionarray);
        const response = await httpAxios
            .post(`/questions/bulk` , {"question_ids":questionarray})
        return response
    } catch (error) {
        throw error;
    }
}

export async function GetAllQuestionsFromSubject(subjectid) {
    
    try {
        const response = await httpAxios
            .get(`/subjects/${subjectid}/questions/`)
        return response
    } catch (error) {
        throw error;
    }
}


