import type { Metadata } from "next";
import { Contact } from "@/components/contact";
import { Screen } from "@/components/screen";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Screen index="05" title="Contact">
      <Contact />
    </Screen>
  );
}
