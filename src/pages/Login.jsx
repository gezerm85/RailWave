import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const schema = yup.object().shape({
  email: yup.string().email("Geçersiz e-posta").required("E-posta zorunlu"),
  password: yup.string().min(6, "Şifre en az 6 karakter").required("Şifre zorunlu"),
});

export default function Login() {
  const { login, isLoggedIn, user, setAuthToken } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Zaten giriş yapılmışsa role'e göre yönlendir
  useEffect(() => {
    if (isLoggedIn && user) {
      const role = user.role?.toUpperCase();
      if (role === "ADMIN") navigate("/admin", { replace: true });
      else if (role === "MANAGER") navigate("/manager/employees", { replace: true });
      else if (role === "USER") navigate("/user", { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  const onSubmit = async (data) => {
    try {
      const loginRes = await axios.post("http://localhost:8080/auth/login", {
        email: data.email,
        password: data.password,
      });

      const token = loginRes.data.token;
      setAuthToken(token); // token'ı context + axios'a kaydet

      const profileRes = await axios.get("http://localhost:8080/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = profileRes.data;
      login(userData);

      const role = userData.role?.toUpperCase();

      if (role === "ADMIN") navigate("/admin", { replace: true });
      else if (role === "MANAGER") navigate("/manager/employees", { replace: true });
      else if (role === "USER") navigate("/user", { replace: true });
      else navigate("/");

    } catch (err) {
      console.error("Giriş hatası:", err);
      alert("Giriş başarısız. Bilgileri kontrol et.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-10">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Giriş Yap</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="E-posta"
              {...register("email")}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Şifre"
              {...register("password")}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
