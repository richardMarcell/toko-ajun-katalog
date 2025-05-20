import Image from "next/image";

export function CashQTransactionHistoryHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      <Image
        src={"/assets/imgs/logo.png"}
        alt="Logo Image"
        width={300}
        height={300}
      />

      <strong className="text-2xl">INVOICE</strong>

      <div className="text-right">
        <strong>PARADISQ.</strong>
        <p>JL. Arteri Supadio No. 16, Sungai Raya</p>
        <p>Kabupaten Kubu Raya, Kalimantan Barat</p>
        <p>
          <strong>T</strong> (0561) 762888
        </p>
        <p>
          <strong>E</strong> paradisq@quburesort.com
        </p>
        <p>
          <strong>W</strong> www.quburesort.com/paradisq
        </p>
      </div>
    </div>
  );
}
