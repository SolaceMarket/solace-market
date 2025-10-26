import type { CreditCardFormData, FormErrors } from "./types";

export const validateCardNumber = (number: string): boolean => {
  const cleaned = number.replace(/\s/g, "");
  return /^\d{13,19}$/.test(cleaned);
};

export const validateExpiryDate = (date: string): boolean => {
  const [month, year] = date.split("/");
  if (!month || !year || month.length !== 2 || year.length !== 2) return false;

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10) + 2000;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  return (
    monthNum >= 1 &&
    monthNum <= 12 &&
    (yearNum > currentYear ||
      (yearNum === currentYear && monthNum >= currentMonth))
  );
};

export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

export const validateForm = (formData: CreditCardFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.cardholderName.trim()) {
    errors.cardholderName = "Cardholder name is required";
  }

  if (!validateCardNumber(formData.cardNumber)) {
    errors.cardNumber = "Please enter a valid card number";
  }

  if (!validateExpiryDate(formData.expiryDate)) {
    errors.expiryDate = "Please enter a valid expiry date (MM/YY)";
  }

  if (!validateCVV(formData.cvv)) {
    errors.cvv = "Please enter a valid CVV";
  }

  if (!formData.billingAddress.street.trim()) {
    errors.billingAddress = "Street address is required";
  }

  if (!formData.billingAddress.city.trim()) {
    errors.billingAddress = "City is required";
  }

  if (!formData.billingAddress.state.trim()) {
    errors.billingAddress = "State is required";
  }

  if (!formData.billingAddress.zipCode.trim()) {
    errors.billingAddress = "ZIP code is required";
  }

  return errors;
};
