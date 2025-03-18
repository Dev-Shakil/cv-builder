

'use server';
import path from 'path';
import { promises as fs } from 'fs'; // Use fs.promises for async operations
import connectMongoDB from './mongodb';
import ResumeEntry from '@/Models/ResumeEntry';
import OfficeEntry from '@/Models/OfficeEntry';
import bcrypt from 'bcrypt';
import { revalidatePath } from "next/cache";

export const createFormAction = async (formData) => {
  console.log('Server action: createFormAction function called');
  console.log('Received formData:', Array.from(formData.entries())); // Log formData for debugging

  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log('Connected to MongoDB');

    // Extract scalar fields
    const office = formData.get('office') ? JSON.parse(formData.get('office')) : [];
    const name = formData.get('name') || '';
    const passport_no = formData.get('passport_no') || '';
    const dob = formData.get('dob') || '';
    const position = formData.get('position') || '';
    const salary = parseFloat(formData.get('salary')) || 0;
    const contract = formData.get('contract') || '';
    const religion = formData.get('religion') || '';
    const social_status = formData.get('social_status') || '';
    const passport_expire_date = formData.get('passport_expire_date') || '';
    const place_of_birth = formData.get('place_of_birth') || '';
    const address = formData.get('address') || '';
    const education = formData.get('education') || '';
    const phone_number = formData.get('phone_number') || '';
    const passport_issue_place = formData.get('passport_issue_place') || '';
    const passport_issue_date = formData.get('passport_issue_date') || '';
    const height = parseFloat(formData.get('height')) || 0;
    const weight = parseFloat(formData.get('weight')) || 0;
    const no_of_kids = parseInt(formData.get('no_of_kids'), 10) || 0;
    const nationality = formData.get('nationality') || '';
    const experience = formData.get('experience') || '';
    const refference = formData.get('refference') || '';

    // Handle file uploads
    const picture = formData.get('picture');
    const passport_image = formData.get('passport_image');
    const uploadDir = path.join(process.cwd(), 'uploads');

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const fileUrls = {};

    // Helper function to handle file processing
    const processFile = async (file, key, customName) => {
      if (!file || !file.name) {
        console.warn(`Invalid file for key: ${key}`);
        return null;
      }

      const extension = path.extname(file.name); // Get the file extension
      const safeName = customName.replace(/[^a-zA-Z0-9-_]/g, '_'); // Sanitize name
      const fileName = `${safeName}${extension}`; // Construct the file name
      const filePath = path.join(uploadDir, fileName);
      const publicPath = `/uploads/${fileName}`; // Relative path for frontend use

      // Convert file to Buffer and save it
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      fileUrls[key] = publicPath; // Store relative path instead of absolute path
    };

    // Process files if they exist
    if (picture) {
      await processFile(picture, 'picture', name || 'default_picture');
    }
    if (passport_image) {
      await processFile(passport_image, 'passport_image', passport_no || 'default_passport');
    }

    // Prepare form data to save
    const formDataToSave = {
      office,
      name,
      passport_no,
      dob,
      position,
      salary,
      contract,
      religion,
      social_status,
      passport_expire_date,
      passport_issue_date,
      passport_issue_place,
      phone_number,
      address,
      place_of_birth,
      education,
      height,
      weight,
      no_of_kids,
      nationality,
      experience,
      refference,
      approved_office: "",
      ...fileUrls, // Include file URLs
    };

    console.log('Form data to be saved:', formDataToSave);

    // Create a new entry in the database
    const newEntry = await ResumeEntry.create(formDataToSave);
    const plainEntry = newEntry.toObject();
    revalidatePath("/AdminDashboard" , "/UserDashboard")
    console.log('Form entry created:', plainEntry);

    // Return the created entry
    return plainEntry;
  } catch (error) {
    console.error('Error creating form entry:', error);
    throw new Error('Error creating form entry');
  }
};

export const deleteResume = async (id) => {
  try {
    await connectMongoDB();
    const result = await ResumeEntry.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new Error('No resume entry found to delete');
    }
    revalidatePath("/AdminDashboard","/UserDashboard")
    console.log('Resume entry deleted successfully');
    return { ok: true };
  } catch (error) {
    console.error('Error deleting resume entry:', error);
    throw new Error('Error deleting resume entry');
  }
};

