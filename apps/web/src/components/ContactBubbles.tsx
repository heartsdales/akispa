"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const whatsappNumber = site.whatsapp.replace(/\D/g, "");
const wechatUrl = /^https:\/\//i.test(site.wechatUrl) ? site.wechatUrl : "";
const wechatId = site.wechatId.trim();

const bubble =
  "grid size-[47px] place-items-center rounded-full text-white shadow-[0_5px_17px_rgb(0_0_0/0.2)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-plum sm:size-[53px]";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-7 fill-current">
      <path d="M12 .7A11.2 11.2 0 0 0 2.4 17.6L.8 23.2l5.8-1.5A11.3 11.3 0 1 0 12 .7Zm0 20.5c-1.8 0-3.6-.5-5.1-1.5l-.4-.2-3.4.9.9-3.3-.2-.4a9.3 9.3 0 1 1 8.2 4.5Zm5.1-6.9c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.2-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.3 4.6.7.3 1.3.5 1.8.6.8.2 1.6.2 2.2.1.7-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4Z" />
    </svg>
  );
}

function WeChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-7 fill-current">
      <path d="M9.8 2C4.6 2 1 5.3 1 9.3c0 2.3 1.2 4.2 3.1 5.5l-.7 2.8 3-1.5c.9.3 1.9.4 2.9.4.3 0 .6 0 .9-.1a6.8 6.8 0 0 1-.4-2.4c0-4.1 3.6-7.4 8.1-7.4.4 0 .8 0 1.2.1C17.9 3.9 14.3 2 9.8 2ZM6.7 8.4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm6.1 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4.9-.1c-3.9 0-7 2.6-7 5.9s3.1 5.9 7 5.9c.8 0 1.6-.1 2.3-.4l2.5 1.3-.6-2.3a5.5 5.5 0 0 0 2.1-4.5c0-3.3-2.9-5.9-6.3-5.9Zm-2.2 5.4a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm4.4 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z" />
    </svg>
  );
}

/** Floating WhatsApp / WeChat shortcuts. Renders nothing until configured in `site`. */
export function ContactBubbles() {
  const [copied, setCopied] = useState(false);
  if (!whatsappNumber && !wechatUrl && !wechatId) return null;

  async function copyWeChatId() {
    try {
      await navigator.clipboard.writeText(wechatId);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      window.prompt("Copy the WeChat ID and search for it in WeChat:", wechatId);
    }
  }

  return (
    <div aria-label={`Contact ${site.brand}`} role="group" className="fixed bottom-24 left-3 z-20 flex flex-col gap-3 sm:left-4 lg:bottom-5">
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${bubble} bg-[#25D366]`}
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      )}
      {wechatUrl ? (
        <a
          href={wechatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${bubble} bg-[#07C160]`}
          aria-label="Contact on WeChat"
          title="Contact on WeChat"
        >
          <WeChatIcon />
        </a>
      ) : (
        wechatId && (
          <div className="relative">
            <button
              type="button"
              className={`${bubble} bg-[#07C160]`}
              onClick={copyWeChatId}
              aria-label={`Copy WeChat ID ${wechatId}`}
              title="Copy WeChat ID"
            >
              <WeChatIcon />
            </button>
            <p
              role="status"
              className={`absolute top-1/2 left-full ml-3 -translate-y-1/2 rounded-full bg-plum px-3 py-1.5 text-xs whitespace-nowrap text-cream ${copied ? "" : "sr-only"}`}
            >
              {copied ? `WeChat ID ${wechatId} copied — search it in WeChat` : ""}
            </p>
          </div>
        )
      )}
    </div>
  );
}
