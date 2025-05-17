"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

export default function Page() {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Confirm Pickup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-4">
              {pin.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="text-center text-xl w-16 h-16 rounded-md border-gray-300"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              ))}
            </div>
            <Button className="w-full">Confirm</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}