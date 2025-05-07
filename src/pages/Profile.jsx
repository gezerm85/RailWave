import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { token } = useAuth();
  const { t } = useTranslation(); // artık profile namespace yok çünkü `profile.` ile erişiyoruz
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
        const savedImage = localStorage.getItem(`avatar-${res.data.email}`);
        if (savedImage) setImage(savedImage);
      } catch (error) {
        console.error("Profil bilgileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem(`avatar-${profile.email}`, reader.result);
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
    setUploading(false);
  };

  if (loading) return <p className="text-center mt-10">{t("profile.loading")}</p>;
  if (!profile) return <p className="text-center mt-10 text-red-600">{t("profile.notFound")}</p>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 text-center relative">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center justify-center gap-2">
        <span>👤</span> {t("profile.title")}
      </h2>

      <div className="flex flex-col items-center mb-6 relative">
        {image ? (
          <img
            src={image}
            alt="Profil"
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-blue-300"
          />
        ) : (
          <FaUserCircle className="w-28 h-28 text-gray-400" />
        )}

        <label
          htmlFor="avatarInput"
          className="mt-3 inline-block bg-blue-600 text-white text-sm px-4 py-1.5 rounded cursor-pointer hover:bg-blue-700 transition"
        >
          {t("profile.uploadPhoto")}
        </label>
        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {uploading && <p className="text-sm text-blue-500 mt-1">{t("profile.uploading")}</p>}
      </div>

      <div className="text-left space-y-2 text-sm text-gray-800">
        <p><strong>{t("profile.firstName")}:</strong> {profile.firstName}</p>
        <p><strong>{t("profile.lastName")}:</strong> {profile.lastName}</p>
        <p><strong>{t("profile.email")}:</strong> {profile.email}</p>
        <p><strong>{t("profile.phoneNumber")}:</strong> {profile.phoneNumber}</p>
      </div>
    </div>
  );
}
