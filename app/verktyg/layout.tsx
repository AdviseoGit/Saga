import React from "react";
import SagaUploadBanner from "@/components/SagaUploadBanner";
import SagaIndexBanner from "@/components/SagaIndexBanner";

/**
 * Alla kalkylatorer får samma avslutande Saga-banner: har besökaren redan en
 * offert är uppladdningen nästa steg, inte ytterligare en beräkning.
 */
export default function VerktygLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="bg-[#f8fafc] px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <SagaUploadBanner />
          <SagaIndexBanner />
        </div>
      </section>
    </>
  );
}
