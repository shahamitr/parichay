'use client';

import { useCallback } from 'react';

/**
 * Client-side request signing hook for sensitive mutations.
 *
 * Usage:
 * ```tsx
 * const { signedFetch } = useRequestSigning();
 *
 * const handleDeleteAccount = async () => {
 *   const response = await signedFetch('/api/users/data-deletion', {
 *     method: 'POST',
 *     body: { reason: 'User requested' },
 *   });
 * };
 * ```
 *
 * The hook:
 * 1. Fetches a fresh nonce from /api/auth/nonce
 * 2. Signs the payload with HMAC-SHA256(nonce, sortedJSON)
 * 3. Sends the request with _nonce and _signature fields
 */
export function useRequestSigning() {
  /**
   * Sign and send a request to a sensitive endpoint.
   */
  const signedFetch = useCallback(async (
    url: string,
    options: { method?: string; body?: Record<string, unknown> }
  ): Promise<Response> => {
    const { method = 'POST', body = {} } = options;

    // 1. Get a fresh nonce
    const nonceResponse = await fetch('/api/auth/nonce', {
      credentials: 'include',
    });

    if (!nonceResponse.ok) {
      throw new Error('Failed to get nonce — are you logged in?');
    }

    const { nonce } = await nonceResponse.json();

    // 2. Sign the payload
    const signature = await computeHmac(body, nonce);

    // 3. Send the signed request
    return fetch(url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        _nonce: nonce,
        _signature: signature,
      }),
    });
  }, []);

  return { signedFetch };
}

/**
 * Compute HMAC-SHA256 in the browser using Web Crypto API.
 * Matches the server-side signPayload() algorithm.
 */
async function computeHmac(
  payload: Record<string, unknown>,
  nonce: string
): Promise<string> {
  const sorted = JSON.stringify(payload, Object.keys(payload).sort());
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(nonce),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(sorted)
  );

  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
