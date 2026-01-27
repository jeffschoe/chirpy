import { describe, it, expect, beforeAll } from "vitest";
import { 
  checkPasswordHash, 
  extractBearerToken, 
  hashPassword, 
  makeJWT, 
  validateJWT 
} from "./auth";
import { BadRequestError, UserNotAuthenticatedError } from "./api/errors";

describe("Password Hashing", () => {
  // everything inside here is about `Password Hashing`
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    // `beforeAll` runs once before any tests in this `describe`
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  // individual test with it(...) and expect(...)
  it("should return true for the correct password", async () => {
    // `string` describes what this single test checks.
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for the incorrect password", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });

  it("should return false when password doesn't match a different hash", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });

  it("should return false for an empty password", async () => {
    const result = await checkPasswordHash("", hash1);
    expect(result).toBe(false);
  });

  it("should return false for an invalid hash", async () => {
    await expect(checkPasswordHash(password1, "invalidhash")).rejects.toThrow();
  });
  /**
   * When you expect an asynchronous function to throw, you need to call 
   * await inside the expect call when using a function that returns a 
   * Promise, and toThrow only works on synchronous functions called inside 
   * a wrapper. 
   * 
   * Since checkPasswordHash is an async function, it returns a Promise. 
   * When that Promise rejects (because an error is thrown), await will 
   * propagate that error.
   * 
   * So, for an asynchronous function that throws an error, you should await 
   * the call to checkPasswordHash directly within the expect block and then 
   * use .rejects.toThrow(). 
   * */

});

describe("JSON Web token (JWT) creation and validation", () => {
  const userID1 = "testuser1";
  const userID2 = "testuser2";
  const expiresIn = 10;
  const secret1 = "secretfortestuser1";
  const secret2 = "secretfortestuser2";
  let token1: string;
  let token2: string;
  let expiredToken: string;

  beforeAll(async () => {
    token1 = makeJWT(userID1, expiresIn, secret1);
    token2 = makeJWT(userID2, expiresIn, secret2);
    expiredToken = makeJWT(userID1, (expiresIn - 20), secret1);
  });

  it("should pass for the proper JWT validation", () => {
    const result = validateJWT(token1, secret1);
    expect(result).toBe(userID1);
  });

  it("should throw for a JWT signed with the wrong secret", () => {
    expect(() => validateJWT(token1, secret2)).toThrow(
      UserNotAuthenticatedError
    );
  });

  it("should throw for an expired JWT token", () => {
    expect(() => validateJWT(expiredToken, secret1)).toThrow(
      UserNotAuthenticatedError
    );
  });

  it("should throw for a malformed token string", () => {
    expect(() => validateJWT("not-a-real-token", secret1)).toThrow(
      UserNotAuthenticatedError
    );
  });

});

describe("extractBearerToken", () => {
  it("should extract the token from a valid header", () => {
    const token = "mySecretToken";
    const header = `Bearer ${token}`;
    expect(extractBearerToken(header)).toBe(token);
  });

  it("should extract the token even if there are extra parts", () => {
    const token = "mySecretToken";
    const header = `Bearer ${token} extra-data`;
    expect(extractBearerToken(header)).toBe(token);
  });

  it("should throw a BadRequestError if the header does not contain at least two parts", () => {
    const header = "Bearer";
    expect(() => extractBearerToken(header)).toThrow(BadRequestError);
  });

  it('should throw a BadRequestError if the header does not start with "Bearer"', () => {
    const header = "Basic mySecretToken";
    expect(() => extractBearerToken(header)).toThrow(BadRequestError);
  });

  it("should throw a BadRequestError if the header is an empty string", () => {
    const header = "";
    expect(() => extractBearerToken(header)).toThrow(BadRequestError);
  });
});