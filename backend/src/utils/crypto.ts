import argon2 from "argon2";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

export async function hashPassword(data: string) {
  return await argon2.hash(data);
}

export async function validateHashPassword(plain: string, hashed: string) {
  return await argon2.verify(hashed, plain);
}

export async function hashOTP(plain: string) {
  return await bcrypt.hash(plain, 5);
}

export async function validateHashOTP(plain: string, hashed: string) {
  return await bcrypt.compare(plain, hashed);
}

export function hashToken(plain: string) {
  return crypto.createHash("sha256").update(plain).digest("hex");
}

export function validateHashToken(plain: string, hashed: string) {
  const hashedToken = hashToken(plain);
  return hashedToken === hashed;
}

export function generateOTP(length: number = 6) {
  const actualLength = length - 1;
  const min = 10 ** actualLength;
  const max = 10 ** (actualLength + 1);

  return crypto.randomInt(min, max).toString();
}

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function generateUUID() {
  return crypto.randomUUID();
}