import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaSearch, FaUserShield, FaUserTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [emailQuery, setEmailQuery] = useState("");

  const {
    data: users = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["searchedUsers", emailQuery],
    enabled: !!emailQuery, // Only run query if emailQuery is not empty
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${emailQuery}`);
      console.log(res);
      return res.data;
    },
  });

  const { mutateAsync: updateRole } = useMutation({
    mutationFn: async ({ id, role }) =>
      await axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      refetch();
    },
  });

  const handleRoleChange = async (id, currentRole) => {
    const action = currentRole === "admin" ? "Remove admin" : "Make admin";
    const newRole = currentRole === "admin" ? "user" : "admin";

    const confirm = await Swal.fire({
      title: `${action}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateRole({ id, role: newRole });
      Swal.fire("Success", `${action} successful`, "success");
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to update user role", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Make Admin</h2>
      <div className="flex gap-2 mb-6 items-center">
        <FaSearch />
        <input
          type="text"
          className="input input-bordered w-full max-w-md"
          placeholder="Search user by email"
          value={emailQuery}
          onChange={(e) => setEmailQuery(e.target.value)}
        />
      </div>
      {isFetching && emailQuery && <p>Loading users...</p>}{" "}
      {/* Only show loading if there's an actual query */}
      {!isFetching && users.length === 0 && emailQuery && (
        <p className="text-gray-500">No users found for "{emailQuery}".</p>
      )}
      {users.length > 0 && ( // Always show table if users are found, regardless of current emailQuery if it's cleared
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Email</th>
                <th>Created At</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "admin" ? "badge-success" : "badge-ghost"
                      }`}
                    >
                      {u.role || "user"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleRoleChange(u._id, u.role || "user")}
                      className={`btn btn-sm text-black ${
                        u.role === "admin" ? "btn-error" : "btn-primary"
                      }`}
                    >
                      {u.role === "admin" ? (
                        <>
                          <FaUserTimes className="mr-1" />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <FaUserShield className="mr-1" />
                          Make Admin
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!emailQuery &&
        !isFetching && ( // Display a message when search is empty and not fetching
          <p className="text-gray-500">
            Start typing an email to search for users.
          </p>
        )}
    </div>
  );
};

export default MakeAdmin;
