export declare enum OtpPurpose {
    PHONE_VERIFICATION = "phone_verification",
    LOGIN = "login",
    PASSWORD_RESET = "password_reset"
}
export declare class SendOtpDto {
    phone: string;
    purpose: OtpPurpose;
}
