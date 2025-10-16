import { Handler } from '@netlify/functions';
import { eq, and } from 'drizzle-orm';
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

    // GET - Fetch daily log for a specific date
    if (event.httpMethod === 'GET') {
      const date = event.queryStringParameters?.date;

      if (!date) {
        return errorResponse('Date parameter is required');
      }

      const log = await db.query.dailyLogs.findFirst({
        where: and(
          eq(schema.dailyLogs.userId, auth.userId),
          eq(schema.dailyLogs.date, date)
        ),
      });

      return successResponse({
        log: log || null,
      });
    }

    // POST - Create or update daily log
    if (event.httpMethod === 'POST') {
      const { date, meals, workouts, notes } = JSON.parse(event.body || '{}');

      if (!date) {
        return errorResponse('Date is required');
      }

      // Check if log exists for this date
      const existingLog = await db.query.dailyLogs.findFirst({
        where: and(
          eq(schema.dailyLogs.userId, auth.userId),
          eq(schema.dailyLogs.date, date)
        ),
      });

      let log;
      if (existingLog) {
        // Update existing log
        [log] = await db
          .update(schema.dailyLogs)
          .set({
            meals: meals || existingLog.meals,
            workouts: workouts || existingLog.workouts,
            notes: notes !== undefined ? notes : existingLog.notes,
            updatedAt: new Date(),
          })
          .where(eq(schema.dailyLogs.id, existingLog.id))
          .returning();
      } else {
        // Create new log
        [log] = await db
          .insert(schema.dailyLogs)
          .values({
            userId: auth.userId,
            date,
            meals: meals || { breakfast: [], lunch: [], dinner: [], snacks: [] },
            workouts: workouts || [],
            notes: notes || null,
          })
          .returning();
      }

      return successResponse({ log });
    }

    // DELETE - Delete a daily log
    if (event.httpMethod === 'DELETE') {
      const date = event.queryStringParameters?.date;

      if (!date) {
        return errorResponse('Date parameter is required');
      }

      await db
        .delete(schema.dailyLogs)
        .where(
          and(
            eq(schema.dailyLogs.userId, auth.userId),
            eq(schema.dailyLogs.date, date)
          )
        );

      return successResponse({ message: 'Log deleted successfully' });
    }

    return errorResponse('Method not allowed', 405);
  } catch (error) {
    console.error('Daily logs error:', error);
    if (error instanceof Error && error.message.includes('token')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Failed to process request', 500);
  }
};

export { handler };
