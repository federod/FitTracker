import { Handler } from '@netlify/functions';
import { eq, and, desc } from 'drizzle-orm';
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

    // GET - Fetch weight history
    if (event.httpMethod === 'GET') {
      const history = await db.query.weightHistory.findMany({
        where: eq(schema.weightHistory.userId, auth.userId),
        orderBy: [desc(schema.weightHistory.date)],
        limit: 100, // Last 100 entries
      });

      return successResponse({ history });
    }

    // POST - Add weight entry
    if (event.httpMethod === 'POST') {
      const { date, weight } = JSON.parse(event.body || '{}');

      if (!date || !weight) {
        return errorResponse('Date and weight are required');
      }

      // Check if entry exists for this date
      const existingEntry = await db.query.weightHistory.findFirst({
        where: and(
          eq(schema.weightHistory.userId, auth.userId),
          eq(schema.weightHistory.date, date)
        ),
      });

      let entry;
      if (existingEntry) {
        // Update existing entry
        [entry] = await db
          .update(schema.weightHistory)
          .set({ weight })
          .where(eq(schema.weightHistory.id, existingEntry.id))
          .returning();
      } else {
        // Create new entry
        [entry] = await db
          .insert(schema.weightHistory)
          .values({
            userId: auth.userId,
            date,
            weight,
          })
          .returning();
      }

      return successResponse({ entry });
    }

    return errorResponse('Method not allowed', 405);
  } catch (error) {
    console.error('Weight history error:', error);
    if (error instanceof Error && error.message.includes('token')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Failed to process request', 500);
  }
};

export { handler };
