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

export async function GetAllQuestionsFromSubject(subjectid, pageno = 1, limit = 10) {
    try {
        const response = await httpAxios.get(
            `/subjects/${subjectid}/questions/`,
            {
                params: {
                    pageno: pageno,
                    limit: limit
                }
            }
        );

        console.log(response);
        

        return response;
    } catch (error) {
        throw error;
    }
}


