import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["userInfo", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/${user.email}`);
      return res.data;
    },
  });

  if (isLoading || !userInfo) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img src={user?.photoURL} alt="User" />
              </div>
            </div>
            <div>
              <h2 className="card-title">{user?.displayName}</h2>
              <p>{userInfo.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <p>
              <span className="font-bold">Role:</span> {userInfo.role}
            </p>
            <p>
              <span className="font-bold">Member Since:</span>{" "}
              {new Date(userInfo.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
