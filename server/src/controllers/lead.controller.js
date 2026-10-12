import Lead from "../models/Lead.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";;
import ApiError from "../utils/ApiError.js";
import { getIO } from "../config/socket.js";
import { HTTP_STATUS,
        API_MESSAGES,
} from "../constants.js/index.js";


export const getLeads = AsyncHandler(async (req,res) =>{
  const leads  = await Lead.find()
         .sort({createdAt: -1})
         .lean();
    return res
           .status(HTTP_STATUS.OK)
           .json(
            new ApiResponse(
              HTTP_STATUS.OK,
              leads,
              API_MESSAGES.LEADS_FETCHED
            )
           );
});

export const createDummyLead = AsyncHandler(
  async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name?.trim()) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Name is required"
      );
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email?.trim() || "",
      phone: phone?.trim() || "",
      source: "dummy",
    });
    getIO().emit("lead:new", lead);
    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          lead,
          API_MESSAGES.DUMMY_LEAD_CREATED
        )
      );
  }
);

