import { Handler } from '@netlify/functions';
import { eq } from 'drizzle-orm';
import { db, schema } from './utils/db';
import { requireAuth, successResponse, errorResponse, corsHeaders } from './utils/auth';

const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: '',
    };
  }

  try {
    const auth = requireAuth(event);

    // GET - Fetch user profile and goals
    if (event.httpMethod === 'GET') {
      const profile = await db.query.profiles.findFirst({
        where: eq(schema.profiles.userId, auth.userId),
      });

      const goals = await db.query.goals.findFirst({
        where: eq(schema.goals.userId, auth.userId),
      });

      return successResponse({
        profile: profile || null,
        goals: goals || null,
      });
    }

    // PUT - Update user profile and/or goals
    if (event.httpMethod === 'PUT') {
      const { profile: profileData, goals: goalsData } = JSON.parse(event.body || '{}');

      let updatedProfile = null;
      let updatedGoals = null;

      // Update profile if provided
      if (profileData) {
        const existingProfile = await db.query.profiles.findFirst({
          where: eq(schema.profiles.userId, auth.userId),
        });

        if (existingProfile) {
          [updatedProfile] = await db
            .update(schema.profiles)
            .set({
              ...profileData,
              updatedAt: new Date(),
            })
            .where(eq(schema.profiles.userId, auth.userId))
            .returning();
        } else {
          [updatedProfile] = await db
            .insert(schema.profiles)
            .values({
              userId: auth.userId,
              ...profileData,
            })
            .returning();
        }
      }

      // Update goals if provided
      if (goalsData) {
        const existingGoals = await db.query.goals.findFirst({
          where: eq(schema.goals.userId, auth.userId),
        });

        if (existingGoals) {
          [updatedGoals] = await db
            .update(schema.goals)
            .set({
              ...goalsData,
              updatedAt: new Date(),
            })
            .where(eq(schema.goals.userId, auth.userId))
            .returning();
        } else {
          [updatedGoals] = await db
            .insert(schema.goals)
            .values({
              userId: auth.userId,
              ...goalsData,
            })
            .returning();
        }
      }

      return successResponse({
        profile: updatedProfile,
        goals: updatedGoals,
      });
    }

    return errorResponse('Method not allowed', 405);
  } catch (error) {
    console.error('Profile error:', error);
    if (error instanceof Error && error.message.includes('token')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Failed to process request', 500);
  }
};

export { handler };
