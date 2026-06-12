import type { BookingFormData } from "@/types";

const OWNER_PHONE = "919971231552"; // Replace with real number before pitch

export function buildWhatsAppMessage(data: BookingFormData): string {
  const lines = [
    "🎯 New Trial Booking — Infinite Dance Centre",
    "",
    `👤 Name: ${data.fullName}`,
    `📱 Phone: +91 ${data.phone}`,
    `🎵 Course: ${data.courseName}`,
    `⏰ Batch: ${data.batchLabel}`,
    `👶 Type: ${data.studentType}${data.age ? ` — Age ${data.age}` : ""}`,
    `📝 Note: ${data.note || "None"}`,
    "",
    `📅 Received: ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    })} IST`,
  ];
  return lines.join("\n");
}

export function buildWhatsAppURL(data: BookingFormData): string {
  const message = buildWhatsAppMessage(data);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${OWNER_PHONE}?text=${encoded}`;
}

export function isWhatsAppAvailable(): boolean {
  return true;
}

export async function copyMessageToClipboard(data: BookingFormData): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(buildWhatsAppMessage(data));
    return true;
  } catch {
    return false;
  }
}
