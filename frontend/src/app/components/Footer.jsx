import Image from "next/image";
import Link from "next/link";
import { Divider } from "@nextui-org/divider";

export default function Footer() {
  return (
    <footer className="px-20 bg-gray-300 py-7">
      <div className="flex items-center justify-start w-full">
        <Image alt="logo" src="/logo.png" width={200} height={200}></Image>
        <div className="flex items-center h-5 mx-10 space-x-2">
          <FooterLink href="/" text="關於TicketBuzz" />
          <Divider orientation="vertical" className="w-0.5 bg-gray-800" />
          <FooterLink href="/" text="會員服務條款" />
          <Divider orientation="vertical" className="w-0.5 bg-gray-800" />
          <FooterLink href="/" text="隱私權政策" />
          <Divider orientation="vertical" className="w-0.5 bg-gray-800" />
          <FooterLink href="/" text="舉辦活動" />
        </div>
        <div className="ml-auto">
          <p>票務服務單位：票不知去哪有限公司</p>
          <p>客服專線：(02)5487-1787</p>
          <p>客服時間：週一～週五13:30-18:00(國定假日暫停服務)</p>
          <p>客服信箱：support@ticketbuzz.com</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }) {
  return (
    <Link href={href}>
      <p className="font-medium">{text}</p>
    </Link>
  );
}
