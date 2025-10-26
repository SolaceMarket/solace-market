import type { CreditCardFormData } from "./types";

export const getDemoData = (): CreditCardFormData => {
  if (process.env.NODE_ENV === "development") {
    return {
      cardNumber: "4532 1234 5678 9012",
      expiryDate: "12/28",
      cvv: "123",
      cardholderName: "John Doe",
      billingAddress: {
        street: "123 Demo Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        country: "US",
      },
    };
  }

  return {
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
  };
};

export const getEmptyFormData = (): CreditCardFormData => ({
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardholderName: "",
  billingAddress: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  },
});
