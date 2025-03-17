"use client";
import html2canvas from "html2canvas";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";

const Cv_format = ({ resume }) => {
  // const componentRef = useRef(null);
  
  const [user, setUser] = useState();
  console.log(user);
  const { toPDF, targetRef } = usePDF({filename: `${resume?.name}.pdf`});
  const componentRef = useRef(null);

  const captureAsJPG = async () => {
    if (componentRef.current) {
      const canvas = await html2canvas(componentRef.current, { scale: 2 });
      const image = canvas.toDataURL("image/jpeg", 1.0); // Convert to JPG

      // Create a link to download the image
      const link = document.createElement("a");
      link.href = image;
      link.download = "component-image.jpg";
      link.click();
    }
  };
  const router = useRouter();
  useEffect(() => {
    // Run only on the client
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(window.localStorage.getItem("user"))
        : null;
    setUser(storedUser);

    // if (!storedUser || storedUser?.role !== "user") {
    //   router.push("/");
    // }
  }, []);
  const printRef = useRef();
  const handlePrint = useReactToPrint({ contentRef: printRef });
  const formattedDate = resume?.dob
    ? new Date(resume?.dob).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(resume?.dob);
  
  return (
    <>
    
      <div ref={componentRef}
         className="w-[1000px] p-5 mx-auto">
        <div>
          {user ? (
            <Image
              src={user?.office_logo}
              alt={resume?.name}
              width={300}
              height={200}
              className="rounded w-full h-[120px]  object-contain"
            />
          ) : (
            "...loading"
          )}
        </div>
        <div className="flex justify-end">
          <div className="grid grid-cols-2 border border-black w-[35%]">
            <div className="border-r border-black px-1 pb-2 !pt-0  ">
              REF NO:
            </div>
            <div className="px-1 pb-2 !pt-0 text-center  border-r border-black">
              2
            </div>
          </div>
        </div>
        <div className="w-full flex gap-x-2">
          <div className="w-[65%]">
            <h3 className="text-[20px] ">APPLICATION FOR EMPLOYMENT</h3>
            <div className=" mx-auto mt-4 shadow-lg bg-white">
              {/* Position Details */}
              <div className="border border-black font-semibold border-collapse">
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 text-[13px] pb-2">
                    POSITION APPLIED FOR:
                  </div>
                  <div className="px-1 text-[13px] border-r border-black pb-2 text-center">
                    {resume?.position}
                  </div>
                  <div className="px-1 pb-2 text-[13px] text-end">الوظيفة</div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r pb-2 border-black px-1 text-[13px]">
                    MONTHLY SALARY:
                  </div>
                  <div className="px-1 border-r border-black pb-2 text-[13px] text-center">
                    {resume?.salary}
                  </div>
                  <div className="px-1 text-[13px] text-end pb-2">:الراتب</div>
                </div>

                <div className="grid grid-cols-3">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    CONTRACT PERIOD:
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                    {resume?.contract}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">مدة العقد:</div>
                </div>
              </div>

              {/* Full Name */}
              <div className="grid grid-cols-3 border border-black  font-semibold mt-2">
                <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                  FULL NAME:
                </div>
                <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                  {resume?.name}
                </div>
                <div className="text-end px-1 pb-2 !pt-0 text-[13px]">الاسم كامل:</div>
              </div>

              {/* Details Section */}
              <div className="text-center text-[13px] font-bold mt-2 bg-gray-200 py-1 pb-2 border border-black">
                DETAILS OF APPLICATION
              </div>

              <div className="border border-black font-semibold">
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    NATIONALITY:
                  </div>
                  <div className="border-r uppercase border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {resume?.nationality}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">الجنسية</div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    RELIGION:
                  </div>
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center uppercase">
                    {resume?.religion}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">الدين</div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    DATE OF BIRTH:
                  </div>
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {formattedDate}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">تاريخ الميلاد</div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    AGE:
                  </div>
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {age !== null ? age : "N/A"} YEARS
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">العمر</div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    PLACE OF BIRTH:
                  </div>
                  <div className="uppercase border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {resume?.place_of_birth}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">مكان الميلاد</div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    ADDRESS:
                  </div>
                  <div className=" uppercase border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {resume?.address}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">العنوان</div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    MARITAL STATUS:
                  </div>
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {resume?.social_status}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">
                    الحالة الاجتماعية
                  </div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    NO. OF CHILDREN:
                  </div>
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {resume?.no_of_kids}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">عدد الأطفال</div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    WEIGHT (KG):
                  </div>
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {resume?.weight}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">الوزن</div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    HEIGHT (FEET):
                  </div>
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {resume?.height}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">الطول</div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    EDUCATION:
                  </div>
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {resume?.education}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">التعليم</div>
                </div>

                <div className="grid grid-cols-3">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    CONTACT NO:
                  </div>
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    {resume?.phone_number}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-end">رقم الهاتف</div>
                </div>
              </div>
              {/* Work Experience */}
              <div className="text-center text-[15px] font-bold mt-2 bg-gray-200 py-1 pb-2 border border-black">
                WORK EXPERIENCE
              </div>
              <div className="border border-black px-1 pb-2 !pt-0 text-[13px] text-center uppercase font-semibold">
                {resume?.experience}
              </div>
              <div className="border mt-2 border-black text-[13px] font-semibold border-collapse">
                <div className="grid grid-cols-2 border-b border-black">
                  <div className="border-r pb-2 border-black p-1 text-[13px]">
                    HOUSEHOLD EXPERIENCE
                  </div>
                  <div className="p-1 pb-2 text-[13px] border-r border-black text-center">
                    خبرات العمل:
                  </div>
                </div>

                <div className="grid grid-cols-4 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                    BABY SITTING
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                    CLEANING
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-center border-r border-black">
                    COOKING
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-center">WASHING</div>
                </div>

                <div className="grid grid-cols-4">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-center text-[20px] font-bold">
                    √
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[20px] font-bold border-r border-black text-center">
                    √
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[20px] font-bold border-r border-black text-center">
                    √
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[20px] font-bold   text-center">
                    √
                  </div>
                </div>
              </div>
              <div className="border mt-2 border-black  font-semibold border-collapse">
                <div className="grid grid-cols-2 border-b border-black border-collapse">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    LANGUAGE SPOKEN
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-center">
                    اجادة اللغات
                  </div>
                </div>

                <div className="grid grid-cols-4 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center"></div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                    VERY GOOD ممتاز
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-center border-r border-black">
                    GOOD متوسط{" "}
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] text-center">
                    LITTLE قليل
                  </div>
                </div>

                <div className="grid grid-cols-4 border-collapse border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-center text-[13px] font-bold">
                    ARABIC
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[20px] font-bold border-r border-black text-center">
                    √
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[20px] font-bold border-r border-black text-center"></div>
                  <div className="px-1 pb-2 !pt-0 text-[20px] font-bold   text-center"></div>
                </div>
                <div className="grid grid-cols-4 border-b border-black border-collapse">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-center text-[13px] font-bold">
                    ENGLISH
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[20px] font-bold border-r border-black text-center"></div>
                  <div className="px-1 pb-2 !pt-0 text-[20px] font-bold border-r border-black text-center">
                    √
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[20px] font-bold   text-center"></div>
                </div>
              </div>
              <div className="border mt-2 border-black text-lg font-semibold border-collapse">
                <div className="grid grid-cols-1 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    PASSPORT DETAILS
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    PASSPORT NO.
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                    {resume?.passport_no}
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    DATE OF ISSUED
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                    {resume?.passport_issue_date}
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    DATE OF EXPIRATION
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                    {resume?.passport_expire_date}
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    PLACE ISSUED
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                    {resume?.passport_issue_place}
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                    REFERENCE
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                    {resume?.refference}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[35%] gap-y-3 flex flex-col mt-2 h-full">
            <Image
              src={resume?.picture}
              alt={resume?.name}
              width={300}
              height={500}
              className="rounded object-cover"
            />
            <Image
              src={resume?.passport_image}
              alt={resume?.name}
              width={300}
              height={900}
              className="rounded h-full  object-contain"
            />
          </div>
        </div>
        <div className="bg-gray-700 text-white w-full flex gap-5 items-center justify-center text-2xl pb-3 flex-wrap">
          {Array.isArray(user?.office_number)
            ? user?.office_number.map((number, index) => (
                <span key={index}>{number}</span>
              ))
            : user?.office_number}
        </div>
        <div className="bg-gray-700 text-white w-full flex gap-3 items-center justify-center text-2xl pb-4 flex-wrap">
          {user?.office_email}
        </div>
      </div>
      
      <div className="flex justify-center mb-4 w-[1000px] mx-auto">
        {printRef && (
          <div className="flex gap-x-3">
          {/* <button
            className="bg-orange-500 px-6 py-2 rounded-lg text-white text-xl font-medium"
            // onClick={handlePrint}
            onClick={()=>toPDF()}
          >
            Download PDF
          </button> */}
          <button onClick={captureAsJPG}>Download PDF</button>
         </div>
        )}
      </div>
    </>
  );
};

export default Cv_format;