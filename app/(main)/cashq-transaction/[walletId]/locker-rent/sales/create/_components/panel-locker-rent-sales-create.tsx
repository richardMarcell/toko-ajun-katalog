"use client";
import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSalesLockerRentPromoTypeDisplayAllowd,
  getSalesLockerRentPromoTypeDisplayStatus,
  SalesLockerRentPromoTypeEnum,
} from "@/lib/enums/SalesLockerPromoTypeEnum";
import { formatNumberToCurrency } from "@/lib/utils";
import { initialValue } from "@/repositories/domain/initial-value-form-state";
import { ArrowLeft, Slash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FormEvent,
  Fragment,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import storeSales from "../_actions/store-sales";

type LockerSalesType = {
  locker_type_id: string;
  locker_type_name: string;
  locker_price: number;
  promo_type: string;
  promo_code?: string;
  booklet_code?: string;
  booklet_promo_code?: string;
};

const lockerSalesDefaultValue = {
  locker_type_id: "",
  locker_type_name: "",
  locker_price: 0,
  promo_type: SalesLockerRentPromoTypeEnum.WITHOUT_PROMO,
};

export default function PanelLockerRentSalesCreate({
  wallet,
  productList,
}: {
  wallet: {
    id: bigint;
    created_at: Date;
    updated_at: Date | null;
    code: string | null;
    customer_name: string;
    customer_phone_number: string;
    deposit_payment_method: string | null;
    deposit_amount: string;
    saldo: string;
    status: string;
  };
  productList: {
    name: string;
    id: bigint;
    price: string;
  }[];
}) {
  const [state, formAction] = useActionState(storeSales, initialValue);
  const [lockerSales, setLockerSales] = useState<LockerSalesType>(
    lockerSalesDefaultValue,
  );

  const hanldeProceed = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formData.set("wallet_id", wallet.id.toString());
      formData.set("locker_type_id", lockerSales.locker_type_id);
      formData.set("locker_type_name", lockerSales.locker_type_name);
      formData.set("locker_price", lockerSales.locker_price.toString());
      if (lockerSales.promo_code)
        formData.set("promo_code", lockerSales.promo_code);
      if (lockerSales.booklet_code)
        formData.set("booklet_code", lockerSales.booklet_code);
      if (lockerSales.booklet_promo_code)
        formData.set("booklet_promo_code", lockerSales.booklet_promo_code);

      formData.set("promo_type", lockerSales.promo_type);
      formData.set("total_gross", lockerSales.locker_price.toString());

      formAction(formData);
    });
  };

  const handleCancel = () => {
    setLockerSales(lockerSalesDefaultValue);
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 2000,
      });
    }

    if (state.status == "success" && state.url) {
      redirect(state.url);
    }
  }, [state]);

  return (
    <form onSubmit={hanldeProceed}>
      <Card className="w-full px-4 py-5">
        <CardContent className="flex gap-4 p-2">
          <div className="w-[60%] space-y-6">
            <div className="justify-between border-b border-b-gray-200 pb-4">
              <h1 className="text-2xl font-semibold">Pembayaran Sewa Loker</h1>
              <BreadcrumbPage walletId={wallet.id.toString()} />
            </div>

            <div>
              <Button variant="outline" asChild>
                <Link href={`/cashq-transaction/${wallet.id}/locker-rent`}>
                  <ArrowLeft /> Kembali
                </Link>
              </Button>
            </div>

            <div>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="locker_type_id">Tipe Loker</Label>
                    <span className="text-qubu_red">*</span>
                  </div>
                  <Select
                    name="locker_type_id"
                    value={lockerSales.locker_type_id}
                    onValueChange={(value) => {
                      const product = productList.find(
                        (product) => product.id === BigInt(value),
                      );

                      if (product) {
                        setLockerSales({
                          ...lockerSales,
                          locker_type_id: product.id.toString(),
                          locker_type_name: product.name,
                          locker_price: Number(product.price),
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {productList.map((product) => {
                        return (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {state.errors?.locker_type_id && (
                    <ValidationErrorMessage
                      errorMessage={state.errors.locker_type_id.toString()}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="promo_type">Pilih Promo</Label>
                    <span className="text-qubu_red">*</span>
                  </div>
                  <Select
                    name="promo_type"
                    value={lockerSales.promo_type}
                    onValueChange={(value) => {
                      setLockerSales(() => ({
                        ...lockerSales,
                        promo_type: value,
                        promo_code: undefined,
                        booklet_code: undefined,
                        booklet_promo_code: undefined,
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih promo" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSalesLockerRentPromoTypeDisplayAllowd().map(
                        (promoType, index) => (
                          <SelectItem key={index} value={promoType}>
                            {getSalesLockerRentPromoTypeDisplayStatus(
                              promoType as SalesLockerRentPromoTypeEnum,
                            )}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {state.errors?.promo_type && (
                    <ValidationErrorMessage
                      errorMessage={state.errors.promo_type.toString()}
                    />
                  )}
                </div>

                {/* Input Promo Code */}
                {lockerSales.promo_type ===
                  SalesLockerRentPromoTypeEnum.PROMO && (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="promo_code">Kode Promo</Label>
                      <span className="text-qubu_red">*</span>
                    </div>
                    <Input
                      placeholder="Masukkan kode promo"
                      id="promo_code"
                      name="promo_code"
                      value={lockerSales.promo_code}
                      autoComplete="off"
                      onChange={(event) =>
                        setLockerSales({
                          ...lockerSales,
                          promo_code: event.target.value,
                        })
                      }
                    />
                    {state.errors?.promo_code && (
                      <ValidationErrorMessage
                        errorMessage={state.errors.promo_code.toString()}
                      />
                    )}
                  </div>
                )}

                {/* Input Booklet Code */}
                {lockerSales.promo_type ===
                  SalesLockerRentPromoTypeEnum.BOOKLET && (
                  <Fragment>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="booklet_code">Kode Booklet</Label>
                        <span className="text-qubu_red">*</span>
                      </div>
                      <Input
                        placeholder="Masukkan kode booklet"
                        id="booklet_code"
                        name="booklet_code"
                        value={lockerSales.booklet_code}
                        autoComplete="off"
                        onChange={(event) =>
                          setLockerSales({
                            ...lockerSales,
                            booklet_code: event.target.value,
                          })
                        }
                      />
                      {state.errors?.booklet_code && (
                        <ValidationErrorMessage
                          errorMessage={state.errors.booklet_code.toString()}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="booklet_promo_code">
                          Kode Promo Booklet
                        </Label>
                        <span className="text-qubu_red">*</span>
                      </div>
                      <Input
                        placeholder="Masukkan kode promo booklet"
                        id="booklet_promo_code"
                        name="booklet_promo_code"
                        value={lockerSales.booklet_promo_code}
                        autoComplete="off"
                        onChange={(event) =>
                          setLockerSales({
                            ...lockerSales,
                            booklet_promo_code: event.target.value,
                          })
                        }
                      />
                      {state.errors?.booklet_promo_code && (
                        <ValidationErrorMessage
                          errorMessage={state.errors.booklet_promo_code.toString()}
                        />
                      )}
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </div>

          <div className="w-[40%]">
            <Image
              src="/assets/imgs/header-card.png"
              alt="header-card"
              width={600}
              height={0}
              className="w-full rounded-lg object-contain"
            />
            <Card className="rounded-tl-none rounded-tr-none border">
              <CardContent className="pt-4">
                {lockerSales.locker_type_id && (
                  <div>
                    <div className="grid grid-cols-2">
                      <p>Loker {lockerSales.locker_type_name}</p>
                      <p className="text-right">
                        {formatNumberToCurrency(lockerSales.locker_price)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="max-h-[410px] border-b-2 border-dashed border-b-gray-300 pt-8"></div>

                <div className="mt-4 space-y-4 rounded-lg">
                  <div className="flex justify-between font-bold">
                    <div className="w-20">Total</div>
                    <div className="">
                      {formatNumberToCurrency(lockerSales.locker_price)}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button className="mt-4 w-full bg-black p-2" type="submit">
                  Proceed
                </Button>
                <Button
                  onClick={handleCancel}
                  className="mt-4 w-full bg-black/50 p-2"
                  type="button"
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function BreadcrumbPage({ walletId }: { walletId: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md text-qubu_blue">
        <BreadcrumbItem>
          <Link href="/cashq-transaction">Transaksi Terbuka</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <Link href={`/cashq-transaction/${walletId}/locker-rent`}>Loker</Link>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>Pembayaran</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
