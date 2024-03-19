export const asyncHandler= (requestHandler)=>{
  
   return (req,res,next) =>{

        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }

}




// const asyncHnadler2=(func)=>  async (err,req,res,next)=>{
//     try {
//         await func(req,res,next)

//     } catch (err) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }

