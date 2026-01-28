import Link from "next/link";
import {
  FaTelegramPlane,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaPhone,
  FaAddressCard,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-violet-700 pb-20 sm:pb-0 mt-4 text-muted p-4 xl:p-0 xl:pt-8 flex items-center justify-center">
      <div className="max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="leading-none text-2xl">MARESANS</h2>
            <p className="text-sm text-balance font-light opacity-75">
              4000&apos;den fazla parfüm ve oda kokusu esansını tek tıkla talep
              edebilirsiniz. Grup alımıyla top ve delux kalite esanslara uygun
              fiyatlarla ulaşın.
            </p>
            <ul className="flex items-center">
              <li>
                <a
                  href="telegram.com"
                  className="size-6 rounded flex items-center justify-center hover:bg-muted hover:text-violet-700 transition-colors"
                >
                  <FaTelegramPlane />
                  <p className="sr-only">telegram</p>
                </a>
              </li>
              <li>
                <a
                  href="instagram.com"
                  className="size-6 rounded flex items-center justify-center hover:bg-muted hover:text-violet-700 transition-colors"
                >
                  <FaInstagram />
                  <p className="sr-only">instagram</p>
                </a>
              </li>
              <li>
                <a
                  href="x.com"
                  className="size-6 rounded flex items-center justify-center hover:bg-muted hover:text-violet-700 transition-colors"
                >
                  <FaXTwitter />
                  <p className="sr-only">x(twitter)</p>
                </a>
              </li>
              <li>
                <a
                  href="tiktok.com"
                  className="size-6 rounded flex items-center justify-center hover:bg-muted hover:text-violet-700 transition-colors"
                >
                  <FaTiktok />
                  <p className="sr-only">tiktok</p>
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm flex flex-col gap-4">
            <h3>KATEGORİLER</h3>
            <nav>
              <ul className="flex flex-col">
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    TÜMÜ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    {" "}
                    ERKEK
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    KADIN
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    UNISEX
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="text-sm flex flex-col gap-4">
            <h3>KEŞFET</h3>
            <nav>
              <ul className="flex flex-col">
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    ANA SAYFA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    {" "}
                    S.S.S.
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    HAKKIMIZDA
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="text-sm flex flex-col gap-4">
            <h3>KURUMSAL</h3>
            <nav>
              <ul className="flex flex-col">
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    ÖN BİLGİLENDİRME FORMU
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    {" "}
                    MESAFELİ SATIŞ SÖZLEŞMESİ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    TESLİMAT-İADE POLİTİKASI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    GİZLİLİK VE GÜVENLİK POLİTİKASI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="h-8 flex items-center font-light pl-4 opacity-75 transition-colors hover:opacity-100"
                  >
                    KVKK AYDINLATMA METNİ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="text-sm flex flex-col gap-4">
            <h3>İLETİŞİM</h3>

            <ul className="flex flex-col font-light">
              <li className="pl-4 opacity-75 flex leading-none gap-2 h-8 items-center">
                <FaEnvelope /> info@maresans.com
              </li>
              <li className="pl-4 opacity-75 flex leading-none gap-2 h-8 items-center">
                <FaPhone /> 0850 346 56 25
              </li>
              <li className="pl-4 opacity-75 flex leading-none gap-2 h-8 items-center">
                <FaAddressCard />
                2590388751
              </li>
              <li className="pl-4 opacity-75 flex leading-none gap-2 h-8 mt-2">
                <FaMapMarkerAlt /> Kazım Dirik Mah. 296/2 Sok. No: 33, 35100,
                Bornova/İZMİR
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-violet-500 pt-3 mt-4 sm:pb-3">
          <p className="text-xs opacity-75 text-center">
            © 2026 Maresans. Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
