// "use client";

// import { createOffice } from "@/lib/actions";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// const AddOffice = () => {
//   const router = useRouter();
//   const [office, setOffice] = useState({
//     office_name: "",
//     office_number: "",
//     office_address: "",
//     office_email: "",
//     office_password: "",
//     confirm_password: "", // Added confirm_password field
//     office_logo: null,
//     role:"user"
//   });
//   console.log(office)
//   const handleFileChange = (e) => {
//     setOffice({ ...office, office_logo: e.target.files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const {
//       office_name,
//       office_number,
//       office_address,
//       office_email,
//       office_password,
//       confirm_password,
//       office_logo,
//       role
//     } = office;

//     // Validate that passwords match
//     if (office_password !== confirm_password) {
//       alert("Passwords do not match.");
//       return;
//     }

//     if (!office_name || !office_number || !office_address || !office_email || !office_password) {
//       alert("All fields are required except office logo.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("office_name", office_name);
//     formData.append("office_number", office_number);
//     formData.append("office_address", office_address);
//     formData.append("office_email", office_email);
//     formData.append("office_password", office_password);
//     formData.append("role", role);
//     if (office_logo) {
//       formData.append("office_logo", office_logo);
//     }

//     try {
//       const res = await createOffice(formData); // Call the server action
//       if (res.ok) {
//         router.push("/AdminDashboard/Offices");
//         alert("Successfully created a new office");
//         router.refresh();
//       } else {
//         throw new Error("Failed to create an office");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="h-[92vh] flex justify-center items-center">
//       <div className="flex min-h-fit max-w-3xl flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white shadow-xl rounded-lg border-2 border-teal-600">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//           <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-teal-900">
//             Office Registration
//           </h2>
//         </div>
//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
//           <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={handleSubmit}>
//             {["office_name", "office_number", "office_address", "office_email", "office_password"].map((field) => (
//               <div key={field} className="col-span-1">
//                 <label
//                   htmlFor={field}
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   {field.split("_").join(" ").toUpperCase()}
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type={field === "office_password" ? "password" : "text"}
//                     id={field}
//                     name={field}
//                     required
//                     onChange={(e) => setOffice({ ...office, [field]: e.target.value })}
//                     value={office[field]}
//                     className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                   />
//                 </div>
//               </div>
//             ))}
//             {/* Confirm Password */}
//             <div className="col-span-1">
//               <label
//                 htmlFor="confirm_password"
//                 className="block text-sm font-medium leading-6 text-gray-900"
//               >
//                 CONFIRM PASSWORD
//               </label>
//               <div className="mt-2">
//                 <input
//                   type="password"
//                   id="confirm_password"
//                   name="confirm_password"
//                   required
//                   onChange={(e) => setOffice({ ...office, confirm_password: e.target.value })}
//                   value={office.confirm_password}
//                   className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//               </div>
//             </div>
//             <div className="col-span-1">
//               <label
//                 htmlFor="role"
//                 className="block text-sm font-medium leading-6 text-gray-900"
//               >
//                 Role
//               </label>
//               <div className="mt-2">
//                 <select
//                   id="role"
//                   name="role"
//                   value={office.role}
//                   onChange={(e) => setOffice({ ...office, role: e.target.value })}
//                   className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//             </div>
//             <div className="col-span-1 sm:col-span-2">
//               <label
//                 htmlFor="office_logo"
//                 className="block text-sm font-medium leading-6 text-gray-900"
//               >
//                 Office Logo (Optional)
//               </label>
//               <div className="mt-2">
//                 <input
//                   type="file"
//                   id="office_logo"
//                   name="office_logo"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//               </div>
//             </div>
//             <div className="col-span-1 sm:col-span-2">
//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Add a New Office
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddOffice;

"use client";

