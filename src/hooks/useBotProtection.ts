'use client';

import { useState, useRef, useCallback } from 'react';

/**
 * Client-side bot protection hook for forms.
 *
 * Provides:
 * - Honeypot field value + setter (render a hidden field)
 * - Form load timestamp (sent with submission for server-side timing check)
 * - Client-side validation before submit
 * - Hidden field props for easy JSX rendering
 *
 * @example
 * ```tsx
 * const { honeypotProps, getFormMeta, validateBeforeSubmit } = useBotProtection();
 *
 * const handleSubmit = (e) => {
 *   e.preventDefault();
 *   if (!validateBeforeSubmit()) return; // Silently blocks bots
 *   const payload = { ...formData, ...getFormMeta() };
 *   fetch('/api/endpoint', { body: JSON.stringify(payload) });
 * };
 *
 * return (
 *   <form onSubmit={handleSubmit}>
 *     {/* Visible fields *\/}
 *     <HoneypotField {...honeypotProps} />
 *     <button type="submit">Send</button>
 *   </form>
 * );
 * ```
 */
export function useBotProtection(fieldName = 'website_url') {
  const [honeypot, setHoneypot] = useState('');
  const formLoadedAt = useRef(Date.now());

  /**
   * Returns metadata to include in the form submission body.
   * Server uses this for timing validation.
   */
  const getFormMeta = useCallback(() => ({
    _form_loaded_at: formLoadedAt.current,
    [fieldName]: honeypot,
  }), [honeypot, fieldName]);

  /**
   * Client-side pre-submit check. Returns false if bot detected.
   * Call this before submitting — if false, silently fake success.
   */
  const validateBeforeSubmit = useCallback((): boolean => {
    // Honeypot filled = bot
    if (honeypot) return false;
    // Submitted in under 2 seconds = bot
    if (Date.now() - formLoadedAt.current < 2000) return false;
    return true;
  }, [honeypot]);

  /**
   * Props to spread on the hidden honeypot input element.
   */
  const honeypotProps = {
    name: fieldName,
    value: honeypot,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setHoneypot(e.target.value),
    autoComplete: 'off',
    tabIndex: -1,
    'aria-hidden': true as const,
  };

  return {
    honeypot,
    honeypotProps,
    getFormMeta,
    validateBeforeSubmit,
    formLoadedAt: formLoadedAt.current,
  };
}
