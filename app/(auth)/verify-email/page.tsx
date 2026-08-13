import { Suspense } from "react";
import VerifyEmailClient from "../_components/VerifyEmailClient";

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <section className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
                    <div>Loading...</div>
                </section>
            }
        >
            <VerifyEmailClient />
        </Suspense>
    );
}