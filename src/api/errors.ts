export class BadRequestError extends Error { //400
  constructor(message: string) {
    super(message);
  }
}

export class UserNotAuthenticatedError extends Error { //401
  constructor(message: string) {
    super(message);
  }
}

export class UserForbiddenError extends Error { //403
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error { //404
  constructor(message: string) {
    super(message);
  }
}