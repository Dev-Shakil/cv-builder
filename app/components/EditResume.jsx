"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createFormAction, editFormAction } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import Select from "react-select";

// Server Action for login (to be implemented based on your server)



const EditResume = ({resume, office,id}) => {
  const router = useRouter();

  const [formState, setFormState] = useState({
    office: resume?.office || [],  // default to empty array if undefined
    name: resume?.name || "",
    passport_no: resume?.passport_no || "",
    dob: resume?.dob || "",
    position: resume?.position || "",
    salary: resume?.salary || "",
    contract: resume?.contract || "",
    religion: resume?.religion || "",
    social_status: resume?.social_status || "",
    picture: resume?.picture || null,
    passport_image: resume?.passport_image || null,
    place_of_birth: resume?.place_of_birth || "",
    address: resume?.address || "",
    education: resume?.education || "",
    phone_number: resume?.phone_number || "",
    passport_issue_place: resume?.passport_issue_place || "",
    passport_issue_date: resume?.passport_issue_date || "",
    passport_expire_date: resume?.passport_expire_date || "",
    height: resume?.height || "",
    weight: resume?.weight || "",
    no_of_kids: resume?.no_of_kids || "",
    nationality: resume?.nationality || "",
    experience: resume?.experience || "",
    refference: resume?.refference || "",
  });
  
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
  
    try {
      console.log("beforeSubmit");
  
      // Initialize a new FormData object
      const formDataToSubmit = new FormData();
  
      // Append scalar form fields from formState
      formDataToSubmit.append("office", JSON.stringify(formState.office));
      formDataToSubmit.append("name", formState.name);
      formDataToSubmit.append("passport_no", formState.passport_no);
      formDataToSubmit.append("dob", formState.dob);
      formDataToSubmit.append("position", formState.position);
      formDataToSubmit.append("salary", formState.salary);
      formDataToSubmit.append("contract", formState.contract);
      formDataToSubmit.append("religion", formState.religion);
      formDataToSubmit.append("social_status", formState.social_status);
      formDataToSubmit.append("place_of_birth", formState.place_of_birth);
      formDataToSubmit.append("address", formState.address);
      formDataToSubmit.append("education", formState.education);
      formDataToSubmit.append("phone_number", formState.phone_number);
      formDataToSubmit.append("passport_issue_place", formState.passport_issue_place);
      formDataToSubmit.append("passport_issue_date", formState.passport_issue_date);
      formDataToSubmit.append("passport_expire_date", formState.passport_expire_date);
      formDataToSubmit.append("height", formState.height);
      formDataToSubmit.append("weight", formState.weight);
      formDataToSubmit.append("no_of_kids", formState.no_of_kids);
      formDataToSubmit.append("nationality", formState.nationality);
      formDataToSubmit.append("experience", formState.experience);
      formDataToSubmit.append("refference", formState.refference);
  
      // Append file fields to FormData
      if (formState.picture) {
        formDataToSubmit.append("picture", formState.picture); // 'picture' is the key expected by the server
      }
      if (formState.passport_image) {
        formDataToSubmit.append("passport_image", formState.passport_image); // 'passport_image' is the key expected by the server
      }
      
      // Submit the FormData using your server action
      const result = await editFormAction(formDataToSubmit,id);
      console.log("Form successfully edited:", result);
  
      // Reset form state after successful submission
      setFormState({
        office: [],
        name: "",
        passport_no: "",
        dob: "",
        position: "",
        salary: "",
        contract: "",
        religion: "",
        social_status: "",
        picture: null,
        passport_image: null,
        place_of_birth:"",
        address:"",
        education:"",
        phone_number:"",
        passport_issue_place:"",
        passport_issue_date: "",
        passport_expire_date: "",
        height: "",
        weight: "",
        no_of_kids: "",
        nationality: "",
        experience: "",
        refference: "",
      });
      
      toast({
        title: "Success",
        description: "Form submitted successfully!",
      });
      router.push("/AdminDashboard")
    } catch (error) {
      console.error("Form creation failed:", error);
  
      toast({
        title: "Error",
        description: "Failed to submit the form.",
      });
    }
  };

  const handleChange = (e) => {
    // Check if it's a Select change event
    if (e && e.value) {
      setFormState((prev) => ({
        ...prev,
        office: e.value,  // e.value is the selected office's value
      }));
    } else {
      // Handle regular input fields
      const { name, value, files } = e.target || {};
      if (!name) return; // Early exit if name is undefined
      
      setFormState((prev) => ({
        ...prev,
        [name]: files ? files[0] : value, // Handle file input
      }));
    }
  };
 

  // Convert offices data to the format needed by React-Select
  const options = office.map(office => ({
    value: office.office_name,  // Use office ID as value
    label: office.office_name, // Use office name as label
  }));

  return (
    <div className="flex flex-col min-h-fit mt-10 max-w-7xl mx-auto p-6 py-12 bg-white shadow-xl rounded-lg border-2 border-pink-600">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-8">
        Enter Candidates CV Information
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
      <label
        htmlFor="Office" // Bind the label to the select dropdown
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Select Office
      </label>
      <div className="mt-2">
      <Select
  name="office"
  options={options}
  value={formState.office ? options.filter(option => formState.office.includes(option.value)) : []}
  onChange={(selectedOptions) =>
    setFormState((prevState) => ({
      ...prevState,
      office: selectedOptions.map((option) => option.value),
    }))
  }
  isMulti
  isSearchable={true}
  className="w-full text-gray-900"
/>
      </div>
    </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Name", name: "name", type: "text", value: "name" },
          { label: "Passport No", name: "passport_no", type: "text", value: "passport_no" },
          { label: "Date of Birth", name: "dob", type: "date", value: "dob" },
          { label: "Position", name: "position", type: "text", value: "position" },
          { label: "Salary", name: "salary", type: "number", value: "salary" },
          { label: "Contract", name: "contract", type: "text", value: "contract" },
          { label: "Religion", name: "religion", type: "text", value: "religion" },
          { label: "Social Status", name: "social_status", type: "text", value: "social_status" },
          { label: "Place Of Birth", name: "place_of_birth", type: "text", value: "place_of_birth" },
          { label: "Address", name: "address", type: "text", value: "address" },
          { label: "Education", name: "education", type: "text", value: "education" },
          { label: "Phone Number", name: "phone_number", type: "text", value: "phone_number" },
          { label: "Passport Issue Date", name: "passport_issue_date", type: "date", value: "passport_issue_date" },
          { label: "Passport Issue Place", name: "passport_issue_place", type: "text", value: "passport_issue_place" },
          { label: "Passport Expiry Date", name: "passport_expire_date", type: "date", value: "passport_expire_date" },
          { label: "Height", name: "height", type: "number", value: "height" },
          { label: "Weight", name: "weight", type: "number", value: "weight" },
          { label: "Number of Kids", name: "no_of_kids", type: "number", value: "no_of_kids" },
          { label: "Nationality", name: "nationality", type: "text", value: "nationality" },
          { label: "Experience", name: "experience", type: "text", value: "experience" },
          { label: "Reference", name: "refference", type: "text", value: "refference" }
        ].map(({ label, name, type,value }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {label}
            </label>
            <div className="mt-2">
              <input
                id={name}
                name={name}
                type={type}
                value={formState[name]}
                onChange={handleChange}
                required={name !== "refference"} // Optional field for reference
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        ))}
        {[
          { label: "Picture", name: "picture" },
          { label: "Passport Image", name: "passport_image" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {label}
            </label>
            <div className="mt-2">
              <input
                id={name}
                name={name}
                
                type="file"
                onChange={handleChange}
                accept="image/*"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        ))}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResume;

