import Link from "next/link";
import { Image } from "@nextui-org/react";
export default function EventCard({ imgSrc, imgAlt, date, title }) {
  return (
    <div className="min-w-[300px] max-w-[calc(33%-1rem)] p-5">
      <Link href="/ticket">
        <div>
          <Image
            isZoomed
            src={imgSrc}
            alt={imgAlt}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="m-3">
          <small className="text-default-500">{date}</small>
          <h4 className="font-bold hover:underline text-large hover:text-amber-500">
            {title}
          </h4>
        </div>
      </Link>
    </div>
  );
}
