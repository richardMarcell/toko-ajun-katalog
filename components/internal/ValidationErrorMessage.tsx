export default function ValidationErrorMessage({
  errorMessage,
}: {
  errorMessage: string | null;
}) {
  return <div className="mt-1 text-[12px] text-red-500">{errorMessage}</div>;
}
