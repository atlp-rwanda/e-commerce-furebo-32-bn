const resetPasswordTemplate = (resetLink: string): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333;">Password Reset</h1>
          <p style="color: #666;">Hello,</p>
          <p style="color: #666;">You recently requested to reset your password. Click the button below to reset it.</p>
          <p style="color: #666;">If you didn't request this, you can safely ignore this email.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="color: #666;">If the button above doesn't work, use token below to reset your password</p>
          <p style="color: #666;">${resetLink}</p>
          <p style="color: #666;">Thank you,</p>

      </div>
  </body>
  </html>
  `;
};

export { resetPasswordTemplate };