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

const putRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.put(url, payload);
    console.log("res-----", res.data);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const patchRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.patch(url, payload);
    console.log("res-----", res.data);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const deleteRequest = async (url: string, payload?: any) => {
  try {
    const res = await axiosInstance.delete(url, payload ? { data: payload } : undefined);
    console.log("res-----", res.data);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};


// Auth APIs
export const sendOtp = (payload: any) => postRequest('customer/auth/send-otp', payload);
export const verifyOtp = (payload: any) => postRequest('customer/auth/verify-and-login', payload);
export const logout = (payload: any) => postRequest('/customer/auth/logout', payload);

// Sell-car APIs 
export const fetchSellCarBrands = () => getRequest('/car/brands');
export const fetchSellCarYears = (brandId: string) => getRequest(`/car/${brandId}/years`);
export const fetchSellCarModelsWithYear = (brandId: string, year: string) => getRequest(`/car/${brandId}/year/${year}/models`);
export const fetchSellCarVariants = (year: string, modelId: string) => getRequest(`/car/year/${year}/model/${modelId}/variants`);
export const fetchSellCarLocations = (query: string, page: number = 1, limit: number = 50) => getRequest(`/customer/sell-car/city-suggestions?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
export const CreateSellCar = (payload: any) => postRequest('/customer/sell-car', payload);

// Filter APIs
export const fetchSellCarModelsWithBrand = (brandId: string) => getRequest(`/car/${brandId}/models`);
export const searchUsedCarsModel = (search: string) => getRequest(`/car/models?search=${search}`);

// Used Car Listing APIs
export const fetchListings = (query: any) => getRequest(`customer/used-car/list?${query}`);
export const fetchDetails = (slug: string) => getRequest(`/customer/used-car/detail/${slug}`);
export const fetchMyUsedCarList = (page: number = 1, limit: number = 1) => getRequest(`/customer/used-car?page=${page}&limit=${limit}`);
export const fetchMyUsedCarDetails = (id: string) => getRequest(`/customer/used-car/${id}`);

// Wishlist APIs
export const addWishlist = (payload: any) => postRequest('/customer/wishlist', payload);
export const removeWishlist = (payload: any) => deleteRequest(`/customer/wishlist`, payload);
export const clearWishlist = () => deleteRequest(`/customer/wishlist/clear`);
export const getWishlist = (page: number = 1, limit: number = 1) => getRequest(`/customer/wishlist?page=${page}&limit=${limit}`);
export const getWishlistCount = () => getRequest(`/customer/wishlist/count`);

// profile Data APIs
export const getProfileData = () => getRequest(`/customer/profile`);
export const updateProfileData = (payload: any) => putRequest(`/customer/profile`, payload);
export const sendEmailOtp = (payload: any) => postRequest(`/customer/profile/email-otp/send`, payload);
export const verifyEmailOtp = (payload: any) => postRequest(`/customer/profile/email-otp/verify`, payload);
export const sendDeleteAccountOtp = (payload: any) => postRequest(`/customer/profile/delete/send-otp`, payload);
export const verifyDeleteAccountOtp = (payload: any) => deleteRequest(`/customer/profile/delete`, payload);
export const updateCity = (cityId: string, payload: any) => patchRequest(`/customer/profile/city/${cityId}`, payload);

// City APIs
export const getActiveCities = () => getRequest(`/city/active`);