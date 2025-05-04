// src/hooks/useSeller.js
import { useState, useEffect, useCallback } from 'react';
import sellerService from '../services/sellerService';

const useSeller = () => {
    const [profile, setProfile] = useState(null);
    const [shopInfo, setShopInfo] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy thông tin profile
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await sellerService.getProfile();
            setProfile(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thông tin người bán');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy thông tin shop
    const fetchShopInfo = useCallback(async () => {
        setLoading(true);
        try {
            const response = await sellerService.getShopInfo();
            setShopInfo(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thông tin cửa hàng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Cập nhật thông tin cá nhân
    const updateProfile = useCallback(async (profileData) => {
        setLoading(true);
        try {
            const response = await sellerService.updateProfile(profileData);
            setProfile(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thông tin thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Cập nhật thông tin shop
    const updateShopInfo = useCallback(async (shopData) => {
        setLoading(true);
        try {
            const response = await sellerService.updateShopInfo(shopData);
            setShopInfo(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thông tin cửa hàng thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy trạng thái xác minh người bán
    const fetchVerificationStatus = useCallback(async () => {
        setLoading(true);
        try {
            const response = await sellerService.getVerificationStatus();
            setVerificationStatus(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy trạng thái xác minh');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Kiểm tra quyền người bán
    const checkSellerRole = useCallback(async () => {
        try {
            const response = await sellerService.verifySellerRole();
            return response.data.data.isSeller;
        } catch (err) {
            console.error('Lỗi kiểm tra quyền seller:', err);
            return false;
        }
    }, []);

    // Reset state khi có lỗi
    const resetState = () => {
        setError(null);
    };

    return {
        profile,
        shopInfo,
        verificationStatus,
        loading,
        error,
        fetchProfile,
        fetchShopInfo,
        updateProfile,
        updateShopInfo,
        fetchVerificationStatus,
        checkSellerRole,
        resetState
    };
};

export default useSeller;