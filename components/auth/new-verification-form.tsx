"use client";

import { useCallback, useEffect, useState } from "react";
// import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
// import { LuLoader } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { newVerification } from "@/actions/user/new-verification";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
          router.replace(
            "/auth/login" + callbackUrl ? `?callbackUrl=${callbackUrl}` : ""
          );
        } else {
          setError(data.error);
        }
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error, router, callbackUrl]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      title="Verification Token"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <Loader className="animate-spin" />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