export const editFormAction = async (formData, resumeId) => {
  console.log('Server action: editFormAction function called' + resumeId);
  console.log('Received formData:', Array.from(formData.entries()));

  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log('Connected to MongoDB');

    // Find existing resume by ID
    const existingResume = await ResumeEntry.findById(resumeId);
    if (!existingResume) {
      throw new Error('Resume entry not found');
    }

    // Extract scalar fields
    const updatedData = {
      office: formData.get('office') ? JSON.parse(formData.get('office')) : existingResume.office,
      name: formData.get('name') || existingResume.name,
      passport_no: formData.get('passport_no') || existingResume.passport_no,
      dob: formData.get('dob') || existingResume.dob,
      position: formData.get('position') || existingResume.position,
      salary: parseFloat(formData.get('salary')) || existingResume.salary,
      contract: formData.get('contract') || existingResume.contract,
      religion: formData.get('religion') || existingResume.religion,
      social_status: formData.get('social_status') || existingResume.social_status,
      passport_expire_date: formData.get('passport_expire_date') || existingResume.passport_expire_date,
      passport_issue_place: formData.get('passport_issue_place') || existingResume.passport_issue_place,
      passport_issue_date: formData.get('passport_issue_date') || existingResume.passport_issue_date,
      place_of_birth: formData.get('place_of_birth') || existingResume.place_of_birth,
      address: formData.get('address') || existingResume.address,
      education: formData.get('education') || existingResume.education,
      phone_number: formData.get('phone_number') || existingResume.phone_number,
      height: parseFloat(formData.get('height')) || existingResume.height,
      weight: parseFloat(formData.get('weight')) || existingResume.weight,
      no_of_kids: parseInt(formData.get('no_of_kids'), 10) || existingResume.no_of_kids,
      nationality: formData.get('nationality') || existingResume.nationality,
      experience: formData.get('experience') || existingResume.experience,
      refference: formData.get('refference') || existingResume.refference,
    };

    // Handle file uploads
    const picture = formData.get('picture');
    const passport_image = formData.get('passport_image');
    const uploadDir = path.join(process.cwd(), 'uploads');

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const fileUrls = {};

    // Helper function to process file uploads
    const processFile = async (file, key, customName) => {
      if (!file || !file.name) {
        console.warn(`Invalid file for key: ${key}`);
        return null;
      }

      const extension = path.extname(file.name);
      const safeName = customName.replace(/[^a-zA-Z0-9-_]/g, '_');
      const fileName = `${safeName}${extension}`;
      const filePath = path.join(uploadDir, fileName);
      const publicPath = `/uploads/${fileName}`; // Ensuring consistency with createFormAction

      // Convert file to Buffer and save it
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      fileUrls[key] = publicPath;
    };

    // Process new images if provided
    if (picture) {
      await processFile(picture, 'picture', updatedData.name || 'default_picture');
    }
    if (passport_image) {
      await processFile(passport_image, 'passport_image', updatedData.passport_no || 'default_passport');
    }

    // Merge file URLs into updated data
    const updatedResume = await ResumeEntry.findByIdAndUpdate(
      resumeId,
      { ...updatedData, ...fileUrls },
      { new: true }
    );

    const plainEntry = JSON.parse(JSON.stringify(updatedResume));
    await refreshAdminDashboard();
    // Return the updated entry
    return plainEntry;
  } catch (error) {
    console.error('Error updating form entry:', error);
    throw new Error('Error updating form entry');
  }
};




