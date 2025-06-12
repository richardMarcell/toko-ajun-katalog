"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { initialValue } from "@/repositories/initial-value-form-state";
import { Star } from "lucide-react";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { storeSaleRating } from "../[salesId]/_actions/store-sale-rating";
import { SaleIncluRelationship } from "../_repositories/get-sale";
import { toast } from "sonner";

export function DialogFormRatingSales({
  sale,
}: {
  sale: SaleIncluRelationship;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const [state, formAction] = useActionState(storeSaleRating, initialValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("sale_id", sale.id.toString());
      formData.set("rating", rating.toString());

      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status) {
      toast(state.message, {
        duration: 3000,
      });
    }

    if (state.status === "success") {
      setIsLoading(false);
      setIsOpen(false);
      setRating(0);
      setHoverRating(0);
    }
  }, [state]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>
          <Star />
          <span>Beri Rating</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Beri Rating</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                className="p-1"
              >
                <Star
                  className={`h-6 w-6 ${
                    val <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                  onMouseEnter={() => setHoverRating(val)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              </button>
            ))}
          </div>

          {/* Comment */}
          <Textarea
            name="comment"
            rows={4}
            placeholder="Tulis komentar anda..."
            required
          />

          <Button
            disabled={isLoading || rating === 0}
            className="w-full"
            type="submit"
          >
            {isLoading ? "Mengirim..." : "Kirim"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
