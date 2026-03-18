/**
 * SWR fetcher that throws on HTTP errors instead of returning error objects as data.
 * This prevents components from crashing when APIs return 401/500 and the response
 * gets treated as valid data.
 */
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('API request failed');
    (error as Error & { status: number }).status = res.status;
    throw error;
  }
  return res.json();
};