export const fetchAllResumes = async () => {
  try {
    await connectMongoDB();
    console.log('Connected to MongoDB for fetching resumes');

    const allResumes = await ResumeEntry.find().lean();
    // console.log('All resumes fetched:', allResumes);
    // Transform resumes to ensure they are plain objects
    return allResumes.map((resume) => ({
      ...resume,
      _id: resume._id.toString(), // Convert _id to string
      createdAt: resume.createdAt?.toISOString(), // Convert dates to ISO strings
      updatedAt: resume.updatedAt?.toISOString(),
    }));
    // revalidatePath("/AdminDashboard","/UserDashboard")
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw new Error('Error fetching resumes');
  }
};
export const fetchSingleResume = async (id) => {
  try {
    await connectMongoDB();
    console.log(`Connected to MongoDB for fetching resume with ID: ${id}`);

    // ✅ Ensure ID is valid
    

    const resume = await ResumeEntry.findById(id).lean();

    if (!resume) {
      throw new Error('Resume not found');
    }

    

    return {
      ...resume,
      _id: resume._id.toString(),
      createdAt: resume.createdAt?.toISOString(),
      updatedAt: resume.updatedAt?.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching single resume:', error);
    throw new Error('Error fetching resume');
  }
};

export const fetchAllOffices = async () => {
  try {
    // Ensure MongoDB is connected
    await connectMongoDB();

    // Fetch all offices from the database
    const offices = await OfficeEntry.find().lean();

    // Transform data to make it serializable
    return offices.map((office) => ({
      ...office,
      _id: office._id.toString(),
      createdAt: office.createdAt?.toISOString(),
      updatedAt: office.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching offices:', error);
    throw new Error('Failed to fetch offices');
  }
};




// export const createOffice = async (formData) => {
//   await connectMongoDB();

//   try {
//     const office_name = formData.get('office_name');
//     const office_number = formData.get('office_number');
//     const office_address = formData.get('office_address');
//     const office_email = formData.get('office_email');
//     const office_password = formData.get('office_password');
//     const office_logo = formData.get('office_logo');
//     const role = formData.get('role') || 'user'; // Default to 'user'

//     // Validate role
//     if (!['user', 'admin'].includes(role)) {
//       throw new Error('Invalid role. Must be either "user" or "admin".');
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(office_password, 10); // Salt rounds = 10

//     // Handle logo file if it exists
//     let logoPath = null;
//     if (office_logo && office_logo.name) {
//       const uploadDir = path.join(process.cwd(), 'public/office_logo');

//       // Ensure the directory exists
//       await fs.mkdir(uploadDir, { recursive: true });
//       const extension = path.extname(office_logo.name);
//       const fileName = `${office_name.replace(/[^a-zA-Z0-9-_]/g, '_')}${extension}`;
//       const filePath = path.join(uploadDir, fileName);

//       // Convert ArrayBuffer to Buffer
//       const buffer = Buffer.from(await office_logo.arrayBuffer());
//       await fs.writeFile(filePath, buffer);

//       logoPath = `/office_logo/${fileName}`; // Public URL for the logo
//     }

//     // Save data to the database
//     const newOffice = new OfficeEntry({
//       office_name,
//       office_number,
//       office_address,
//       office_email,
//       office_password: hashedPassword, // Save the hashed password
//       office_logo: logoPath,
//       role, // Save role in the database
//     });

//     await newOffice.save();
//     return { ok: true };
//   } catch (error) {
//     console.error('Error creating office:', error);
//     return { ok: false, error: error.message };
//   }
// };

export const createOffice = async (formData) => {
  await connectMongoDB();

  try {
    const office_name = formData.get('office_name');
    const office_numbers = [];
    // Extract multiple phone numbers from the form data
    for (let i = 0; formData.get(`office_numbers[${i}]`); i++) {
      office_numbers.push(formData.get(`office_numbers[${i}]`));
    }
    const office_address = formData.get('office_address');
    const office_email = formData.get('office_email');
    const office_password = formData.get('office_password');
    const office_logo = formData.get('office_logo');
    const role = formData.get('role') || 'user'; // Default to 'user'

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      throw new Error('Invalid role. Must be either "user" or "admin".');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(office_password, 10); // Salt rounds = 10

    // Handle logo file if it exists
    let logoPath = null;
    if (office_logo && office_logo.name) {
      const uploadDir = path.join(process.cwd(), '/office_logo');

      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      const extension = path.extname(office_logo.name);
      const fileName = `${office_name.replace(/[^a-zA-Z0-9-_]/g, '_')}${extension}`;
      const filePath = path.join(uploadDir, fileName);

      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(await office_logo.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      logoPath = `/office_logo/${fileName}`; // Public URL for the logo
    }

    // Save data to the database
    const newOffice = new OfficeEntry({
      office_name,
      office_number:office_numbers, // Save office numbers as an array
      office_address,
      office_email,
      office_password: hashedPassword, // Save the hashed password
      office_logo: logoPath,
      role, // Save role in the database
    });

    await newOffice.save();
    await refreshAdminDashboard();
    return { ok: true };
  } catch (error) {
    console.error('Error creating office:', error);
    return { ok: false, error: error.message };
  }
};

export async function refreshAdminDashboard() {
  revalidatePath("/AdminDashboard");
  revalidatePath("/UserDashboard");
  revalidatePath("/AdminDashboard/AddEntry");
  revalidatePath("/AdminDashboard/AddUser");
  revalidatePath("/AdminDashboard/EditEntry");
  revalidatePath("/AdminDashboard/Users");
  revalidatePath("/UserDashboard/cv");
}

export const processLogin = async (formData) => {
  await connectMongoDB();

  try {
    const office_email = formData.get("office_email");
    const office_password = formData.get("office_password");

    if (!office_email || !office_password) {
      throw new Error("Email and password are required");
    }

    const user = await OfficeEntry.findOne({ office_email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      office_password,
      user.office_password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return {
      ok: true,
      user: {
        id: user._id,
        office_name: user.office_name,
        role: user.role,
        office_logo:user.office_logo,
        office_number:user.office_number,
        office_email:user.office_email,
      },
    };
  } catch (error) {
    console.error("Error processing login:", error);
    throw new Error(error.message || "Failed to log in");
  }
};
export async function updateUserStatus(id, status,office) {
  if (!id || !status) {
      throw new Error('Invalid parameters');
  }

  await connectMongoDB();
  
  const updatadOffice = ["Approved", "Onhold"].includes(status) ? office : "";
  const result = await ResumeEntry.updateOne({ _id: id }, { $set: { status,approved_office: updatadOffice } });
  
  if (!result.acknowledged) {
      throw new Error('Failed to update status');
  }
  revalidatePath("/AdminDashboard","/UserDashboard");
  return { success: true, status };
}
export async function autoUpdateOnholdStatus() {
  await connectMongoDB();

  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 4);

  const result = await ResumeEntry.updateMany(
    { status: "Onhold", updatedAt: { $lte: twentyFourHoursAgo } },
    { $set: { status: "Pending", approved_office:""} }
  );
  revalidatePath("/AdminDashboard","/UserDashboard")
  console.log(`Updated ${result.modifiedCount} records from "Onhold" to "Pending"`);
}