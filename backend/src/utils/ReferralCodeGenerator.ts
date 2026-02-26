import { randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';

/**
 * Generates unique referral codes for users
 * Uses cryptographically secure random generation
 * Excludes ambiguous characters (0, O, I, l) for better readability
 */
export class ReferralCodeGenerator {
  // Character set excluding ambiguous characters
  private static readonly ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  private static readonly MIN_LENGTH = 6;
  private static readonly MAX_LENGTH = 12;
  private static readonly DEFAULT_LENGTH = 8;
  private static readonly MAX_COLLISION_ATTEMPTS = 10;

  /**
   * Generate a random referral code of specified length
   * @param length - Length of the code (6-12 characters)
   * @returns Alphanumeric referral code
   * @throws Error if length is out of valid range
   */
  static generate(length: number = this.DEFAULT_LENGTH): string {
    if (length < this.MIN_LENGTH || length > this.MAX_LENGTH) {
      throw new Error(
        `Code length must be between ${this.MIN_LENGTH} and ${this.MAX_LENGTH} characters`
      );
    }

    const bytes = randomBytes(length);
    let code = '';

    for (let i = 0; i < length; i++) {
      code += this.ALPHABET[bytes[i] % this.ALPHABET.length];
    }

    return code;
  }

  /**
   * Generate a unique referral code that doesn't exist in the database
   * @param prisma - Prisma client instance
   * @param length - Desired code length (default: 8)
   * @returns Unique referral code
   * @throws Error if unable to generate unique code after max attempts
   */
  static async generateUnique(
    prisma: PrismaClient,
    length: number = this.DEFAULT_LENGTH
  ): Promise<string> {
    let attempts = 0;

    while (attempts < this.MAX_COLLISION_ATTEMPTS) {
      const code = this.generate(length);

      // Check if code already exists
      const existing = await prisma.referralCode.findUnique({
        where: { code },
      });

      if (!existing) {
        return code;
      }

      attempts++;
    }

    // If we hit max attempts with default length, try with longer code
    if (length < this.MAX_LENGTH) {
      return this.generateUnique(prisma, length + 2);
    }

    throw new Error(
      `Failed to generate unique referral code after ${this.MAX_COLLISION_ATTEMPTS} attempts`
    );
  }

  /**
   * Validate referral code format
   * @param code - Code to validate
   * @returns true if code format is valid
   */
  static isValidFormat(code: string): boolean {
    if (code.length < this.MIN_LENGTH || code.length > this.MAX_LENGTH) {
      return false;
    }

    // Check if all characters are in the allowed alphabet
    return code.split('').every((char) => this.ALPHABET.includes(char));
  }
}
