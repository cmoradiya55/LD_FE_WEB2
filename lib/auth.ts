import axiosInstance from "./axios";

const postRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.post(url, payload);
    console.log("res-----", res.data);

    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const getRequest = async (url: string) => {
  try {
    const res = await axiosInstance.get(url);
    console.log("res-----", res.data);

    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};


// Auth APIs 
export const loginAdmin = (payload: any ) => postRequest('/session/login', payload); 


// Sell-car APIs 
export const fetchSellCarBrands = () => getRequest('/customer/sell-car/brand'); 
export const fetchSellCarYears = (brandId: string) => getRequest(`/customer/sell-car/brand/${brandId}/years`); 
export const fetchSellCarModels = (brandId: string, year: string) => getRequest(`/customer/sell-car/brand/${brandId}/year/${year}/models`); 
export const fetchSellCarVariants = (brandId: string, year: string, modelId: string) => getRequest(`/customer/sell-car/year/${year}/model/${modelId}/variants`);
export const fetchSellCarLocations = (query: string, page: number = 1, limit: number = 50) => getRequest(`/customer/sell-car/city-suggestions?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);

export const CreateSellCar = (payload: any ) => postRequest('/customer/sell-car', payload);