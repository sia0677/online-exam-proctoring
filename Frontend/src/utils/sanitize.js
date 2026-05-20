import DOMPurify from 'dompurify';

/**
 * SECURITY CHECK: XSS Protection
 * Sanitize untrusted HTML content (like descriptive answers or code snippets)
 * before dangerouslySettingInnerHTML in React.
 */
export const sanitizeHtml = (dirtyHtml) => {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
    ALLOWED_ATTR: ['href']
  });
};
