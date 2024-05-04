"use client";
import { Button } from "@/components/ui";

function page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button
        onClick={async () => {
          const result = await fetch("/api/checkout/subscription", {
            method: "POST",
          });
          const data = await result.json();
          window.location.href = data.url;
        }}
      >
        Pagar Subscripción
      </Button>
    </div>
  );
}
export default page;
