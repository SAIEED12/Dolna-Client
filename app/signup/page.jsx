'use client'
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Button,
  Description,
  FieldError,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Check } from "lucide-react";
import React, { useState } from "react";

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // console.error("Signup data:", userData);

    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        name: userData.username,
        email: userData.email,
        password: userData.password,
        role: "customer",
        callbackURL: "/",
      });

      if (error) {
        // console.error("Signup error:", error);
        setError("Something went wrong. Please try again.");
        return;
      }

      router.push("/");
    } catch (err) {
        // console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form className="flex w-96 flex-col gap-4" onSubmit={onSubmit}>
        <TextField isRequired name="username">
          <Label>Username</Label>
          <Input placeholder="Enter your username" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          name="email"
          type="email"
          validate={(value) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
              return "Please enter a valid email address";
            }
            return null;
          }}
        >
          <Label>Email</Label>
          <Input placeholder="john@example.com" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          minLength={8}
          name="password"
          type="password"
          validate={(value) => {
            if (value.length < 8) {
              return "Password must be at least 8 characters";
            }
            if (!/[A-Z]/.test(value)) {
              return "Password must contain at least one uppercase letter";
            }
            if (!/[0-9]/.test(value)) {
              return "Password must contain at least one number";
            }
            return null;
          }}
        >
          <Label>Password</Label>
          <Input placeholder="Enter your password" />
          <Description>
            Must be at least 8 characters with 1 uppercase and 1 number
          </Description>
          <FieldError />
        </TextField>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" isDisabled={loading}>
            <Check />
            {loading ? "Submitting…" : "Submit"}
          </Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Signup;