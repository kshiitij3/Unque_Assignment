import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
 { name: {
    type: String,
    required: true,
    trim: true,
  },
   email: {
    type: String,
    default:"",
    trim: true,
  },
  phone:{
    type: String,
    default:"",
    trim: true,
  },
  source:{
    type: String,
    enum:["dummy","meta"],
    default:"meta",
  },
    metaLeadId: {
      type: String,
      unique: true,
      sparse: true,
    },
     metaPageId: {
      type: String,
      default: "",
    },
    metaFormId: {
      type: String,
      default: "",
    },
    metaAdId: {
      type: String,
      default: "",
    },
    leadCreatedAt: {
      type: Date,
      default: Date.now,
    },
  },

{ timestamps: true }  );

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
