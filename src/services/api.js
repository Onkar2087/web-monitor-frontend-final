import axios from "axios";

const BACKEND_URL= `${import.meta.env.VITE_API_URL}/api`

export const addLink = async (url) => {
    const res = await axios.post(`${BACKEND_URL}/add`, { url });
    return res.data;
};

export const getStatus = async (id) => {
    const res = await axios.get(`${BACKEND_URL}/status/${id}`);
    return res.data;
};

export const checkLink = async (id) => {
    const res = await axios.post(`${BACKEND_URL}/check/${id}`);
    return res.data;
};

export const getHealth = async () => {
    const res = await axios.get(`${BACKEND_URL}/health`);
    return res.data;
}

export const getLinks = async () => {
    const res = await axios.get(`${BACKEND_URL}/links`)
    return res.data
}

export const deleteLink = async (id) => {
    await axios.delete(`${BACKEND_URL}/delete/${id}`);
}
