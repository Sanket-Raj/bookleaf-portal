import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { config } from '../config/env';
import { JWTPayload, UserSession, UserRole } from '../types/auth';

export class AuthService {
  /**
   * Registers a new user inside the database after validating uniqueness
   */
  static async register(email: string, passwordPlain: string, fullName: string, role: UserRole = 'reader'): Promise<UserSession> {
    // Prevent duplicate account footprints
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('Email is already registered.');
    }

    // Securely salt and hash the plaintext password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(passwordPlain, saltRounds);

    const result = await db.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, created_at`,
      [email, passwordHash, fullName, role]
    );

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      createdAt: user.created_at,
    };
  }

  /**
   * Authenticates a user and issues a valid JWT access token
   */
  static async login(email: string, passwordPlain: string): Promise<{ token: string; user: UserSession }> {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    // Compare raw input text against stored hash signatures safely
    const isMatch = await bcrypt.compare(passwordPlain, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        createdAt: user.created_at,
      },
    };
  }

  /**
   * Retrieves profile information for an authenticated user context
   */
  static async getUserById(userId: string): Promise<UserSession> {
    const result = await db.query('SELECT id, email, full_name, role, created_at FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('User context could not be located.');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      createdAt: user.created_at,
    };
  }
}