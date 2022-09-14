const catchAsyncError = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
};

module.exports = catchAsyncError;
/*
const cat = (func) =>{
    return (req, res, next)=>{
        Promise.resolve(func(req,res,next)).catch(next);
    }
}

*/
