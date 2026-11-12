import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaSearch, FaUserShield, FaUserTimes, FaTimes, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useTitle from "../../../hooks/useTitle";
import { DataTable, ColumnDef } from "../../../components/common/DataTable";

export interface SearchUser {
  _id: string;
  email: string;
  created_at: string;
  role?: string;
}

interface SearchUsersApiResponse {
  data: SearchUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const MakeAdmin: React.FC = () => {
  useTitle("Make Admin");
  const axiosSecure = useAxiosSecure();
  const [emailQuery, setEmailQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    data: apiResponse,
    refetch,
    isFetching,
  } = useQuery<SearchUsersApiResponse | SearchUser[]>({
    queryKey: ["searchedUsers", emailQuery, page, pageSize],
    enabled: !!emailQuery,
    queryFn: async () => {
      const params = new URLSearchParams({
        email: emailQuery,
        page: String(page),
        limit: String(pageSize),
      });
      const res = await axiosSecure.get(`/users/search?${params.toString()}`);
      return res.data;
    },
  });

  const isPaginated = apiResponse && !Array.isArray(apiResponse) && "data" in apiResponse;
  const users: SearchUser[] = isPaginated
    ? (apiResponse as SearchUsersApiResponse).data
    : Array.isArray(apiResponse)
    ? apiResponse
    : [];

  const totalItems: number = isPaginated
    ? (apiResponse as SearchUsersApiResponse).total
    : users.length;

  const totalPages: number = isPaginated
    ? (apiResponse as SearchUsersApiResponse).totalPages
    : Math.max(1, Math.ceil(users.length / pageSize));

  const { mutateAsync: updateRole } = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) =>
      await axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      refetch();
    },
  });

  const handleRoleChange = async (
    id: string,
    currentRole: string,
    userEmail: string,
  ): Promise<void> => {
    const isRemoving = currentRole === "admin";
    const action = isRemoving ? "Remove admin privileges" : "Grant admin privileges";
    const newRole = isRemoving ? "user" : "admin";

    const confirm = await Swal.fire({
      title: `${action}?`,
      text: isRemoving
        ? `Revoke admin access for ${userEmail}.`
        : `Make ${userEmail} a platform administrator with full administrative privileges.`,
      icon: isRemoving ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: isRemoving ? "#ef4444" : "#008060",
      cancelButtonColor: "#64748b",
      confirmButtonText: isRemoving ? "Yes, Revoke" : "Yes, Make Admin",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateRole({ id, role: newRole });
      Swal.fire("Success", `${action} applied successfully.`, "success");
    } catch (error) {
      console.error("Failed to update user role:", error);
      Swal.fire("Error", "Failed to update user role. Try again.", "error");
    }
  };

  const columns: ColumnDef<SearchUser>[] = [
    {
      header: "#",
      render: (_, idx) => (
        <span className="font-semibold text-xs text-slate-400">
          {(page - 1) * pageSize + idx + 1}
        </span>
      ),
      className: "w-12 text-center",
    },
    {
      header: "User Account",
      render: (u) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs shrink-0">
            <FaEnvelope />
          </div>
          <span className="font-semibold text-sm text-slate-800">{u.email}</span>
        </div>
      ),
    },
    {
      header: "Joined Date",
      render: (u) => (
        <span className="text-xs text-slate-500">
          {new Date(u.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Current Role",
      render: (u) => {
        const isAdmin = u.role === "admin";
        const isRider = u.role === "rider";
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isAdmin
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : isRider
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {isAdmin ? "ADMIN" : isRider ? "RIDER" : "CUSTOMER"}
          </span>
        );
      },
    },
    {
      header: "Action",
      className: "text-right",
      headerClassName: "text-right",
      render: (u) => {
        const isAdmin = u.role === "admin";
        return (
          <div className="flex items-center justify-end">
            <button
              onClick={() => handleRoleChange(u._id, u.role || "user", u.email)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                isAdmin
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-600"
                  : "bg-[#20363A] hover:bg-[#122326] text-white"
              }`}
            >
              {isAdmin ? (
                <>
                  <FaUserTimes className="text-xs" />
                  <span>Remove Admin</span>
                </>
              ) : (
                <>
                  <FaUserShield className="text-xs text-[#CAEB66]" />
                  <span>Make Admin</span>
                </>
              )}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#20363A] to-[#122326] p-6 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#CAEB66]">
            Administration
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">User Roles & Access</h1>
          <p className="text-slate-300 text-sm mt-1">
            Search users by email to grant or revoke administrative permissions
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search user by email address (e.g. user@example.com)..."
            value={emailQuery}
            onChange={(e) => {
              setEmailQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#20363A] focus:bg-white transition-all"
          />
          {emailQuery && (
            <button
              onClick={() => {
                setEmailQuery("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      {emailQuery ? (
        <DataTable<SearchUser>
          columns={columns}
          data={users}
          keyExtractor={(u) => u._id}
          isLoading={isFetching}
          emptyMessage={`No users found matching "${emailQuery}"`}
          emptySubtext="Verify the email address spelling or try another query."
          emptyIcon={<FaUserShield className="text-2xl text-slate-400" />}
          pagination={
            isPaginated
              ? {
                  page,
                  pageSize,
                  totalItems,
                  totalPages,
                  onPageChange: (newPage) => setPage(newPage),
                  onPageSizeChange: (newSize) => setPageSize(newSize),
                }
              : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3.5">
            <FaSearch className="text-xl" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Search for a User
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Type any part of a user's email address above to view their details and modify their administrative permissions.
          </p>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
