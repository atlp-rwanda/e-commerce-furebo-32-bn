// Constants for the application
// constants should contain a comment explaining what the constant is used for
// constants should be in uppercase
// constants should be snake_case
import dotenv from "dotenv";

dotenv.config();

// constants for user messages
export const USER_MESSAGES = {
    INVALID_TOKEN: "Invalid token",
    USER_NOT_FOUND: "User not found",
    EMAIL_VERIFIED: "Email verified successfully",
    INTERNAL_SERVER_ERROR: "Internal server error",
};

// Constants for JWT tokens and expiry
export const JWT_CONSTANTS = {
    SECRET_KEY: process.env.JWT_SECRET || "", // Secret key for JWT
    AUTH_TOKEN_EXPIRY: "24h", // 24 hours for token expiry
    REFRESH_TOKEN_EXPIRY: "7d", // 7 days for token expiry
    SHORT_TOKEN_EXPIRY: "1h", // 1 hour for token expiry
};

// constants for mock user data
export const MOCK_USER = {
    ID: 1,
    EMAIL: "testuser@example.com",
    NONE_EXISTENT_EMAIL: "notanemail@example.com",
    MOCK_STRING: "Test String",
    TEST_TOKEN: "test",
};

// routes for the application
export const ROUTES = {
    VERIFY_EMAIL: "/api/users/verify-email",
};
export const userRole= {
    admin:'admin',
    buyer:'buyer',
    seller:'seller'
};

export const AccountStatusMessages = {
    ACCOUNT_ENABLED_SUBJECT: "Account Enabled",
    ACCOUNT_DISABLED_SUBJECT: "Account Disabled",
    DEFAULT_ACTIVATION_REASON: "You are allowed to login again"
  };

export const validStatus = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'on hold', 'cancelled'];
