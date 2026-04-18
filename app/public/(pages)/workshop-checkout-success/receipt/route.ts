import { NextRequest, NextResponse } from "next/server";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFPage,
  type PDFFont,
} from "pdf-lib";

type ReceiptAttendee = {
  fullName?: string;
  professionalRole?: string;
  email?: string;
};

const COLORS = {
  primary: rgb(0.17, 0.72, 0.94),
  primarySoft: rgb(0.93, 0.97, 0.99),
  text: rgb(0.12, 0.16, 0.23),
  muted: rgb(0.45, 0.52, 0.62),
  border: rgb(0.84, 0.89, 0.94),
  white: rgb(1, 1, 1),
  success: rgb(0.06, 0.55, 0.34),
};

function money(value: string | number | null | undefined) {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(value ?? "0");

  if (Number.isNaN(parsed)) return "$0.00";

  return `$${parsed.toFixed(2)}`;
}

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color = COLORS.text,
) {
  page.drawText(text, {
    x,
    y,
    size,
    font,
    color,
  });
}

function drawRightText(
  page: PDFPage,
  text: string,
  rightX: number,
  y: number,
  font: PDFFont,
  size: number,
  color = COLORS.text,
) {
  const width = font.widthOfTextAtSize(text, size);

  page.drawText(text, {
    x: rightX - width,
    y,
    size,
    font,
    color,
  });
}

function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  topY: number,
  maxWidth: number,
  font: PDFFont,
  size: number,
  lineHeight: number,
  color = COLORS.text,
  maxLines?: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(test, size);

    if (width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);

  const finalLines =
    typeof maxLines === "number" ? lines.slice(0, maxLines) : lines;

  finalLines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: topY - index * lineHeight,
      size,
      font,
      color,
    });
  });

  return finalLines.length;
}

function drawLine(
  page: PDFPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thickness = 1,
  color = COLORS.border,
) {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness,
    color,
  });
}

function drawBox(
  page: PDFPage,
  x: number,
  topY: number,
  width: number,
  height: number,
  fill = COLORS.white,
  border = COLORS.border,
) {
  page.drawRectangle({
    x,
    y: topY - height,
    width,
    height,
    color: fill,
    borderColor: border,
    borderWidth: 1,
  });
}

function drawCircleLogo(
  page: PDFPage,
  centerX: number,
  centerY: number,
  outerRadius = 18,
) {
  page.drawCircle({
    x: centerX,
    y: centerY,
    size: outerRadius,
    color: COLORS.primary,
    borderColor: COLORS.primary,
    borderWidth: 1,
  });

  const squareSize = 13;
  const squareX = centerX - squareSize / 2;
  const squareY = centerY - squareSize / 2;

  page.drawRectangle({
    x: squareX,
    y: squareY,
    width: squareSize,
    height: squareSize,
    borderColor: COLORS.white,
    borderWidth: 1.8,
  });

  page.drawLine({
    start: { x: centerX, y: centerY - 4 },
    end: { x: centerX, y: centerY + 4 },
    thickness: 1.8,
    color: COLORS.white,
  });

  page.drawLine({
    start: { x: centerX - 4, y: centerY },
    end: { x: centerX + 4, y: centerY },
    thickness: 1.8,
    color: COLORS.white,
  });
}

function formatLongDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start) return "—";
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return "—";

  if (!end) {
    return startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const endDate = new Date(end);
  if (Number.isNaN(endDate.getTime())) {
    return startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = startDate.getMonth() === endDate.getMonth();

  if (sameYear && sameMonth) {
    return `${startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      day: "numeric",
      year: "numeric",
    })}`;
  }

  return `${startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  })} - ${endDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
}

function parseAttendees(raw: string | null): ReceiptAttendee[] {
  if (!raw) return [];

  try {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const workshopTitle = params.get("workshopTitle") || "Workshop";
    const reservationId = params.get("reservationId") || "Pending";
    const workshopStartDate = params.get("workshopStartDate");
    const workshopEndDate = params.get("workshopEndDate");
    const workshopLocation = params.get("workshopLocation") || "Online";
    const reservationCreatedAt = params.get("reservationCreatedAt");
    const totalPrice = params.get("totalPrice") || "0";
    const pricePerSeat = params.get("pricePerSeat") || "0";
    const attendees = parseAttendees(params.get("attendeesJson"));
    const primaryName = params.get("primaryName") || attendees[0]?.fullName || "—";
    const primaryRole = params.get("primaryRole") || attendees[0]?.professionalRole || "—";
    const primaryEmail = params.get("primaryEmail") || attendees[0]?.email || "—";

    const normalizedAttendees =
      attendees.length > 0
        ? attendees
        : [
            {
              fullName: primaryName,
              professionalRole: primaryRole,
              email: primaryEmail,
            },
          ];

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();
    const left = 30;
    const right = width - 30;

    let y = height - 34;

    drawCircleLogo(page, left + 18, y + 4, 18);
    drawText(page, "Texas Airway", left + 42, y + 6, fontBold, 16, COLORS.text);
    drawText(page, "INSTITUTE", left + 42, y - 12, fontBold, 10, COLORS.primary);
    drawText(
      page,
      "1234 Medical Center Dr, Suite 500,",
      left + 42,
      y - 30,
      fontRegular,
      9.2,
      COLORS.muted,
    );
    drawText(page, "Houston, TX 77030", left + 42, y - 44, fontRegular, 9.2, COLORS.muted);
    drawRightText(page, "INVOICE", right, y + 2, fontBold, 18, COLORS.text);

    y -= 72;

    const cardGap = 14;
    const invoiceBoxW = 215;
    const smallBoxW = 146;
    const infoBoxH = 72;

    drawBox(page, left, y, invoiceBoxW, infoBoxH, COLORS.primarySoft, COLORS.border);
    drawBox(page, left + invoiceBoxW + cardGap, y, smallBoxW, infoBoxH, COLORS.white, COLORS.border);
    drawBox(
      page,
      left + invoiceBoxW + cardGap + smallBoxW + cardGap,
      y,
      smallBoxW,
      infoBoxH,
      COLORS.white,
      COLORS.border,
    );

    drawText(page, "RESERVATION ID", left + 14, y - 16, fontBold, 9, COLORS.muted);
    drawText(page, reservationId, left + 14, y - 42, fontBold, 10, COLORS.text);

    const orderDateX = left + invoiceBoxW + cardGap;
    drawText(page, "ORDER DATE", orderDateX + 14, y - 16, fontBold, 9, COLORS.muted);
    drawText(
      page,
      formatLongDate(reservationCreatedAt),
      orderDateX + 14,
      y - 42,
      fontBold,
      12,
      COLORS.text,
    );

    const paymentCardX = orderDateX + smallBoxW + cardGap;
    drawText(page, "PAYMENT", paymentCardX + 14, y - 16, fontBold, 9, COLORS.muted);
    drawText(page, "FULL PAID", paymentCardX + 14, y - 38, fontBold, 11.5, COLORS.success);
    drawText(
      page,
      `Paid Amount: ${money(totalPrice)}`,
      paymentCardX + 14,
      y - 54,
      fontRegular,
      9.5,
      COLORS.muted,
    );

    y -= infoBoxH + 34;

    const detailsBoxH = 96;
    const detailsBoxW = 260;

    drawBox(page, left, y, detailsBoxW, detailsBoxH, COLORS.white, COLORS.border);
    drawBox(page, left + detailsBoxW + cardGap, y, detailsBoxW, detailsBoxH, COLORS.white, COLORS.border);

    drawText(page, "BILL TO", left + 14, y - 16, fontBold, 9, COLORS.muted);
    drawText(page, primaryName || "—", left + 14, y - 34, fontBold, 11.5, COLORS.text);
    drawText(page, primaryRole || "—", left + 14, y - 52, fontRegular, 10.5, COLORS.text);
    drawText(page, primaryEmail || "—", left + 14, y - 68, fontRegular, 10.5, COLORS.text);

    const workshopX = left + detailsBoxW + cardGap + 14;
    drawText(page, "WORKSHOP", workshopX, y - 16, fontBold, 9, COLORS.muted);
    drawWrappedText(page, workshopTitle, workshopX, y - 34, 220, fontBold, 11.5, 13, COLORS.text, 2);
    drawText(
      page,
      formatDateRange(workshopStartDate, workshopEndDate),
      workshopX,
      y - 66,
      fontRegular,
      10,
      COLORS.text,
    );
    drawWrappedText(page, workshopLocation || "—", workshopX, y - 82, 220, fontRegular, 9.5, 11, COLORS.muted, 2);

    y -= detailsBoxH + 28;
    drawText(page, "ATTENDEES", left, y, fontBold, 14, COLORS.text);
    y -= 18;

    const tableX = left;
    const tableW = right - left;
    const headerH = 30;
    const rowH = 38;

    drawBox(page, tableX, y, tableW, headerH, COLORS.primarySoft, COLORS.border);

    const colItemX = tableX + 12;
    const colEmailX = tableX + 228;
    const colPriceRight = tableX + 458;
    const colTotalRight = tableX + tableW - 22;

    drawText(page, "ATTENDEE", colItemX, y - 20, fontBold, 8.5, COLORS.muted);
    drawText(page, "EMAIL", colEmailX, y - 20, fontBold, 8.5, COLORS.muted);
    drawRightText(page, "PRICE", colPriceRight, y - 20, fontBold, 8.5, COLORS.muted);
    drawRightText(page, "TOTAL", colTotalRight, y - 20, fontBold, 8.5, COLORS.muted);

    y -= headerH;

    for (const attendee of normalizedAttendees) {
      drawBox(page, tableX, y, tableW, rowH, COLORS.white, COLORS.border);
      drawWrappedText(
        page,
        attendee.fullName || workshopTitle,
        colItemX,
        y - 16,
        200,
        fontBold,
        10.2,
        12,
        COLORS.text,
        2,
      );
      if (attendee.professionalRole) {
        drawWrappedText(
          page,
          attendee.professionalRole,
          colItemX,
          y - 30,
          200,
          fontRegular,
          8.6,
          10,
          COLORS.muted,
          1,
        );
      }
      drawWrappedText(
        page,
        attendee.email || "—",
        colEmailX,
        y - 22,
        150,
        fontRegular,
        9.5,
        11,
        COLORS.text,
        2,
      );
      drawRightText(page, money(pricePerSeat), colPriceRight, y - 22, fontRegular, 10, COLORS.text);
      drawRightText(page, money(pricePerSeat), colTotalRight, y - 22, fontBold, 10, COLORS.text);
      y -= rowH;
    }

    y -= 18;

    const summaryW = 223;
    const summaryH = 118;
    const summaryX = right - summaryW;

    drawBox(page, summaryX, y, summaryW, summaryH, COLORS.primarySoft, COLORS.border);

    const summaryLabelX = summaryX + 16;
    const summaryValueRight = summaryX + summaryW - 16;

    drawText(page, "Subtotal", summaryLabelX, y - 22, fontRegular, 10.5, COLORS.text);
    drawRightText(page, money(totalPrice), summaryValueRight, y - 22, fontBold, 10.5, COLORS.text);
    drawText(page, "Shipping", summaryLabelX, y - 44, fontRegular, 10.5, COLORS.text);
    drawRightText(page, "$0.00", summaryValueRight, y - 44, fontBold, 10.5, COLORS.text);
    drawText(page, "Tax", summaryLabelX, y - 66, fontRegular, 10.5, COLORS.text);
    drawRightText(page, "$0.00", summaryValueRight, y - 66, fontBold, 10.5, COLORS.text);
    drawLine(page, summaryX + 16, y - 80, summaryX + summaryW - 16, y - 80, 1, COLORS.border);
    drawText(page, "Grand Total", summaryLabelX, y - 104, fontBold, 11.5, COLORS.text);
    drawRightText(page, money(totalPrice), summaryValueRight, y - 104, fontBold, 15, COLORS.primary);

    const footerY = 38;
    drawLine(page, left, footerY + 12, right, footerY + 12, 1, COLORS.border);
    drawText(
      page,
      "Thank you for your workshop booking. This invoice was generated automatically from your Texas Airway Institute reservation.",
      left,
      footerY,
      fontRegular,
      8.8,
      COLORS.muted,
    );

    const pdfBytes = await pdfDoc.save();
    const filename = `invoice-${reservationId !== "Pending" ? reservationId : Date.now()}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Workshop invoice generation failed", error);
    return NextResponse.json({ message: "Failed to generate workshop invoice" }, { status: 500 });
  }
}
