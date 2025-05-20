"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formaterDate } from "@/lib/utils";
import {
  BookletPromoWithRelation,
  BookletUsedPromoHistories,
} from "@/types/domains/tickets-booklet-promo/sales/general";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";

export function PanelCheckBooklet({
  bookletPromoWithRelations,
  bookletUsedPromoHistories,
}: {
  bookletPromoWithRelations: BookletPromoWithRelation | null;
  bookletUsedPromoHistories: BookletUsedPromoHistories[];
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Check Booklet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-7">
        <FilterBooklet />

        <TableListCoupon
          bookletPromoWithRelations={bookletPromoWithRelations}
        />

        <TableListCouponUsage
          bookletUsedPromoHistories={bookletUsedPromoHistories}
        />
      </CardContent>
    </Card>
  );
}

function FilterBooklet() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookletCode, setBookletCode] = useState<string>(
    searchParams.get("bookletCode") as string,
  );

  const handleCheckCodeOnClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (bookletCode) params.set("bookletCode", bookletCode);
    else params.delete("bookletCode");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-2">
      <div>
        <div>
          <Label htmlFor="booklet_code" className="text-lg">
            Booklet Code
          </Label>
          <span className="text-qubu_red">*</span>
        </div>
      </div>
      <div className="flex justify-between gap-x-2">
        <Input
          placeholder="Masukkan Kode Booklet"
          id="booklet_code"
          name="booklet_code"
          defaultValue={bookletCode}
          onChange={(e: BaseSyntheticEvent) => setBookletCode(e.target.value)}
          autoComplete="off"
        />
        <Button
          onClick={handleCheckCodeOnClick}
          className="bg-qubu_blue"
          type="button"
        >
          Check Code
        </Button>
      </div>
    </div>
  );
}

function TableListCoupon({
  bookletPromoWithRelations,
}: {
  bookletPromoWithRelations: BookletPromoWithRelation | null;
}) {
  return (
    <div className="space-y-4">
      {bookletPromoWithRelations && (
        <div className="flex items-center gap-1 rounded-lg border border-qubu_green bg-qubu_light_green p-4 text-lg font-medium text-qubu_green">
          <p>
            Sisa Penggunaan Kupon ini{" "}
            <strong>
              &quot;{bookletPromoWithRelations.remaining_coupon_quota}x&quot;
            </strong>
          </p>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-black">#</TableHead>
            <TableHead className="font-bold text-black">Promo</TableHead>
            <TableHead className="text-center font-bold text-black">
              Total Pemakaian
            </TableHead>
            <TableHead className="text-center font-bold text-black">
              Limit
            </TableHead>
            <TableHead className="text-center font-bold text-black">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!bookletPromoWithRelations && (
            <TableRow className="text-center italic">
              <TableCell colSpan={5}>Promo tidak ditemukan</TableCell>
            </TableRow>
          )}

          {bookletPromoWithRelations && (
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>{bookletPromoWithRelations.promo.name}</TableCell>
              <TableCell className="text-center">
                {bookletPromoWithRelations.total_used}
              </TableCell>
              <TableCell className="text-center">
                {bookletPromoWithRelations.limit}
              </TableCell>
              <TableCell className="flex justify-center">
                <Button asChild>
                  <Link
                    href={`/tickets-booklet-promo/order?bookletCode=${bookletPromoWithRelations.booklet_code}&promoCode=${bookletPromoWithRelations.promo.code}`}
                  >
                    Gunakan
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function TableListCouponUsage({
  bookletUsedPromoHistories,
}: {
  bookletUsedPromoHistories: BookletUsedPromoHistories[];
}) {
  return (
    <div className="space-y-4 pt-4">
      <h1 className="text-2xl font-medium">History Pemakaian</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-black">#</TableHead>
            <TableHead className="font-bold text-black">
              Tanggal & Waktu
            </TableHead>
            <TableHead className="text-center font-bold text-black">
              Total Pemakaian
            </TableHead>
            <TableHead className="text-center font-bold text-black">
              Limit
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookletUsedPromoHistories.length === 0 && (
            <TableRow className="text-center italic">
              <TableCell colSpan={4}>Belum terdapat pemakaian promo</TableCell>
            </TableRow>
          )}

          {bookletUsedPromoHistories.map((history, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {formaterDate(history.created_at, "dateTime")}
                </TableCell>
                <TableCell className="text-center">
                  {history.total_used}x
                </TableCell>
                <TableCell className="text-center">{history.limit}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
