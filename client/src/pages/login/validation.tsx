// Export empty to make it module
// export {};
// Comment out during JS to TS for future reference
import * as Yup from 'yup';
import i18n from "i18next";

export const loginSchema = Yup.object({
  username: Yup.string()
    // .email('Invalid email address')
    .min(2, i18n.t("signInValidationMustBe2CharMini"))
    .max(20, i18n.t("signInValidationMustBe20CharLess"))
    .required('Required'),
  password: Yup.string()
    .min(6, i18n.t("signInValidationMustBe6CharMini"))
    .max(20, i18n.t("signInValidationRequired"))
    .required(i18n.t("signInValidationRequired")),
});
