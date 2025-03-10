"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import z from "zod";
import { response } from "@/app/types/types";
import { ImSpinner10 } from "react-icons/im";
const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine(
    (value) => {
      if (value.password === value.passwordConfirm) {
        return true;
      } else {
        return false;
      }
    },
    { message: "Нууц үг таарсангүй" }
  );
type Error = {
  success: boolean;
  error: { email: boolean; password: boolean; passwordConfirm: boolean };
};

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<response>();

  const [errors, setErrors] = useState<Error>({
    success: false,
    error: { email: false, password: false, passwordConfirm: false },
  });
  useEffect(() => {
    setResponse(undefined);
    const result = formSchema.safeParse(form);
    if (result.success) {
      setErrors({
        success: false,
        error: { email: false, password: false, passwordConfirm: false },
      });
      setIsValid(true);
    } else {
      const errors = result.error.formErrors.fieldErrors;

      setErrors({
        success: result.success,
        error: {
          email: !!errors.email,
          password: !!errors.password,
          passwordConfirm: !!errors.passwordConfirm,
        },
      });
      setIsValid(false);
    }
  }, [form]);
  const HandleSignup = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/user/create`, {
        email: form.email,
        password: form.password,
      });
      setResponse(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err, "Сервэртэй холбогдож чадсангүй!");
      setResponse({
        success: false,
        code: "FAILED_CONNECTION",
        message: "Сервэртэй холбогдож чадсангүй!",
        data: null,
      });
      setLoading(false);
    }
  };
  const handleFormInfo = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name;
    const { value } = event.target;
    setForm((p) => ({ ...p, [field]: value }));
  };
  return (
    <div className="w-4/5 flex flex-col gap-4">
      <div className="h-15">
        <h1 className="font-bold text-xl text-foreground">Шинэ хаяг нээх</h1>
        <p className="text-muted-foreground text-base">
          Бүртгүүлж орон хоолоо захиална уу!
        </p>
      </div>
      <div>
        <Input
          name="email"
          onChange={handleFormInfo}
          placeholder="Емайлээ оруулна уу!"
          type="email"
          className={`${form.email && errors.error.email && `border-red-400`}`}
        />
        {form.email && (
          <div>
            {errors.error.email && (
              <div className="text-red-400 text-xs">Зөв майл оруулна уу!</div>
            )}
          </div>
        )}
      </div>
      <div>
        <Input
          name="password"
          onChange={handleFormInfo}
          placeholder="Нууц үгээ оруулна уу!"
          type="password"
        />
      </div>
      {form.password && (
        <>
          {errors.error.password && (
            <div>
              <div className="text-red-400 text-xs">
                {!isValid && `Дор хаяж 8 -н оронтой нууц үг оруулна уу!`}
              </div>
            </div>
          )}
        </>
      )}
      <div>
        <Input
          name="passwordConfirm"
          onChange={handleFormInfo}
          placeholder="Нууц үгээ давтаж оруулна уу!"
          type="password"
        />
      </div>
      {form.passwordConfirm && (
        <div>
          {!errors.error.passwordConfirm && !errors.error.password && (
            <div className="text-red-400 text-xs">
              {!isValid && `Нууц үг таарахгүй байна!`}
            </div>
          )}
        </div>
      )}
      <div
        className={`${
          response?.success ? ` text-green-400` : ` text-red-400`
        } text-sm`}
      >
        {response?.message && response.message}
      </div>
      <div>
        <Button
          onClick={HandleSignup}
          disabled={!isValid || loading}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div>Түр хүлээнэ үү!</div>
              <div>
                <ImSpinner10 className=" animate-spin" />
              </div>
            </div>
          ) : (
            `Үргэлжлүүлэх`
          )}
        </Button>
      </div>
      <div className="flex justify-center gap-4">
        <p className="text-muted-foreground">Хаягтай юу?</p>
        <Link href={`/account/signin`} className="text-blue-500">
          Нэвтрэх
        </Link>
      </div>
    </div>
  );
}
