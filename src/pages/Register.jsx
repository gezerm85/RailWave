import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const schema = yup.object().shape({
  name: yup.string().required("register.nameRequired"),
  email: yup.string().email("register.invalidEmail").required("register.emailRequired"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "register.invalidPhone")
    .min(11, "register.invalidPhone")
    .max(11, "register.invalidPhone")
    .required("register.phoneRequired"),
  password: yup
    .string()
    .min(6, "register.passwordLength")
    .required("register.passwordRequired"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "register.passwordsMustMatch")
    .required("register.confirmPasswordRequired"),
});


export default function Register({ minimal = false }) {
  const { login, isLoggedIn, user, setAuthToken } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isLoggedIn && user) {
      const role = user.role?.toUpperCase();
      if (role === "ADMIN") navigate("/admin", { replace: true });
      else if (role === "MANAGER")
        navigate("/manager/employees", { replace: true });
      else if (role === "USER") navigate("/user", { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  const onSubmit = async (data) => {
    try {

      

      const { name, email, phoneNumber, password } = data;
  
      const registerRes = await axios.post(
        "http://localhost:8080/auth/register",
        {
          firstName: name.split(" ")[0],
          lastName: name.split(" ").slice(1).join(" ") || "-",
          email,
          phoneNumber,
          password,
        }
      );
  
      const token = registerRes.data.token;
      setAuthToken(token);
  
      const profileRes = await axios.get(
        "http://localhost:8080/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const user = profileRes.data;
      login(user);
  
      const role = user.role?.toUpperCase();
      if (role === "ADMIN") navigate("/admin", { replace: true });
      else if (role === "MANAGER")
        navigate("/manager/employees", { replace: true });
      else if (role === "USER") navigate("/user", { replace: true });
      else navigate("/");
    } catch (err) {
      if (err.response?.data?.message === "Email already in use.") {
        alert(t("register.emailInUse")); // çeviri dosyanda "Bu e-posta zaten kayıtlı" gibi bir şey tanımlarsın
      } else {
        alert(t("register.error"));
      }
      console.error("Kayıt hatası:", err.response?.data || err);
      alert(t("register.error"));
    }
  };
  

  return (
    <div
      className={`${!minimal ? " flex items-center justify-center px-4 " : ""}`}
    >
      <div className=" rounded-lg p-8 w-full max-w-md">


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={t("register.name")}
              {...register("name")}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {t(errors.name.message)}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder={t("register.email")}
              {...register("email")}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {t(errors.email.message)}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              maxLength={11}
              placeholder={t("register.phone")}
              {...register("phoneNumber")}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {t(errors.phoneNumber.message)}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("register.password")}
              {...register("password")}
              className="w-full border border-gray-300 rounded px-4 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {t(errors.password.message)}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("register.confirmPassword")}
              {...register("confirmPassword")}
              className="w-full border border-gray-300 rounded px-4 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {t(errors.confirmPassword.message)}
              </p>
            )}
          </div>



          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {isSubmitting ? t("register.loading") : t("register.button")}
          </button>
        </form>
      </div>
    </div>
  );
}
