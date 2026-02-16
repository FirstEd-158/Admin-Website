import { httpAxios } from "@/Helper/httpHelper";

export async function GetAllTestsofTestSeries(testseries_id) {
    try {
        const response = await httpAxios
            .get(`/test_series/${testseries_id}/tests/`)
        return response
    } catch (error) {
        throw error;
    }
}

export async function GetSingleTest(test_id) {
    try {
        const response = await httpAxios
            .get(`/tests/${test_id}`)
        return response
    } catch (error) {
        throw error;
    }
}

export async function AddTests(testseries_id , data) {
    try {
        const response = await httpAxios
            .post(`/test_series/${testseries_id}/tests/add` , data);
        return response
    } catch (error) {
        throw error;
    }
}


export async function UpdateTest(test_id , data) {
    try {
        const response = await httpAxios
            .put(`/tests/${test_id}` , data)
        return response
    } catch (error) {
        throw error;
    }
}