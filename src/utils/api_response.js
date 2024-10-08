class api_response{
    constructor(
        statusCode,data,message='Success'
    ){
        this.statusCode=statusCode,
        this.message=message,
        this.data=data,
        this.success=statusCode < 400
    }
}

export {api_response}