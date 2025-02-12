// mail/services/alerts.ts
import { OrderStatus, ProductPurchaseStatus } from "@prisma/client";
import { resend, fromEmail, domain } from "../config";
import {
  compileTemplate,
  getBaseTemplate,
  loadTemplate,
} from "../templates/base";

interface SecurityAlertOptions {
  alertType:
    | "suspicious_activity"
    | "login_attempt"
    | "password_changed"
    | "device_added";
  timestamp: string;
  location?: string;
  deviceInfo?: string;
  ipAddress?: string;
  actionRequired?: boolean;
}

interface OrderAlertOptions {
  orderId: string;
  status: OrderStatus;
  finalPrice: number;
  totalPrice: number;
  totalDiscount: number;
  totalShippingPrice: number;
  productPurchases: Array<{
    id: string;
    status: ProductPurchaseStatus;
    finalPrice: number;
    variantId: string | null;
  }>;
  updatedAt: Date;
}

interface NotificationAlertOptions {
  title: string;
  description: string;
  emittedAt: Date | null;
  roleName: string;
}

interface PaymentAlertOptions {
  alertType: "payment_failed" | "payment_success" | "subscription_expiring";
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  errorCode?: string;
  nextAttempt?: string;
  daysUntilExpiry?: number;
}

interface SystemAlertOptions {
  alertType: "system_outage" | "maintenance" | "performance_degradation";
  severity: "critical" | "warning" | "info";
  affectedServices: string[];
  startTime: string;
  estimatedResolution?: string;
  statusPageUrl?: string;
}

/**
 * Sends a security-related alert email
 * @example
 * // Send a security alert
 * await sendSecurityAlert('user@example.com', {
 *   alertType: 'suspicious_activity',
 *   timestamp: new Date().toISOString(),
 *   location: 'Moscow, Russia',
 *   ipAddress: '203.0.113.0',
 *   actionRequired: true
 * });
 */
