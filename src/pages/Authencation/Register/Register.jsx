import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../SocialLogin /SocialLogin";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = React.useState(null);
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    const toastId = toast.loading("Creating account...");
    console.log(data);
    console.log(createUser);
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);

        // update user info in database
        const userInfo = {
          email: data.email,
          role: "user",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        const userRes = await axiosInstance.post("/users", userInfo);
        console.log(userRes.data);

        // update user info in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };

        updateUserProfile(userProfile)
          .then(() => {
            console.log("user profile updated");
            toast.success("Account created successfully!", { id: toastId });
            navigate(from);
          })
          .catch((error) => {
            console.error(error);
            toast.error("Failed to update user profile.", { id: toastId });
          });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to create account. Please try again.", {
          id: toastId,
        });
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadURL = `https://api.imgbb.com/1/upload?&key=${
      import.meta.env.VITE_imgbb_key
    }`;
    const res = await axios.post(imageUploadURL, formData);
    setProfilePic(res.data.data.url);
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            {/* name field */}
            <label className="label">Your Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input"
              placeholder="Your Name"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Name is required</p>
            )}
            {/* name field */}
            <label className="label">Your Name</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="input"
              placeholder="Your Profile picture"
            />

            {/* email field */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Email is required</p>
            )}
            {/* password field*/}
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true, minLength: 6 })}
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
                Password must be 6 characters or longer
              </p>
            )}

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
            <button className="btn btn-primary text-black mt-4">
              Register
            </button>
          </fieldset>
          <p>
            <small>
              Already have an account?{" "}
              <Link className="btn btn-link" to="/login">
                Login
              </Link>
            </small>
          </p>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Register;
