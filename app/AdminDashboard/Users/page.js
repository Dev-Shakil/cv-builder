import { fetchAllOffices } from "@/lib/actions";
import Image from "next/image";
import { MdDeleteForever } from "react-icons/md";

const OfficeDashboard = async () => {
  // Fetch all offices using the server action
  const offices = await fetchAllOffices();

  return (
    <section className="h-screen bg-gray-100 px-4 text-gray-600 antialiased">
      <div className="flex flex-col">
        <div className="mx-auto mt-2 w-full rounded-sm border border-gray-200 bg-white shadow-lg">
          <header className="border-b border-gray-100 px-5 py-4">
            <div className="font-semibold text-gray-800">Offices</div>
          </header>

          <div className="overflow-x-auto p-3">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400">
                <tr>
                <th className="p-2">
                    <div className="text-left font-semibold">Logo</div>
                  </th>
                  <th className="p-2">
                    <div className="text-left font-semibold">Office Name</div>
                  </th>
                  <th className="p-2">
                    <div className="text-left font-semibold">Office Number</div>
                  </th>
                  <th className="p-2">
                    <div className="text-left font-semibold">Address</div>
                  </th>
                  <th className="p-2">
                    <div className="text-left font-semibold">Email</div>
                  </th>
                  <th className="p-2">
                    <div className="text-left font-semibold">Role</div>
                  </th>
                  <th className="p-2">
                    <div className="text-center font-semibold">Actions</div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {offices.map((office) => (
                  <tr key={office._id}>
                    <td className="p-2">
                      {office.office_logo ? (
                        <Image
                          src={office.office_logo}
                          alt={`${office.office_name} Logo`}
                          width="100"
                          height="60"
                          className=""
                        />
                      ) : (
                        <div className="text-gray-400">No Logo</div>
                      )}
                    </td>
                    <td className="p-2">{office.office_name}</td>
                    <td className="p-2">{office.office_number}</td>
                    <td className="p-2">{office.office_address}</td>
                    <td className="p-2">{office.office_email}</td>
                    <td className="p-2">{office.role}</td>
                    <td className="p-2 text-center">
                      <button className="text-red-500 hover:text-red-700">
                        <MdDeleteForever size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfficeDashboard;
