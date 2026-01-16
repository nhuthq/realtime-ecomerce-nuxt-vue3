import { defineEventHandler } from 'h3';
import { authGuard } from '../middleware/auth.guard';

export function withAuth(handler: Parameters<typeof defineEventHandler>[0]) {
  return defineEventHandler(async (event) => {
    await authGuard(event)
    return handler(event)
  })
}
