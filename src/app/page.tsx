"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/api/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-500 mb-4">
          Keboola Connection
        </h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </main>
  );
}
