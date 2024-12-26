"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaFileDownload } from "react-icons/fa";
import { updateUserStatus } from "@/lib/actions";

function formatDate(dateString) {
  if (!dateString) return "";
  let date = new Date(dateString);
  let day = String(date.getUTCDate()).padStart(2, "0");
  let month = String(date.getUTCMonth() + 1).padStart(2, "0");
  let year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

const User_Table = ({ resume }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const options = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  // Helper function to update status with server action
  async function handleStatusUpdate(id, newStatus,office, setLoading) {
    try {
      setLoading(true); // Show a loading indicator if needed
      await updateUserStatus(id, newStatus,office);
      router.refresh();
      alert("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error.message);
      alert("Failed to update status");
    } finally {
      setLoading(false); // Hide the loading indicator
    }
  }

  const columns = [
    {
      name: <p className="font-bold text-lg">Name</p>,
      selector: (row) => (
        <div className="flex flex-col">
          <h3 className="font-bold text-md uppercase">{row.name}</h3>
          <p className="font-semibold">Passport: {row.passport_no}</p>
          <p>Date of Birth: {row.dob}</p>
          <p>Nationality: {row.nationality}</p>
        </div>
      ),
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Position</p>,
      selector: (row) => row.position,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Salary</p>,
      selector: (row) => `$${row.salary}`,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Contract</p>,
      selector: (row) => row.contract,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Religion</p>,
      selector: (row) => row.religion,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Social Status</p>,
      selector: (row) => row.social_status,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Picture</p>,
      selector: (row) => (
        <Image
          src={row.picture}
          alt={row.name}
          width={100}
          height={100}
          className="h-16 w-16 rounded object-cover"
        />
      ),
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Passport Image</p>,
      selector: (row) => (
        <Image
          src={row.passport_image}
          alt={`Passport of ${row.name}`}
          width={100}
          height={100}
          className="h-16 w-16 rounded object-cover"
        />
      ),
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Height</p>,
      selector: (row) => `${row.height} cm`,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Weight</p>,
      selector: (row) => `${row.weight} kg`,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Number of Kids</p>,
      selector: (row) => row.no_of_kids,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Experience</p>,
      selector: (row) => row.experience,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Reference</p>,
      selector: (row) => row.refference,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Passport Expiry</p>,
      selector: (row) => row.passport_expire_date,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Status</p>,
      selector: (row) => (
        <div>
          <select
            value={row?.status}
            onChange={(e) => handleStatusUpdate(row._id, e.target.value,user.office_name, setLoading)}
            className="border-2 rounded-md p-2 w-full"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {loading && <p className="text-sm text-gray-500 mt-1">Updating...</p>}
        </div>
      ),
      wrap: true,
      minWidth: "200px",
    },
    {
      name: <p className="font-bold text-lg">Entry Date</p>,
      selector: (row) => formatDate(row.createdAt),
      wrap: true,
    },
  ];

  useEffect(() => {
    // Run only on the client
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(window.localStorage.getItem("user"))
        : null;
    setUser(storedUser);

    if (!storedUser || storedUser?.role !== "user") {
      router.push("/");
    }
  }, []);

  // const singleUsersData = resume.filter((pax) => {
  //   return (
  //     Array.isArray(pax.office) &&
  //     pax.office.includes(user?.office_name) &&
  //     pax?.approved_office === user?.office_name &&  // Check if approved_office matches user.office_name
  //     pax.status !== "Approved" 
  //   );
  // });
  const singleUsersData = resume.filter((pax) => {
    return (
      Array.isArray(pax.office) &&
      pax.office.includes(user?.office_name) && // Ensure user's office is in the office array
      (pax.approved_office === user?.office_name || !pax.approved_office) && // Only include if approved_office matches or it's not approved yet
      !(pax.status === "Approved" && pax.approved_office !== user?.office_name) // Exclude "Approved" items if approved_office doesn't match
    );
  });
  const HandleLogout = () => {
    typeof window !== "undefined"
      ? window.localStorage.removeItem("user")
      : false;
    router.push("/");
  };

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const result = singleUsersData.filter((item) => {
      return (
        item?.name?.toLowerCase().match(search.toLowerCase()) ||
        item?.passport_no?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilter(result);
  }, [search]);

  const extractedData = filter.map((row) => ({
    Name: row?.name,
    Passport: row?.passport_no,
    Gender: row?.gender,
    Country: row?.country,
    Medical: row?.medical,
    Mofa: row?.mofa,
    "Bio Finger": row?.bio_finger,
    "Police Clearance": row?.pc_no,
    "Visa No": row?.visa_no,
    "ID No": row?.id_no,
    "Visa Stamping Date": row?.visa_stamping_date,
    Training: row?.trainging,
    "BMET Finger": row?.bmet_finger,
    Manpower: row?.manpower,
    Delivery: row?.delivery,
    Payment: row?.payment,
    Remark: row?.remark,
  }));

  return (
    <>
      <nav className="flex items-center top-0 sticky w-full justify-between bg-teal-500 py-3 px-6">
        <p className="flex items-center flex-shrink-0 text-white mr-6 hover:text-pink-800 text-xl cursor-pointer">
          {user?.office_name?.toUpperCase()}
        </p>

        <div className="flex gap-3">
          <button
            onClick={HandleLogout}
            className="inline-block text-md px-4 py-3 leading-none border rounded text-white border-white hover:border-transparent font-bold hover:text-teal-500 hover:bg-black lg:mt-0"
          >
            Logout
          </button>
        </div>
      </nav>
      <p className="p-5 text-xl font-bold">Total : {singleUsersData.length}</p>
      <DataTable
        columns={columns}
        data={singleUsersData}
        pagination
        highlightOnHover
        subHeader
        subHeaderComponent={
          <div className="flex justify-between items-center w-full">
            <input
              type="text"
              className="w-25 form-control border-2 border-blue-500 p-2 rounded-md"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      />
    </>
  );
};

export default User_Table;
