"use client"
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component';
import { MdDelete, MdEditDocument } from 'react-icons/md';
import { FaFileDownload } from "react-icons/fa";
import TextInput from './TextInput';
import Image from 'next/image';

const Admin_Table = ({passenger}) => {
    const router = useRouter()
    const [search, setSearch]= useState('');
    const [users, setUsers] = useState([]);
    const [filter, setFilter]= useState([]);
    const [pass, setPass]= useState({
        name:"",
        mofa:"",
        medical:"",
        visa_no:"",
        bio_finger:"",
        bmet_finger:"",
        training:"",
        delivery:"",
        manpower:"",

    });
    
    const user =  typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem('user')) : false;
    console.log(user.role)
    useEffect(()=>{
        if(!user || user.role!=='admin'){
            redirect("/")
        }
    },[]);
    const HandleRemove = async (id)=>{
        try {
            const res = await fetch(`/api/passenger/${id}`, {
              method: "DELETE",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({id}),
            });
      
            if (res.ok) {
              alert("Successfully Deleted Your User")
              router.refresh();
            } else {
              throw new Error("Failed to Delete The User");
            }
          } catch (error) {
            console.log(error);
          }
    }
    function formatDate(dateString) {
        if (!dateString) return "";
        let date = new Date(dateString);
        let day = String(date.getUTCDate()).padStart(2, '0');
        let month = String(date.getUTCMonth() + 1).padStart(2, '0');
        let year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
    }
    const columns = [
      {
          name: <p className="font-bold text-lg">Actions</p>,
          selector: row => (
              <div className="flex items-center gap-2">
                  <Link href={`AdminDashboard/EditEntry/${row._id}`}>
                      <MdEditDocument className="text-2xl text-green-600 font-bold" />
                  </Link>
                  <MdDelete
                      className="text-2xl text-red-800 font-bold cursor-pointer"
                      onClick={() => HandleRemove(row._id)}
                  />
              </div>
          ),
          maxwidth: "25px",
      },
      {
          name: <p className="font-bold text-lg">Name</p>,
          selector: row => (
              <div className="flex flex-col">
                  <h3 className="font-bold text-md uppercase">{row.name}</h3>
                  <p className="font-semibold">Passport: {row.passport_no}</p>
                  <p>Date of Birth: {row.dob}</p>
                  <p>Nationality: {row.nationality}</p>
              </div>
          ),
          wrap: true,
          minWidth: "200px",
      },
      {
          name: <p className="font-bold text-lg">Position</p>,
          selector: row => row.position,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Salary</p>,
          selector: row => `$${row.salary}`,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Contract</p>,
          selector: row => row.contract,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Religion</p>,
          selector: row => row.religion,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Social Status</p>,
          selector: row => row.social_status,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Picture</p>,
          selector: row => (
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
          selector: row => (
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
          selector: row => `${row.height} cm`,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Weight</p>,
          selector: row => `${row.weight} kg`,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Number of Kids</p>,
          selector: row => row.no_of_kids,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Experience</p>,
          selector: row => row.experience,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Reference</p>,
          selector: row => row.refference,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Passport Expiry</p>,
          selector: row => row.passport_expire_date,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Status</p>,
          selector: row => (
              <p
                  className={`p-1 text-md rounded-lg ${
                      row.status === "Pending"
                          ? "bg-yellow-500 text-white"
                          : row.status === "Approved"
                          ? "bg-green-700 text-white"
                          : "bg-red-600 text-white"
                  }`}
              >
                  {row.status}
              </p>
          ),
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Approved By</p>,
          selector: row => row?.approved_office,
          wrap: true,
      },
      {
          name: <p className="font-bold text-lg">Entry Date</p>,
          selector: row => formatDate(row.createdAt),
          wrap: true,
      },
      {
        name: <p className="font-bold text-lg">Office</p>,
        selector: row => (
            <div className="">
                {Array.isArray(row?.office)
                    ? row.office.map((off, index) => <li className="list-none flex text-sm" key={index}>{index+1}. {off}</li>)
                    : row?.office || "No office data"}
            </div>
        ),
        minWidth: "250px",
        wrap: true,
    },
      
  ];
    useEffect(()=>{
        const result= passenger.filter((item)=>{
         return item?.name?.toLowerCase().match(search.toLocaleLowerCase()) || item?.passport_no?.toLowerCase().match(search.toLocaleLowerCase()) || item?.agent?.toLowerCase().match(search.toLocaleLowerCase())
        });
        setFilter(result);
    },[search]);
   
    useEffect(() => {
      // Update the countdown every 24 hours
      const interval = setInterval(() => {
        setDaysRemaining((prev) => Math.max(prev - 1, 0));
      }, 1000 * 60 * 60 * 24); // 24 hours in milliseconds
  
      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        let result = passenger;
    
        if (pass.name) {
          result = result.filter((item) =>
            item.agent?.toLowerCase().includes(pass.name.toLowerCase())
          );
        }
        
        if (pass.medical) {
          result = result.filter((item) =>
            item.medical?.toLowerCase().includes(pass.medical.toLowerCase())
          );
        }
        
        if (pass.mofa) {
          result = result.filter((item) =>
            item.mofa?.toLowerCase().includes(pass.mofa.toLowerCase())
          );
        }
        if (pass.bio_finger) {
          result = result.filter((item) =>
            item.bio_finger?.toLowerCase().includes(pass.bio_finger.toLowerCase())
          );
        }
        if (pass.training) {
          result = result.filter((item) =>
            item.training?.toLowerCase().includes(pass.training.toLowerCase())
          );
        }
        if (pass.visa_no) {
          result = result.filter((item) =>
            item.visa_no?.toLowerCase().includes(pass.visa_no.toLowerCase())
          );
        }
        if (pass.bmet_finger) {
          result = result.filter((item) =>
            item.bmet_finger?.toLowerCase().includes(pass.bmet_finger.toLowerCase())
          );
        }
        if (pass.manpower) {
          result = result.filter((item) =>
            item.manpower?.toLowerCase().includes(pass.manpower.toLowerCase())
          );
        }
        if (pass.delivery) {
          result = result.filter((item) =>
            item.delivery?.toLowerCase().includes(pass.delivery.toLowerCase())
          );
        }
    
        setFilter(result);
      }, [pass, passenger]);
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
        "Training": row?.training,
        "BMET Finger": row?.bmet_finger,
        "Manpower": row?.manpower,
        "Delivery": row?.delivery,
        "Payment": row?.payment,
        "Remark": row?.remark,
    }))
    console.log(pass)
  return (
    <>
    <div>
    {/* <div className="!bg-blue-400 flex gap-2 mx-2 px-3 py-2">
        <TextInput name="name" id="name" type="text" placeholder="Type Name" lebel="Agent Name" list="agents" value={pass.name} handleChange={(e)=>{setPass({...pass,name:e.target.value})}}/>
        <datalist id="agents">
            <option value="" disabled>Select Agent</option>
            {users.map(user => <option key={user._id} value={user.name}>{user.name}</option>)}
        </datalist>
        <TextInput name="medical" id="medical" type="text" placeholder="Type Medical" lebel="Medical" value={pass.medical} handleChange={(e)=>{setPass({...pass,medical:e.target.value})}}/>
        <TextInput name="mofa" id="mofa" type="text" placeholder="Type mofa" lebel="Mofa" value={pass.mofa} handleChange={(e)=>{setPass({...pass,mofa:e.target.value})}}/>
        <TextInput name="manpower" id="manpower" type="text" placeholder="Type manpower" lebel="Manpower" value={pass.manpower} handleChange={(e)=>{setPass({...pass,manpower:e.target.value})}}/>
        
        <div className="mb-4">
        <label className="block  text-white">Training Info</label>
        <select
         name="training" id="training" placeholder="Type Training Info" lebel="Training" value={pass.training} 
          className="form-input mt-1 block w-full p-2 text-black"
          onChange={(e) => {setPass({...pass, training: e.target.value})}}
        >
        <option value="">Select Options</option>
        <option value="Yes" >YES</option>
        <option value="No" >NO</option>
        
        
        </select>
      </div>
        <div className="mb-4">
        <label className="block  text-white">BMET Finger</label>
        <select
         name="bmet_finger" id="bmet_finger" placeholder="Type Info" lebel="bmet_finger" value={pass.bmet_finger} 
          className="form-input mt-1 block w-full p-2 text-black"
          onChange={(e) => {setPass({...pass, bmet_finger: e.target.value})}}
        >
        <option value="">Select Options</option>
        <option value="Yes" >YES</option>
        <option value="No" >NO</option>
        
        
        </select>
      </div>
       
    </div> */}
    <DataTable

            columns={columns}
            data={filter}
            pagination
            highlightOnHover
            subHeader
            subHeaderComponent={<div className="flex justify-between items-center w-full">                <input type="text" className="w-25 form-control border-2 border-blue-500 p-2 rounded-md" placeholder="Search..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
            {/* <CSVLink data={extractedData} filename="hello" className="bg-blue-700 p-3 my-5 text-white flex items-center justify-center w-fit rounded"><FaFileDownload className="mr-2"/> Download</CSVLink> */}
                </div>

            }
            subHeaderAlign="left"
        />
        </div>
        </>
  )
}

export default Admin_Table