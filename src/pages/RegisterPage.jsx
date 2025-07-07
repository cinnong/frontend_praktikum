import { useState } from "react";
import { register } from "../services/authService";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

export function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validateForm = () => {
    const newErrors = {};

    // Validate username
    if (!form.username.trim()) {
      newErrors.username = "Username harus diisi";
    } else if (form.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Validate password
    if (!form.password) {
      newErrors.password = "Password harus diisi";
    } else if (form.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    // Validate confirm password
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    // Debug log untuk melihat errors
    console.log("Form data:", form);
    console.log("Validation errors:", newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!"); // Debug log

    if (!validateForm()) {
      console.log("Validation failed"); // Debug log
      return;
    }

    console.log("Validation passed, starting registration..."); // Debug log
    setIsLoading(true);

    try {
      const userData = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: "user", // Tambahkan role yang required oleh backend
      };

      console.log("Data yang akan dikirim:", userData);

      // Gunakan authService untuk registrasi
      const response = await register(userData);
      console.log("Registration successful:", response); // Debug log

      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Akun Anda telah berhasil dibuat. Silakan login.",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        console.log("Navigating to login..."); // Debug log
        navigate("/login");
      });
    } catch (error) {
      console.error("Error during registration:", error);
      console.error("Error response:", error.response?.data); // Detail error dari server
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);

      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Terjadi kesalahan saat registrasi",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Daftar Akun
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
