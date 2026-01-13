import React, { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

interface FormDataState {
  username: string;
  password: string;
  repeatPassword: string;
  email: string;
}

function useAuth() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState<FormDataState>({
    username: "",
    password: "",
    repeatPassword: "",
    email: "",
  });

  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers
      ? JSON.parse(storedUsers)
      : [
          {
            id: 1,
            username: "Raka",
            password: "password",
            email: "test@example.com",
          },
        ];
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    setFormData((prev) => ({
      ...prev,
      username: user.username ?? "",
      email: user.email ?? "",
    }));
  }, []);

  useEffect(() => {
    setFormData({ username: "", password: "", repeatPassword: "", email: "" });
  }, [isLogin]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 2000);
    return () => clearTimeout(timer);
  }, [error]);

  const passwordsMatch =
    formData.repeatPassword.length === 0 ||
    formData.password === formData.repeatPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const loggedInUser = users.find(
      (u) =>
        u.username === formData.username && u.password === formData.password
    );

    if (!loggedInUser) {
      setIsLoading(false);
      setError("Wrong username or password");
      return;
    }

    try {
      const response = await fetch(
        "https://opentdb.com/api_token.php?command=request"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      localStorage.setItem("api_token", result.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: loggedInUser.id,
          username: loggedInUser.username,
          email: loggedInUser.email,
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const register = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.repeatPassword) {
      setIsLoading(false);
      setError("Passwords do not match!");
      return;
    }

    if (users.some((u) => u.username === formData.username)) {
      setIsLoading(false);
      setError("Username has already exist!");
      return;
    }

    if (users.some((u) => u.email === formData.email)) {
      setIsLoading(false);
      setError("Email has already exist!");
      return;
    }

    setUsers((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        username: formData.username,
        password: formData.password,
        email: formData.email,
      },
    ]);

    setFormData({
      username: "",
      password: "",
      repeatPassword: "",
      email: "",
    });

    setIsLoading(false);
    setIsLogin(true);
  };

  return {
    error,
    isLoading,
    isLogin,
    formData,
    passwordsMatch,
    handleChange,
    login,
    register,
    setIsLogin,
  };
}

export default useAuth;
