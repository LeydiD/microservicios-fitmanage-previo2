 //Error para cuando se busque y no se encuentre
 export class NotFoundError extends Error{
    constructor(message){
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    };
 };

 //Error para cuando haya un error por parte del cliente

 export class BadRequestError extends Error{
    constructor(message){
        super(message);
        this.name = "BadRequestError";
        this.statusCode = 400;
    };
 };

 //Error por parte del servidor
 export class InternalServerError extends Error{
    constructor(message){
        super(message);
        this.name = "InternalServerError";
        this.statusCode = 500;
    };
 };

 export class Conflict extends Error{
    constructor(message){
        super(message);
        this.name = "Conflict";
        this.statusCode = 409;
    };
 }
