// mail/services/news.ts
import { resend, fromEmail, domain } from '../config';
import { getBaseTemplate, loadTemplate } from '../templates/base';

interface Article {
  title: string;
  excerpt: string;
  link: string;
}

interface NewsletterOptions {
  title: string;
  content: string;
  featuredImage?: string;
  imageAlt?: string;
  articles?: Article[];
}

interface ProductUpdateOptions {
  updateTitle: string;
  updateDescription: string;
  updateId: string;
  features?: Array<{
    title: string;
    description: string;
  }>;
}

interface FeaturedContentOptions {
  contentTitle: string;
  contentDescription: string;
  featuredImage: string;
  imageAlt: string;
  contentLink: string;
  badge?: string;
  highlights?: string[];
}

/**
 * Sends a newsletter email to specified recipients
 * @example
 * await sendNewsletter(['subscribers@example.com'], {
 *   title: 'Weekly Newsletter',
 *   content: 'Here are this week\'s highlights...',
 *   featuredImage: 'https://example.com/image.jpg',
 *   imageAlt: 'Featured Image',
 *   articles: [
 *     {
 *       title: 'New Feature Release',
 *       excerpt: 'Check out our latest features...',
 *       link: 'https://example.com/article1'
 *     }
 *   ]
 * });
 */
export const sendNewsletter = async (recipients: string[], options: NewsletterOptions) => {
  try {
    const template = loadTemplate('news/newsletter.html');
    const html = getBaseTemplate(template, {
      ...options,
      domain,
      articles: options.articles ? JSON.stringify(options.articles) : '[]'
    });
    
    const mail = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: options.title,
      html,
    });
    
    return mail;
  } catch (error) {
    console.error('Failed to send newsletter:', error);
    throw error;
  }
};

/**
 * Sends a product update email to specified recipients
 * @example
 * await sendProductUpdate(['users@example.com'], {
 *   updateTitle: 'New Dashboard Features',
 *   updateDescription: 'We\'ve added new analytics capabilities...',
 *   updateId: 'v2-1-0',
 *   features: [
 *     {
 *       title: 'Advanced Analytics',
 *       description: 'Track your performance in real-time'
 *     }
 *   ]
 * });
 */
export const sendProductUpdate = async (recipients: string[], options: ProductUpdateOptions) => {
  try {
    const template = loadTemplate('news/product-update.html');
    const html = getBaseTemplate(template, {
      ...options,
      domain,
      features: JSON.stringify(options.features)
    });
    
    const mail = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: `New Update: ${options.updateTitle}`,
      html,
    });
    
    return mail;
  } catch (error) {
    console.error('Failed to send product update:', error);
    throw error;
  }
};

/**
 * Sends a featured content email to specified recipients.
 * @param recipients - An array of email addresses to send the email to.
 * @param options - An object containing the options for the featured content email, including the content title, highlights, and domain.
 * @returns A promise that resolves to the email object returned by the email service.
 * @example
 * await sendFeaturedContent(['users@example.com'], {
 *   contentTitle: 'New Product Features',
 *   highlights: [
 *     {
 *       title: 'Advanced Analytics',
 *       description: 'Track your performance in real-time'
 *     }
 *   ],
 *   domain: 'example.com'
 * });
 */
export const sendFeaturedContent = async (recipients: string[], options: FeaturedContentOptions) => {
  try {
    const template = loadTemplate('news/featured-content.html');
    const html = getBaseTemplate(template, {
      ...options,
      domain,
      highlights: options.highlights ? JSON.stringify(options.highlights) : '[]'
    });
    
    const mail = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: `Featured: ${options.contentTitle}`,
      html,
    });
    
    return mail;
  } catch (error) {
    console.error('Failed to send featured content:', error);
    throw error;
  }
}
