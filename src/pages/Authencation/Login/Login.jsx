import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin /SocialLogin";
import toast from "react-hot-toast";

const Login = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { signIn, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    const toastId = toast.loading("Logging in...");
    signIn(data.email, data.password)
      .then(async (result) => {
        setUser(result.user);

        toast.success(
          `${result.user.displayName} logged in successfully : ${result.user.email}`,
          {
            id: toastId,
          },
        );
        navigate(from);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to login. Please check your credentials.", {
          id: toastId,
        });
      });
  };

  const handleAdminLogin = () => {
    setValue("email", "admin1@gmail.com");
    setValue("password", "admin1#123");
  };

  const handleRiderLogin = () => {
    setValue("email", "rider1@gmail.com");
    setValue("password", "rider1#123");
  };

  const handleUserLogin = () => {
    setValue("email", "alex@gmail.com");
    setValue("password", "alex#123");
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Please Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input"
              placeholder="Email"
            />

            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
                className="input w-full pr-10"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">
                Password Must be 6 characters or longer
              </p>
            )}

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>

            <button className="btn btn-primary text-black mt-4">Login</button>
          </fieldset>
          <div className="flex justify-around mt-4">
            <button
              type="button"
              onClick={handleAdminLogin}
              className="btn btn-sm"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={handleRiderLogin}
              className="btn btn-sm"
            >
              Rider
            </button>
            <button
              type="button"
              onClick={handleUserLogin}
              className="btn btn-sm"
            >
              User
            </button>
          </div>
          <p>
            <small>
              New to this website?{" "}
              <Link state={{ from }} className="btn btn-link" to="/register">
                Register
              </Link>
            </small>
          </p>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Login;
