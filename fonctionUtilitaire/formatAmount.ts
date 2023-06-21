export function formatAmount(
  amount: string | number | undefined,
  currency?: string
): string {
  if (!amount) {
    return "0";
  }
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return "0";
  }

  const formattedAmount = Math.abs(numericAmount).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
  });

  return formattedAmount;
}
