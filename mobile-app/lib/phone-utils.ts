export function formatIndianPhone(phone: string) {
  const cleaned = phone.replace(/\D/g, ""); // remove non-digits

  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    const country = cleaned.slice(0, 2);
    const part1 = cleaned.slice(2, 7);
    const part2 = cleaned.slice(7, 12);

    return `+${country} ${part1} ${part2}`;
  }

  return phone; // fallback
}

export const validatePhoneNumber = (number: string) => {
  const cleaned = number.replace(/\D/g, "");
  const regex = /^[6-9]\d{9}$/;
  return regex.test(cleaned);
};
