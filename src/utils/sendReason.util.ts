import { UserAttributes } from "../types/user.types";
import { sendEmail } from "./email.utils";

export const sendReasonEmail = (
  user: UserAttributes,
  subject: string,
  activationReason: string,
  isActive: boolean
) => {
  const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p style="font-size: 16px; color: #444;">Dear ${
        user.firstName + " " + user.lastName
      },</p>
      <p style="font-size: 16px; color: #444;">
        Your account associated with the email 
        <strong style="color: #000;">${user.email}</strong> 
        has been 
        <strong style="color: ${!isActive ? "#28a745" : "#dc3545"};">
          ${!isActive ? "activated" : "disabled"}
        </strong>.
      </p>
      <p style="font-size: 16px; color: #444;">
        Reason: 
        <span style="color: #007bff;">${activationReason}</span>
      </p>
      <p style="font-size: 16px; color: #444;">
        If you have any questions or need further assistance, please do not hesitate to contact our support team.
      </p>
      <p style="font-size: 16px; color: #444;">Best regards,</p>
      <p style="font-size: 16px; color: #444;">Geeklord E-commerce</p>
    </div>
  `;

  sendEmail(user.email, subject, "text", emailBody);
};
