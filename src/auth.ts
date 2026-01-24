import argon2 from 'argon2';


export async function hashPassword(password: string): Promise<string> {
  // Hash the password using the argon2.hash function
  return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  // Use the argon2.verify function to compare the password in the 
  // HTTP request with the password that is stored in the database.
  return argon2.verify(hash, password);  
}