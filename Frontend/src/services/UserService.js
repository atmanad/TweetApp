import api from "../api/api"

export const register = async (credentials) => {
    try {
        const response = await api.User.register(credentials);
        if (response.isSuccess) {
            return response.isSuccess;
        }
        else{
            throw new Error(response.errorMessages);
        }
    } catch (error) {
        throw error;
    }
};


export async function login(credentials){
    try {
        const response = await api.User.login(credentials);
        if (response.isSuccess) {
            localStorage.setItem("token", response.token);
            return {
                result:response.result,
                token:response.token
            }
        } else {
            throw new Error(response.errorMessages);
        }
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');  
}

export async function forgotPassword(body){
    try {
        const response = api.User.forgotPassword(body.id, body);
        return response;      
    } catch (error) {
        throw error;
    }
}