export class BusinessError {
    static readonly NOT_FOUND = 'NOT_FOUND';
    static readonly PRECONDITION_FAILED = 'PRECONDITION_FAILED';
    static readonly BAD_REQUEST = 'BAD_REQUEST';
  
    constructor(public type: string, public message: string) {}
  }
  