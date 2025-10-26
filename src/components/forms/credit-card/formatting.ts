// Format card number with spaces
export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = matches?.[0] || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return v;
  }
};

// Format expiry date MM/YY
export const formatExpiryDate = (value: string): string => {
  const v = value.replace(/\D/g, "");
  if (v.length >= 2) {
    return v.substring(0, 2) + "/" + v.substring(2, 4);
  }
  return v;
};

// Format CVV (numbers only)
export const formatCVV = (value: string): string => {
  return value.replace(/\D/g, "").substring(0, 4);
};
