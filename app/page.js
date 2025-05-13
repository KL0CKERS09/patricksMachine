import Image from "next/image";
import SlotMachine from "./slot_machine/page"; // import the component, not page.tsx

export default function Home() {
  return (
    <>
      <SlotMachine />
    </>
  );
}
