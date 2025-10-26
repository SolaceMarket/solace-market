export interface CreditCardFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface CreditCardFormProps {
  onSubmit?: (data: CreditCardFormData) => void;
  className?: string;
}

export type FormErrors = Partial<
  Record<keyof CreditCardFormData | "billingAddress", string>
>;

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CardInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}
