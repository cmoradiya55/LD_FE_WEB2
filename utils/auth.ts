import generateUUID from "@/lib/uuid";
import axiosInstance from "./axios";
import axios from "axios";
import { MediaCategory } from "@/lib/data";

const postRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.post(url, payload);

    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const getRequest = async (url: string) => {
  try {
    const res = await axiosInstance.get(url);

    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const putRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.put(url, payload);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const patchRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.patch(url, payload);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const deleteRequest = async (url: string, payload?: any) => {
  try {
    const res = await axiosInstance.delete(url, payload ? { data: payload } : undefined);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};





// ***Customer APIs***
// Sell-car APIs 
export const getCitySuggestions = (query: string, page: number = 1, limit: number = 50) => getRequest(`/customer/sell-car/city-suggestions?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
export const postCreateSellCar = (payload: any) => postRequest('/customer/sell-car', payload);


// Used Car Listing APIs
export const getListingApi = (query: any) => getRequest(`customer/used-car/list?${query}`);
export const getDetailApi = (slug: string) => getRequest(`/customer/used-car/detail/${slug}`);
export const getMyUsedCarList = (page: number = 1, limit: number = 50) => getRequest(`/customer/used-car?page=${page}&limit=${limit}`); //cityId, isCityIncluded
export const getMyUsedCarDetail = (id: string) => getRequest(`/customer/used-car/${id}`);
export const patchUpdateMyCarDetail = (id: string, payload: any) => patchRequest(`/customer/used-car/${id}`, payload);
export const patchApproveListingDelistingAndPriceUpdate = (id: string, payload: any) => patchRequest(`/customer/used-car/${id}/status`, payload);



// Authentication APIs
export const sendOtp = (payload: any) => postRequest('customer/auth/send-otp', payload);
export const verifyOtp = (payload: any) => postRequest('customer/auth/verify-and-login', payload);
export const logout = (payload: any) => postRequest('/customer/auth/logout', payload);



// Customer Wishlist APIs
export const postAddToWishlist = (payload: any) => postRequest('/customer/wishlist', payload);
export const delRemoveFromWishlist = (payload: any) => deleteRequest(`/customer/wishlist`, payload);
export const clearWishlist = () => deleteRequest(`/customer/wishlist/clear`);
export const getWishlistCount = () => getRequest(`/customer/wishlist/count`);
export const getWishlist = (page: number, limit: number) => getRequest(`/customer/wishlist?page=${page}&limit=${limit}`);


// Customer Profile APIs
export const getProfileData = () => getRequest(`/customer/profile`);
export const updateProfileData = (payload: any) => putRequest(`/customer/profile`, payload);
export const sendEmailOtp = (payload: any) => postRequest(`/customer/profile/email-otp/send`, payload);
export const verifyEmailOtp = (payload: any) => postRequest(`/customer/profile/email-otp/verify`, payload);
export const sendDeleteAccountOtp = (payload: any) => postRequest(`/customer/profile/delete/send-otp`, payload);
export const verifyDeleteAccountOtp = (payload: any) => deleteRequest(`/customer/profile/delete`, payload);
export const updateCity = (cityId: Number, payload: any) => patchRequest(`/customer/profile/city/${cityId}`, payload);



// ***Common APIs***
// Car APIs
export const getCarBrands = () => getRequest('/car/brands');
export const getCarModelsByBrandId = (brandId: string) => getRequest(`/car/${brandId}/models`);
export const getYearRangeById = (brandId: string) => getRequest(`/car/${brandId}/years`);
export const getCarModelByYearAndBrandId = (brandId: string, year: string) => getRequest(`/car/${brandId}/year/${year}/models`);
export const getCarVariantsByYearAndModel = (year: string, modelId: string) => getRequest(`/car/year/${year}/model/${modelId}/variants`);
export const getSearchModelByBrandOrModel = (search: string) => getRequest(`/car/models?search=${search}`);



// City APIs
export const getActiveCities = () => getRequest(`/city/active`);



// Storage Services APIs
export const postImageUpload = async (files: any) => {

  const entityId = generateUUID();
  const newFiles = Array.from(files);

  const filesPayload = newFiles.map((file: any) => ({
    name: file.name,
    type: file.type,
  }));

  const payload = {
    entityId,
    category: MediaCategory.CAR,
    files: filesPayload,
  };

  const response = await postRequest('/storage/upload-url', payload);

  if (response?.code === 200 && response.data?.length > 0) {
    await Promise.all(
      response.data.map(async (presignedUrlData: any, index: number) => {
        const file: any = newFiles[index];
        if (!file || !presignedUrlData.uploadUrl) return;
        await axios.put(presignedUrlData.uploadUrl, file, {
          headers: { 
            "Content-Type": file.type || presignedUrlData.contentType || "application/octet-stream",
          },
          transformRequest: [(data) => data],
        });
      })
    );
    return response;
  }
  throw new Error(response?.message || 'Failed to get presigned URLs');
}
