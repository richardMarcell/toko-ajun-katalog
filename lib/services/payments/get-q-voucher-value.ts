const voucherValues: Record<string, number> = {
  A: 50000,
  B: 100000,
};

export default function getQVoucherValue(
  codes: string[] | undefined,
): { code: string; value: number }[] {
  if (!codes) return [];

  return codes.map((code) => ({
    code,
    value: voucherValues[code] ?? 0,
  }));
}
