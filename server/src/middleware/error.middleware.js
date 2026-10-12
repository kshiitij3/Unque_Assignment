const  errorHandler = (err,req,res,next)=>{
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];
//db duplicate key
  if(err.code === 11000){
    statusCode = 409;
    message = "A record with this value is already exists";

  }

  //mongoose validation error
  if(err.name === "ValidationError"){
    statusCode = 400;
    message = "Database validation failed";
    errors = Object.values(err.errors).map((item)=>({
      field: item.path,
      message: item.message,
    }));
  }


//invalid db objectId

if(err.name ==="CastError"){
  statusCode = 400;
  message = "invalid resource identifier";
}
if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
});
};


export default errorHandler;