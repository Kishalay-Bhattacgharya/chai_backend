class APIError extends Error{
    constructor(
        message="something went wrong",//default parameters
        statusCode,
        stack="",
        errors=[]

    ){
        super(message)
        this.statusCode=statusCode
        this.errors=errors
        this.data=null
        this.success=false

        if(stack){
            this.stack=stack
        }
        else
         Error.captureStackTrace(this, this.constructor)
    }
}

export {APIError}