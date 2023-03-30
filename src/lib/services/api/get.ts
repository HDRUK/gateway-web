import axios from "axios";

const getRequest = async <T>(url: string, options: any): Promise<T> => {
	return await axios.get(url, options).then((res) => res.data);
};

export { getRequest };
