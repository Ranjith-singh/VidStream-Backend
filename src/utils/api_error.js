class api_error extends Error{
    constructor(
        statusCode,
        message='somethins ewnt wrong',
        errors=[],
        stack=''
    ){
        super(message)
        this.message=message;
        this.statusCode=statusCode;
        this.errors=errors;
        this.Success=false;
        this.data=null;

        if(stack)
        {
            this.stack=stack
        }
        else
        {
            Error.captureStackTrace(this,this.construtor)
        }
    }
}

export {api_error}