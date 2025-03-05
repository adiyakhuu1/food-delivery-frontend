"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import z from "zod";
import axios from "axios";
import { response } from "@/app/types/types";
import { useRouter } from "next/navigation";
import { ImSpinner10 } from "react-icons/im";
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [response, setResponse] = useState<response>();
  const [loading, setLoading] = useState(false);
  const result = formSchema.safeParse(form);
  const errors = result.error?.formErrors.fieldErrors;

  const handleFormInfo = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name;
    const value = event.target.value;
    setForm((p) => ({
      ...p,
      [field]: value,
    }));
  };
  useEffect(() => {
    if (response?.success && response.code === "LOGGED_IN_SUCCESSFULLY") {
      router.push("/");
    }
  }, [response]);
  const login = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/user/login`, form);
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
  return (
    <div className="w-4/5 flex flex-col gap-4">
      <div className="h-15">
        <h1 className="font-bold text-xl text-foreground">Нэвтрэх</h1>
        <p className="text-muted-foreground text-base">
          Нэвтэрч орон хоолоо захиална уу!
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Input
          className={`${form.email && errors?.email && `border-red-400`}`}
          name="email"
          onChange={handleFormInfo}
          placeholder="Емайлээ оруулна уу!"
          type="email"
        />
        {form.email && (
          <>
            {errors?.email && (
              <div className="text-red-400 text-xs">Зөв майл оруулна уу!</div>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Input
          className={`${form.password && errors?.password && `border-red-400`}`}
          name="password"
          onChange={handleFormInfo}
          placeholder="Нууц үгээ оруулна уу!"
          type="password"
        />
        {form.password && (
          <>
            {errors?.password && (
              <div className="text-red-400 text-xs">
                Нууц үг дор хаяж 8 оронтой байх ёстой!
              </div>
            )}
          </>
        )}
      </div>

      <div className="text-sm">Нууц үгээ мартсан уу?</div>

      <div>
        <div
          className={`flex justify-center ${
            response?.success ? `text-green-500` : `text-red-400`
          }`}
        >
          {response?.message && response.message}
        </div>

        <Button
          onClick={login}
          disabled={!result.success || loading}
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
        <p className="text-muted-foreground">Хаяг байхгүй юу?</p>
        <Link href={`/account/signup`}>
          <button className="text-blue-500">Бүртгүүлэх</button>
        </Link>
      </div>
    </div>
  );
}
