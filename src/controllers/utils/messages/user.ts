enum ErrorForUser {
  ALREADY_REGISTERED = 'That user is already registered',
  NOT_FOUND = 'The requested user does not exists'
}

enum MessageForUser {
  REGISTRATION_SUCCESS = 'The users was successfully registered in the database'
}

export { ErrorForUser as EFU, MessageForUser as MFU }
