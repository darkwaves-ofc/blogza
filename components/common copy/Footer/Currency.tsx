"use client";
import { CurrencyInfoSuccess } from "@/types/currency";
import { useForm } from "react-hook-form";
import { updateUserPreferencesSchema } from "@/schemas/user";
import { z } from "zod";
import {
  GetMyPreferencesInfoSuccessType,
  isUpdateMyPreferencesSuccess,
} from "@/types/user";
import { useTransition } from "react";
import { updateMyPreferences } from "@/actions/user/update";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function Currency({
  currenciesInfo,
  preferences,
}: {
  currenciesInfo: CurrencyInfoSuccess;
  preferences: GetMyPreferencesInfoSuccessType["preferences"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof updateUserPreferencesSchema>>({
    defaultValues: {
      currency: preferences?.currency || undefined,
    },
  });

  function onSubmit(data: z.infer<typeof updateUserPreferencesSchema>) {
    startTransition(async () => {
      const response = await updateMyPreferences(data);
      if (!isUpdateMyPreferencesSuccess(response)) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        router.refresh();
        return;
      } else {
        toast({
          title: "Preferences updated",
          description: "Your preferences have been successfully updated.",
        });
      }
    });
  }

  return (
    <div>
      <Form {...form}>
        <form className="space-y-8">
          <FormField
            disabled={isPending}
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.handleSubmit(onSubmit)();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currenciesInfo.currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select your preferred currency.
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
