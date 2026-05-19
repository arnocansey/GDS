type AttemptRecord = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, AttemptRecord>();

export function checkRateLimit(key: string, limit = 5, windowMs = 1000 * 60 * 10) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || record.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  record.count += 1;
  attempts.set(key, record);

  return {
    allowed: record.count <= limit,
    retryAfter: Math.max(0, Math.ceil((record.resetAt - now) / 1000)),
  };
}

export function clearRateLimit(key: string) {
  attempts.delete(key);
}
