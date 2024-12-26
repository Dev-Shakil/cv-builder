
import EditForm from '@/app/components/EditForm';
import { redirect } from 'next/navigation';

const getPassengerById = async (id) => {
    try{
      const res = await fetch(`${process.env.API_URL}/api/passenger/${id}`,{
        cache: "no-store",
      });
  
      if(!res.ok){
        throw new Error("Failed to fetch Single Passenger");
      }
      return res.json();
    }catch(e){
      console.log(e)
    }
  }
const EditEntry =async ({params}) => {
    const {id} = params;
    const passenger = await getPassengerById(id);
  //   const auth = typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem('user')) : false;
  //   if(!auth) {
  //     redirect("/");
  // }
    
  
  return (
<div className="min-w-screen min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="w-5/6 rounded-xl bg-gray-800 shadow-lg mr-3">
            <div className="flex flex-col">
                <div id="header" className="flex flex-col items-center justify-center text-white py-4 bg-blue-800">
                    <div className="text-center uppercase text-2xl">Passenger Information Entry</div>
                    
                </div>

                <div className="px-4">
                <EditForm id={id} Passenger={passenger} />
</div>
            </div>
        </div>
       
    </div>
  )
}

export default EditEntry