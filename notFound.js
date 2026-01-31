export const notFound=(req, res)=>{
    res.status(404).json({message:"Request not found"});
};