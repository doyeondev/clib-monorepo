export const EMAIL_REGEX_VALIDATION = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/

//Minimum eight characters, at least one letter, one number and one special character:
export const PASSWORD_REGEX_VALIDATION = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
export const PHONE_REGEX_VALIDATION = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
