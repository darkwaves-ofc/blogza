import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const domain = process.env.NEXTAUTH_URL as string;
export const fromEmail = `mail@noerror.studio`;