export const sendSecurityAlert = async (
  recipient: string,
  options: SecurityAlertOptions
) => {
  try {
    console.log("Sending security alert to:", recipient);
    console.log("Security alert options:", options);

    console.log("Loaded template");
    const data = compileTemplate("alerts/security-alert.html", {
      ...options,
      domain,
      timestamp: new Date(options.timestamp).toLocaleString(),
      actionRequired: options.actionRequired?.toString() || "",
    });
    const html = getBaseTemplate(data);

    console.log("Generated HTML template");

    const subjectMap: Record<SecurityAlertOptions["alertType"], string> = {
      suspicious_activity: "Suspicious Activity Detected",
      login_attempt: "New Login Attempt",
      password_changed: "Password Changed",
      device_added: "New Device Added",
    };

    console.log("Sending email with subject:", subjectMap[options.alertType]);
    const mail = await resend.emails.send({
      from: fromEmail,
      to: recipient,
      subject: `Security Alert: ${subjectMap[options.alertType]}`,
      html,
    });
    console.log("Email sent successfully:", mail);

    return mail;
  } catch (error) {
    console.error("Failed to send security alert:", error);
    console.error("Error details:", {
      recipient,
      options,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
};

/**
 * Sends a payment-related alert email
 * @example
 * // Send a payment alert
 * await sendPaymentAlert('user@example.com', {
 *   alertType: 'payment_failed',
 *   amount: 29.99,
 *   currency: 'USD',
 *   errorCode: 'CARD_DECLINED',
 *   nextAttempt: '2024-11-20'
 * });
 */
export const sendPaymentAlert = async (
  recipient: string,
  options: PaymentAlertOptions
) => {
  try {
    console.log("Sending payment alert to:", recipient);
    console.log("Payment alert options:", options);

    console.log("Loaded template");

    const data = compileTemplate("alerts/payment-alert.html", {
      ...options,
      domain,
      amount: options.amount?.toFixed(2) || "0",
      daysUntilExpiry: options.daysUntilExpiry?.toString() || "",
    });
    const html = getBaseTemplate(data);

    console.log("Generated HTML template");

    const subjectMap: Record<PaymentAlertOptions["alertType"], string> = {
      payment_failed: "Payment Failed",
      payment_success: "Payment Successful",
      subscription_expiring: "Subscription Expiring Soon",
    };

    console.log("Sending email with subject:", subjectMap[options.alertType]);
    const mail = await resend.emails.send({
      from: fromEmail,
      to: recipient,
      subject: subjectMap[options.alertType],
      html,
    });
    console.log("Email sent successfully:", mail);

    return mail;
  } catch (error) {
    console.error("Failed to send payment alert:", error);
    console.error("Error details:", {
      recipient,
      options,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
};

/**
 * Sends a system-related alert email
 * @example
 * // Send a system alert
 * await sendSystemAlert(['admin@example.com'], {
 *   alertType: 'system_outage',
 *   severity: 'critical',
 *   affectedServices: ['API', 'Database', 'Auth Service'],
 *   startTime: new Date().toISOString(),
 *   estimatedResolution: '2 hours',
 *   statusPageUrl: 'https://status.example.com'
 * });
 */
export const sendSystemAlert = async (
  recipients: string[],
  options: SystemAlertOptions
) => {
  try {
    console.log("Sending system alert to:", recipients);
    console.log("System alert options:", options);

    console.log("Loaded template");

    const data = compileTemplate("alerts/system-alert.html", {
      ...options,
      domain,
    });

    const html = getBaseTemplate(data);
    console.log("Generated HTML template");

    const severityEmoji = {
      critical: "🔴",
      warning: "🟡",
      info: "🔵",
    };

    const subject = `${
      severityEmoji[options.severity]
    } System Alert: ${options.alertType.replace("_", " ")}`;
    console.log("Sending email with subject:", subject);

    const mail = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject,
      html,
    });
    console.log("Email sent successfully:", mail);

    return mail;
  } catch (error) {
    console.error("Failed to send system alert:", error);
    console.error("Error details:", {
      recipients,
      options,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
};

export const sendOrderStatusAlert = async (
  recipient: string,
  options: OrderAlertOptions
) => {
  try {
    console.log("Sending order status alert to:", recipient);
    console.log("Order status alert options:", options);

    const data = compileTemplate("alerts/order-status-alert.html", {
      ...options,
      domain,

      finalPrice: options.finalPrice.toFixed(2),
      totalPrice: options.totalPrice.toFixed(2),
      totalDiscount: options.totalDiscount.toFixed(2),
      totalShippingPrice: options.totalShippingPrice.toFixed(2),
      updatedAt: options.updatedAt.toLocaleString(),
      productPurchases: options.productPurchases.map((purchase) => ({
        ...purchase,
        finalPrice: purchase.finalPrice.toFixed(2),
      })),
    });

    const html = getBaseTemplate(data);

    console.log("Generated HTML template");

    const statusMap: Record<string, string> = {
      PENDING: "Order Pending",
      CONFIRMED: "Order Confirmed",
      PROCESSING: "Order Processing",
      SHIPPED: "Order Shipped",
      DELIVERED: "Order Delivered",
      CANCELLED: "Order Cancelled",
      REFUNDED: "Order Refunded",
    };

    const subject = `Order Status Update: ${
      statusMap[options.status] || options.status
    } - Order #${options.orderId}`;
    console.log("Sending email with subject:", subject);

    const mail = await resend.emails.send({
      from: fromEmail,

      to: recipient,
      subject,
      html,
    });
    console.log("Email sent successfully:", mail);

    return mail;
  } catch (error) {
    console.error("Failed to send order status alert:", error);
    console.error("Error details:", {
      recipient,
      options,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
};

export const sendNotificationAlert = async (
  recipients: string[],
  options: NotificationAlertOptions
) => {
  try {
    console.log("Preparing to send order status alert to:", recipients);
    console.log("Order status alert options:", options);

    const data = compileTemplate("alerts/notification-alert.html", {
      ...options,
      domain,
    });

    const html = getBaseTemplate(data);

    console.log("Generated HTML template");

    const subject = `Notification alert for role: ${options.roleName} - Title #${options.title}`;
    console.log("Prepared email subject:", subject);

    const batchSize = 100;
    const batches = Math.ceil(recipients.length / batchSize);

    console.log(`Splitting recipients into ${batches} batch(es) of up to ${batchSize} recipients each.`);

    const results = [];

    for (let i = 0; i < batches; i++) {
      const batchRecipients = recipients.slice(i * batchSize, (i + 1) * batchSize);
      console.log(`Sending batch ${i + 1} with ${batchRecipients.length} recipient(s):`, batchRecipients);

      const mail = await resend.batch.send([
        {
          from: fromEmail,
          to: batchRecipients,
          subject,
          html,
        },
      ]);

      console.log(`Batch ${i + 1} sent successfully:`, mail);
      results.push(mail);
    }

    console.log("All batches sent successfully.");
    return results;
  } catch (error) {
    console.error("Failed to send order status alert:", error);
    console.error("Error details:", {
      recipients,
      options,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
};
