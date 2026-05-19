import Link from "next/link";
import { Truck } from "lucide-react";

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link className={`brand${footer ? " footer-brand" : ""}`} href="/" aria-label="GDS home">
      <span className="brand-mark">
        <Truck aria-hidden="true" />
      </span>
      <span>
        <strong>GDS</strong>
        <small>Ghana Delivery Service</small>
      </span>
    </Link>
  );
}
