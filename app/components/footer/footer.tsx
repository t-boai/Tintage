"use client";

import Link from "next/link";
import { Camera, Music2, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="container mx-auto w-full border-t border-neutral-200 bg-[#FAFAFA] text-neutral-600">
      <div className="my-[10vh]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                TINTAGE
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                Nền tảng mua bán thời trang secondhand uy tín, chất lượng hàng
                đầu Việt Nam.
              </p>

              {/* Social Icons */}
              <div className="mt-5 flex items-center gap-2.5">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/70 text-neutral-700 transition-colors hover:bg-[#FF2E55] hover:text-white"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/70 text-neutral-700 transition-colors hover:bg-[#FF2E55] hover:text-white"
                  aria-label="Instagram"
                >
                  <Camera className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/70 text-neutral-700 transition-colors hover:bg-[#FF2E55] hover:text-white"
                  aria-label="TikTok"
                >
                  <Music2 className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-xs text-neutral-400">
              © {new Date().getFullYear()} TINTAGE, Inc. Bảo lưu mọi quyền.
            </p>
          </div>

          {/* Cột 2: Về Tintage */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-neutral-900 uppercase">
              VỀ TINTAGE
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-[#FF2E55]"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="transition-colors hover:text-[#FF2E55]"
                >
                  Hỗ trợ & FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="transition-colors hover:text-[#FF2E55]"
                >
                  Cộng đồng
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="transition-colors hover:text-[#FF2E55]"
                >
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Chính sách */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-neutral-900 uppercase">
              CHÍNH SÁCH
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-[#FF2E55]"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-[#FF2E55]"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/inspection"
                  className="transition-colors hover:text-[#FF2E55]"
                >
                  Quy trình kiểm duyệt
                </Link>
              </li>
              <li>
                <Link
                  href="/dispute"
                  className="transition-colors hover:text-[#FF2E55]"
                >
                  Giải quyết khiếu nại
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Tải ứng dụng */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-neutral-900 uppercase">
              TẢI ỨNG DỤNG
            </h4>
            <p className="mt-3 text-sm text-neutral-500">
              Trải nghiệm mua sắm mượt mà hơn trên di động.
            </p>

            {/* App Store / Play Store Badges */}
            <div className="mt-4 flex flex-col gap-2.5 sm:w-48">
              {/* App Store Button */}
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl bg-neutral-900 px-3.5 py-2 text-white transition-opacity hover:opacity-90"
              >
                <AppleIcon className="h-6 w-6 fill-current" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] leading-none text-neutral-400 uppercase">
                    Download on the
                  </span>
                  <span className="text-sm leading-tight font-semibold">
                    App Store
                  </span>
                </div>
              </a>

              {/* Google Play Button */}
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl bg-neutral-900 px-3.5 py-2 text-white transition-opacity hover:opacity-90"
              >
                <GooglePlayIcon className="h-6 w-6 fill-current" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] leading-none text-neutral-400 uppercase">
                    GET IT ON
                  </span>
                  <span className="text-sm leading-tight font-semibold">
                    Google Play
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Icon SVG Apple
function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 384 512" {...props}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-12.8 69.5-34.3z" />
    </svg>
  );
}

// Icon SVG Google Play
function GooglePlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l220.7-221.3 60.1 60.1L104.6 499z" />
    </svg>
  );
}
