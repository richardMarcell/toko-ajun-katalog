"use client";

import ValidationErrorMessage from "@/components/internal/ValidationErrorMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTicketOrderContext } from "@/contexts/ticket-order-context";
import { ServerActionResponse } from "@/types/domains/server-action";
import { BaseSyntheticEvent } from "react";

export function DynamicInputWristbandCode({
  state,
}: {
  state: ServerActionResponse;
}) {
  const { setTicketSalesTemporaryInput, ticketSalesTemporaryInput } =
    useTicketOrderContext();

  const handleWristbandCodeInputOnChange = (
    e: BaseSyntheticEvent,
    index: number,
  ) => {
    const newWristbandCodeList = [
      ...(ticketSalesTemporaryInput.wristband_code_list ?? []),
    ];
    newWristbandCodeList[index] = e.target.value;
    setTicketSalesTemporaryInput({
      ...ticketSalesTemporaryInput,
      wristband_code_list: newWristbandCodeList,
    });
  };
  return (
    <div className="space-y-2 pt-4">
      {Array.from({
        length: ticketSalesTemporaryInput.wristband_qty,
      }).map((_, index) => (
        <div className="space-y-2" key={index}>
          <div>
            <Label htmlFor={`wristband_rent_code[${index}]`}>
              #{index + 1} CashQ Code
            </Label>
            <span className="text-qubu_red">*</span>
          </div>
          <Input
            placeholder="Masukkan Kode CashQ"
            id={`wristband_code_list_${index}`}
            name={`wristband_code_list[${index}]`}
            autoComplete="off"
            defaultValue={ticketSalesTemporaryInput.wristband_code_list[index]}
            onChange={(e: BaseSyntheticEvent) =>
              handleWristbandCodeInputOnChange(e, index)
            }
          />
          {state.errors?.wristband_code_list && (
            <div>
              <ValidationErrorMessage
                errorMessage={state.errors?.wristband_code_list.toString()}
              />
            </div>
          )}
          {renderDynamicInputValidationError(
            state.errors,
            `wristband_code_list[${index}]`,
          )}
        </div>
      ))}
    </div>
  );
}

function renderDynamicInputValidationError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: Record<string, any> | undefined,
  name: string,
) {
  const errorObject = errors || {};

  return Object.keys(errorObject).map((key) => {
    if (key.includes(name)) {
      return (
        <ValidationErrorMessage
          key={key}
          errorMessage={errorObject[key].toString()}
        />
      );
    }
    return null;
  });
}