import { createOffice } from "@/lib/actions";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AddOffice = () => {
  const router = useRouter();
  const [office, setOffice] = useState({
    office_name: "",
    office_numbers: [""], // Store multiple phone numbers
    office_address: "",
    office_email: "",
    office_password: "",
    confirm_password: "",
    office_logo: null,
    role: "user"
  });

  console.log(office);

  const handleFileChange = (e) => {
    setOffice({ ...office, office_logo: e.target.files[0] });
  };

  const handlePhoneNumberChange = (index, value) => {
    const updatedNumbers = [...office.office_numbers];
    updatedNumbers[index] = value;
    setOffice({ ...office, office_numbers: updatedNumbers });
  };

  const addPhoneNumber = () => {
    setOffice({ ...office, office_numbers: [...office.office_numbers, ""] });
  };

  const removePhoneNumber = (index) => {
    const updatedNumbers = office.office_numbers.filter((_, i) => i !== index);
    setOffice({ ...office, office_numbers: updatedNumbers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      office_name,
      office_numbers,
      office_address,
      office_email,
      office_password,
      confirm_password,
      office_logo,
      role
    } = office;

    if (office_password !== confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    if (!office_name || office_numbers.some(num => !num) || !office_address || !office_email || !office_password) {
      alert("All fields are required except office logo.");
      return;
    }

    const formData = new FormData();
    formData.append("office_name", office_name);
    office_numbers.forEach((num, index) => {
      formData.append(`office_numbers[${index}]`, num);
    });
    formData.append("office_address", office_address);
    formData.append("office_email", office_email);
    formData.append("office_password", office_password);
    formData.append("role", role);
    if (office_logo) {
      formData.append("office_logo", office_logo);
    }

    try {
      const res = await createOffice(formData);
      if (res.ok) {
        router.push("/AdminDashboard/Users");
        await refreshAdminDashboard();
        alert("Successfully created a new office");
        router.refresh();
      } else {
        throw new Error("Failed to create an office");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[92vh] flex justify-center items-center">
      <div className="flex min-h-fit max-w-3xl flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white shadow-xl rounded-lg border-2 border-teal-600">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-teal-900">
            Office Registration
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={handleSubmit}>
            {/* Office Name */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-900">Office Name</label>
              <input
                type="text"
                value={office.office_name}
                onChange={(e) => setOffice({ ...office, office_name: e.target.value })}
                required
                className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
              />
            </div>

            {/* Office Address */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-900">Office Address</label>
              <input
                type="text"
                value={office.office_address}
                onChange={(e) => setOffice({ ...office, office_address: e.target.value })}
                required
                className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
              />
            </div>

            {/* Multiple Phone Numbers */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-900">Office Numbers</label>
              {office.office_numbers.map((num, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={num}
                    onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                    required
                    className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => removePhoneNumber(index)} className="text-red-500">
                      ✖
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPhoneNumber} className="mt-2 text-blue-500">
                + Add Another Number
              </button>
            </div>

            {/* Office Email */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-900">Office Email</label>
              <input
                type="email"
                value={office.office_email}
                onChange={(e) => setOffice({ ...office, office_email: e.target.value })}
                required
                className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
              />
            </div>

            {/* Password */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                value={office.office_password}
                onChange={(e) => setOffice({ ...office, office_password: e.target.value })}
                required
                className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
              />
            </div>

            {/* Confirm Password */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-900">Confirm Password</label>
              <input
                type="password"
                value={office.confirm_password}
                onChange={(e) => setOffice({ ...office, confirm_password: e.target.value })}
                required
                className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
              />
            </div>

            {/* Role Selection */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-900">Role</label>
              <select
                value={office.role}
                onChange={(e) => setOffice({ ...office, role: e.target.value })}
                className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Office Logo Upload */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-900">Office Logo (Optional)</label>
              <input type="file" onChange={handleFileChange} className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm" />
            </div>

            {/* Submit Button */}
            <div className="col-span-2">
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md">Add a New Office</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOffice;
