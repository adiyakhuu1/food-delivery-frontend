"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verify, setVerify] = useState<boolean>(false);
  const [submitted, setSubmit] = useState<boolean>(false);
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
    if (password.length <= 7) {
      isValid = false;
      errors.password = `??`;
    }
    return isValid;
  };

  const handleSignIn = async () => {
    const res = await fetch(`http://localhost:5000/account/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setVerify(data);
    console.log(data);
  };

  return (
    <div className="w-4/5 flex flex-col gap-4">
      <div className="h-15">
        <h1 className="font-bold text-xl text-foreground">Login</h1>
        <p className="text-muted-foreground text-base">
          Log in to enjoy your favorite dishes.
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

      <div className="text-sm">Forgot Password?</div>

      {submitted && (
        <div className="text-red-600 text-sm">
          {verify ? `Pass matched` : `Pass didn't match`}
        </div>
      )}

      <div>
        <Button
          onClick={() => {
            setSubmit(true);
            handleSignIn();
          }}
          disabled={!isValidStep1()}
          className={`w-full ${
            !isValidStep1()
              ? `bg-muted-foreground cursor-not-allowed text-foreground`
              : ``
          }`}
        >
          Let's go
        </Button>
      </div>
      <div className="flex justify-center gap-4">
        <p className="text-muted-foreground">Don't have an account?</p>
        <Link href={`/signup`}>
          <button onClick={handleSignIn} className="text-blue-500">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
