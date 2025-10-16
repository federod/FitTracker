import { Handler } from '@netlify/functions';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db, schema } from './utils/db';
import { generateToken, successResponse, errorResponse, corsHeaders } from './utils/auth';

const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email) {
      return errorResponse('Email is required');
    }

    // Check if user exists
    let user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    // If user doesn't exist, create them (registration)
    if (!user) {
      if (!password) {
        return errorResponse('Password is required for registration');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const [newUser] = await db.insert(schema.users).values({
        email,
        password: hashedPassword,
      }).returning();
      user = newUser;

      // Create default profile
      await db.insert(schema.profiles).values({
        userId: user.id,
        weight: 180,
        height: 70,
        age: 30,
        sex: 'male',
      });

      // Create default goals
      await db.insert(schema.goals).values({
        userId: user.id,
        calories: 2600,
        protein: 190,
        carbs: 280,
        fat: 90,
      });

      // Generate JWT token
      const token = generateToken(user.id, user.email!);

      return successResponse({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
        message: 'Account created successfully',
      });
    }

    // User exists - verify password
    if (!password) {
      return errorResponse('Password is required');
    }

    if (!user.password) {
      return errorResponse('Account exists but has no password. Please reset your password.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email!);

    return successResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Login failed', 500);
  }
};

export { handler };
