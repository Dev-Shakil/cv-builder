import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema(
  {
    office: {
      type: [String],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    passport_no: {
      type: String,
      unique: true,
      trim: true,
    },
    dob: {
      type: String,
    },
    position: {
      type: String,
      trim: true,
    },
    salary: {
      type: Number,
      min: 0,
    },
    contract: {
      type: String,
      trim: true,
    },
    religion: {
      type: String,
      trim: true,
    },
    social_status: {
      type: String,
      trim: true,
    },
    picture: {
      type: String, 
    },
    passport_image: {
      type: String, 
    },
    passport_expire_date: {
      type: String,
    },
    height: {
      type: Number,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
    },
    no_of_kids: {
      type: Number,
      min: 0,
    },
    nationality: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    refference: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    approved_office: {
      type: String,
      
    },
  },
  { timestamps: true }
);

// Check if the model already exists before creating it
const ResumeEntry = mongoose?.models?.ResumeEntry || mongoose.model("ResumeEntry", resumeSchema);

export default ResumeEntry;