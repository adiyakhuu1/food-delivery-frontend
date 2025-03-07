"use client";

import { AlertDemo } from "@/app/_components/alert";
import Loading from "@/app/_components/loading";
import { response } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import z from "zod";
const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);
export default function App() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [count, setCount] = useState();
  const [OTPID, setOTPID] = useState("");
  const [password, setPassword] = useState("");
  const [OTP, setOTP] = useState<number>();
  const [response, setResponse] = useState<response>();
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    let timeout = setTimeout(() => {
      setAlert(false);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [alert]);
  useEffect(() => {
    const result = emailSchema.safeParse(email);
    if (result.success) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    if (response?.success && response.code === `OTP_SET`) {
      const result = passwordSchema.safeParse(password);
      if (result.success) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  }, [email, password]);
  const SendMail = async () => {
    setLoading(true);
    const res = await axios.post(`/api/otp`, { email });
    setResponse(res.data);
    setLoading(false);
    setAlert(true);
    if (res.data.success) {
      setOTPID(res.data.data.id);
    }
  };
  const SendOTP = async () => {
    setLoading(true);
    const res = await axios.patch(`/api/otp`, { email, OTP, OTPID, password });
    setResponse(res.data);
    setLoading(false);
    setAlert(true);
  };
  return (
    <div className="w-4/5 flex flex-col gap-4">
      <div className="h-15">
        <h1 className="font-bold text-xl text-foreground">Нууц үг солих</h1>
      </div>
      <div className="flex flex-col gap-2">
        <Input
          disabled={response?.success && response.code === `OTP_SET`}
          //   className={`${form.email && errors?.email && `border-red-400`}`}
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Емайлээ оруулна уу!"
          type="email"
        />
        {response?.success && response.code === `OTP_SET` && (
          <button onClick={SendMail} className="text-xs">
            Ахиад илгээх
          </button>
        )}
        {response?.success && response.code === `OTP_SET` && (
          <>
            <Input
              //   className={`${form.email && errors?.email && `border-red-400`}`}
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Нууц үг"
              type="password"
            />
            <Input
              //   className={`${form.email && errors?.email && `border-red-400`}`}
              name="OTP"
              onChange={(e) => {
                setOTP(Number(e.target.value));
              }}
              placeholder="Нэг удаагийн код!"
              type="number"
            />
          </>
        )}
        {/* {form.email && (
          <>
            {errors?.email && (
              <div className="text-red-400 text-xs">Зөв майл оруулна уу!</div>
            )}
          </>
        )} */}
      </div>
      <div className="flex flex-col gap-2">
        {/* <Input
          //   className={`${form.password && errors?.password && `border-red-400`}`}
          name="password"
          placeholder="Нууц үгээ оруулна уу!"
          type="password"
        /> */}
        {/* {form.password && (
          <>
            {errors?.password && (
              <div className="text-red-400 text-xs">
                Нууц үг дор хаяж 8 оронтой байх ёстой!
              </div>
            )}
          </>
        )} */}
      </div>
      <div>
        {/* <div
          className={`flex justify-center ${
            response?.success ? `text-green-500` : `text-red-400`
          }`}
        >
          {response?.message && response.message}
        </div> */}
        {response && alert && (
          <div className="fixed top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <AlertDemo success={response.success} message={response.message} />
          </div>
        )}
        {response?.success && response.code === `OTP_SET` ? (
          <Button
            onClick={SendOTP}
            disabled={!isValid || loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loading />
              </div>
            ) : (
              ` Шалгах`
            )}
          </Button>
        ) : (
          <Button
            onClick={SendMail}
            disabled={!isValid || loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loading />
              </div>
            ) : (
              ` Код илгээх`
            )}
          </Button>
        )}
      </div>
      <div className="flex justify-center gap-4">
        <Link href={`/account/signup`}>
          <button className="text-blue-500">Бүртгүүлэх</button>
        </Link>
        <Link href={`/account/signin`}>
          <button className="text-blue-500">Нэвтрэх</button>
        </Link>
      </div>
    </div>
  );
}
