"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  // const page = await props.params.page;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nextStep, setStep] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  let errors = {
    mail: "",
    password: "",
  };
  const isValidStep1 = () => {
    let isValid = true;
    let checkEmail = /^[a-zA-Z0-9.-_]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    if (!checkEmail.test(email)) {
      isValid = false;
      errors.mail = `Enter valid email`;
    }
    return isValid;
  };
  const isValidStep2 = () => {
    let isValid = true;
    // let checkpassword = /^[a-zA-Z0-9.-_]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    if (password.length <= 7) {
      isValid = false;
      errors.password = `??`;
    }
    return isValid;
  };

  const handleSignUp = async () => {
    const res = await fetch(`http://localhost:5000/account/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setResponse(data.message);
    console.log(response);
  };
  const handleSignIn = async () => {
    const res = await fetch(`http://localhost:5000/account/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log(data);
  };
  console.log(page);
  return !page ? (
    <div className="w-4/5 flex flex-col gap-4">
      <div className="h-15">
        <h1 className="font-bold text-xl text-foreground">
          Create your account
        </h1>
        <p className="text-muted-foreground text-base">
          Sign up to explore your favorite dishes.
        </p>
      </div>
      <div>
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            console.log(email);
          }}
          placeholder="Enter your email address"
          type="email"
        />
      </div>
      <div className="text-red-600 text-sm">
        {!isValidStep1() && errors.mail}
      </div>
      <div>
        <Link
          onClick={(e) => {
            if (isValidStep1()) {
              setStep(true);
            } else {
              setStep(false);
            }
            if (!nextStep) {
              e.preventDefault();
            }
          }}
          href={`/signup?page=2`}
        >
          <Button
            disabled={!isValidStep1()}
            className={`w-full ${
              !isValidStep1()
                ? `bg-muted-foreground cursor-not-allowed text-foreground`
                : ``
            }`}
          >
            Let's go
          </Button>
        </Link>
      </div>
      <div className="flex justify-center gap-4">
        <p className="text-muted-foreground">Already have an account?</p>
        <Link href={`/account/login`} className="text-blue-500">
          Log in
        </Link>
      </div>
    </div>
  ) : (
    <div className="w-4/5 flex flex-col gap-4">
      <div>
        <Link href={`/signup`}>
          <ArrowLeftIcon />
        </Link>
      </div>
      <div className="h-15">
        <h1 className="font-bold text-xl text-foreground">
          Create your password
        </h1>
        <p className="text-muted-foreground text-base">Create your password</p>
      </div>
      <div>
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
            console.log(password);
          }}
          placeholder="Enter your password"
          type="password"
        />
      </div>
      <div className="text-red-600 text-sm">
        {!isValidStep2() && errors.password}
        {response && response}
      </div>
      <div>
        <Button
          onClick={handleSignUp}
          disabled={!isValidStep2()}
          className={`w-full ${
            !isValidStep2()
              ? `bg-muted-foreground cursor-not-allowed text-foreground`
              : ``
          }`}
        >
          Let's go
        </Button>
      </div>
      <div className="flex justify-center gap-4">
        <p className="text-muted-foreground">Already have an account?</p>
        <Link href={`/signin`} className="text-blue-500 bg-none">
          Log in
        </Link>
      </div>
    </div>
  );
}
