// 'use server'
// import path from 'path';
// import fs from 'fs';
// import connectMongoDB from './mongodb';
// import ResumeEntry from '@/Models/ResumeEntry';
// import OfficeEntry from '@/Models/OfficeEntry';

// export const createFormAction = async (formData) => {
//   console.log('Server action: createFormAction function called');
//   console.log('Received formData:', formData);

//   try {
//     // Connect to MongoDB
//     await connectMongoDB();
//     console.log('Connected to MongoDB');

//     // Extract scalar fields
//     const name = formData.get('name');
//     const passport_no = formData.get('passport_no');
//     const dob = formData.get('dob');
//     const position = formData.get('position');
//     const salary = parseFloat(formData.get('salary'));
//     const contract = formData.get('contract');
//     const religion = formData.get('religion');
//     const social_status = formData.get('social_status');
//     const passport_expire_date = formData.get('passport_expire_date');
//     const height = parseFloat(formData.get('height'));
//     const weight = parseFloat(formData.get('weight'));
//     const no_of_kids = parseInt(formData.get('no_of_kids'), 10);
//     const nationality = formData.get('nationality');
//     const experience = formData.get('experience');
//     const refference = formData.get('refference');

//     // Handle file uploads
//     const picture = formData.get('picture');
//     const passport_image = formData.get('passport_image');
//     const uploadDir = path.join(process.cwd(), 'public', 'uploads');

//     // Ensure the upload directory exists
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const fileUrls = {};

//     const processFile = async (file, key) => {
//       const fileName = `${Date.now()}-${file.name}`;
//       const filePath = path.join(uploadDir, fileName);

//       // Convert file to Buffer and save it
//       const buffer = Buffer.from(await file.arrayBuffer());
//       await fs.promises.writeFile(filePath, buffer);

//       fileUrls[key] = `/uploads/${fileName}`;
//     };

//     if (picture) {
//       await processFile(picture, 'picture');
//     }
//     if (passport_image) {
//       await processFile(passport_image, 'passport_image');
//     }

//     // Prepare form data to save
//     const formDataToSave = {
//       name,
//       passport_no,
//       dob,
//       position,
//       salary,
//       contract,
//       religion,
//       social_status,
//       passport_expire_date,
//       height,
//       weight,
//       no_of_kids,
//       nationality,
//       experience,
//       refference,
//       ...fileUrls,
//     };

//     console.log('Form data to be saved:', formDataToSave);

//     // Create a new entry in the database
//     const newEntry = await ResumeEntry.create(formDataToSave);
//     const plainEntry = newEntry.toObject();
//     console.log('Form entry created:', plainEntry);

//     // Return the created entry
//     return plainEntry;
//   } catch (error) {
//     console.error('Error creating form entry:', error);
//     throw new Error('Error creating form entry');
//   }
// };

'use server';
import path from 'path';
import { promises as fs } from 'fs'; // Use fs.promises for async operations
import connectMongoDB from './mongodb';
import ResumeEntry from '@/Models/ResumeEntry';
import OfficeEntry from '@/Models/OfficeEntry';
import bcrypt from 'bcrypt';

export const createFormAction = async (formData) => {
  console.log('Server action: createFormAction function called');
  console.log('Received formData:', Array.from(formData.entries())); // Log formData for debugging

  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log('Connected to MongoDB');

    // Extract scalar fields
    const office = formData.get('office') ? JSON.parse(formData.get('office')) : []; // Fallback to an empty array
    const name = formData.get('name') || '';
    const passport_no = formData.get('passport_no') || '';
    const dob = formData.get('dob') || '';
    const position = formData.get('position') || '';
    const salary = parseFloat(formData.get('salary')) || 0;
    const contract = formData.get('contract') || '';
    const religion = formData.get('religion') || '';
    const social_status = formData.get('social_status') || '';
    const passport_expire_date = formData.get('passport_expire_date') || '';
    const height = parseFloat(formData.get('height')) || 0;
    const weight = parseFloat(formData.get('weight')) || 0;
    const no_of_kids = parseInt(formData.get('no_of_kids'), 10) || 0;
    const nationality = formData.get('nationality') || '';
    const experience = formData.get('experience') || '';
    const refference = formData.get('refference') || '';

    // Handle file uploads
    const picture = formData.get('picture');
    const passport_image = formData.get('passport_image');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const fileUrls = {};

    // Helper function to handle file processing
    const processFile = async (file, key, customName) => {
      if (!file || typeof file.name !== 'string') {
        console.warn(`Invalid file for key: ${key}`);
        return;
      }

      const extension = path.extname(file.name); // Get the file extension
      const safeName = customName.replace(/[^a-zA-Z0-9-_]/g, '_'); // Sanitize name
      const fileName = `${safeName}${extension}`; // Construct the file name
      const filePath = path.join(uploadDir, fileName);

      // Convert file to Buffer and save it
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      fileUrls[key] = `/uploads/${fileName}`;
    };

    // Process files if they exist
    if (picture) {
      await processFile(picture, 'picture', name || 'default_picture'); // Use 'name' or fallback
    }
    if (passport_image) {
      await processFile(passport_image, 'passport_image', passport_no || 'default_passport'); // Use 'passport_no' or fallback
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
      height,
      weight,
      no_of_kids,
      nationality,
      experience,
      refference,
      approved_office:"",
      ...fileUrls,
    };

    console.log('Form data to be saved:', formDataToSave);

    // Create a new entry in the database
    const newEntry = await ResumeEntry.create(formDataToSave);
    const plainEntry = newEntry.toObject();
    console.log('Form entry created:', plainEntry);

    // Return the created entry
    return plainEntry;
  } catch (error) {
    console.error('Error creating form entry:', error);
    throw new Error('Error creating form entry');
  }
};

export const fetchAllResumes = async () => {
  try {
    await connectMongoDB();
    console.log('Connected to MongoDB for fetching resumes');

    const allResumes = await ResumeEntry.find().lean();
    console.log('All resumes fetched:', allResumes);

    // Transform resumes to ensure they are plain objects
    return allResumes.map((resume) => ({
      ...resume,
      _id: resume._id.toString(), // Convert _id to string
      createdAt: resume.createdAt?.toISOString(), // Convert dates to ISO strings
      updatedAt: resume.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw new Error('Error fetching resumes');
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
//       office_password,
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
    const office_number = formData.get('office_number');
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
      const uploadDir = path.join(process.cwd(), 'public/office_logo');

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
      office_number,
      office_address,
      office_email,
      office_password: hashedPassword, // Save the hashed password
      office_logo: logoPath,
      role, // Save role in the database
    });

    await newOffice.save();
    return { ok: true };
  } catch (error) {
    console.error('Error creating office:', error);
    return { ok: false, error: error.message };
  }
};

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
  
  const updatadOffice = status === "Approved" ? office : "";
  const result = await ResumeEntry.updateOne({ _id: id }, { $set: { status,approved_office: updatadOffice } });

  if (!result.acknowledged) {
      throw new Error('Failed to update status');
  }

  return { success: true, status };
}