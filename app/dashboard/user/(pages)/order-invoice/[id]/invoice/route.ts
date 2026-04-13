import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFPage,
  type PDFFont,
} from "pdf-lib";
import { service_URL } from "@/config/env";

type OrderDetailsResponse = {
  message: string;
  data: {
    id: string;
    orderNumber: string;
    placedDate: string;
    items: Array<{
      id: string;
      name: string;
      sku: string;
      price: string;
      quantity: number;
    }>;
    shipping: {
      fullName: string;
      addressLine1: string;
      addressLine2: string | null;
      cityStateZip: string;
    };
    payment: {
      subtotal: string;
      shipping: string;
      tax: string;
      grandTotal: string;
      brand: string | null;
      last4: string | null;
    };
  };
};

const COLORS = {
  primary: rgb(0.17, 0.72, 0.94),
  primarySoft: rgb(0.93, 0.97, 0.99),
  text: rgb(0.12, 0.16, 0.23),
  muted: rgb(0.45, 0.52, 0.62),
  border: rgb(0.84, 0.89, 0.94),
  bgSoft: rgb(0.97, 0.98, 0.99),
  white: rgb(1, 1, 1),
};

function money(value: string | number | null | undefined) {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(value ?? "0");

  if (Number.isNaN(parsed)) return "$0.00";

  return `$${parsed.toFixed(2)}`;
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
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
  const words = text.split(/\s+/);
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

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!service_URL) {
      return NextResponse.json(
        { message: "Service URL is not configured" },
        { status: 500 },
      );
    }

    const apiBaseUrl = normalizeBaseUrl(service_URL);

    const response = await fetch(`${apiBaseUrl}/users/private/orders/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          message: "Failed to fetch order details for invoice",
          details: errorText,
        },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as OrderDetailsResponse;
    const order = payload.data;

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
    drawText(
      page,
      "INSTITUTE",
      left + 42,
      y - 12,
      fontBold,
      10,
      COLORS.primary,
    );
    drawRightText(page, "INVOICE", right, y + 2, fontBold, 18, COLORS.text);

    y -= 44;

    const cardGap = 14;
    const smallCardY = y;
    const invoiceBoxW = 255;
    const smallBoxW = 127;
    const infoBoxH = 68;

    drawBox(
      page,
      left,
      smallCardY,
      invoiceBoxW,
      infoBoxH,
      COLORS.primarySoft,
      COLORS.border,
    );
    drawBox(
      page,
      left + invoiceBoxW + cardGap,
      smallCardY,
      smallBoxW,
      infoBoxH,
      COLORS.white,
      COLORS.border,
    );
    drawBox(
      page,
      left + invoiceBoxW + cardGap + smallBoxW + cardGap,
      smallCardY,
      smallBoxW,
      infoBoxH,
      COLORS.white,
      COLORS.border,
    );

    drawText(
      page,
      "INVOICE NUMBER",
      left + 14,
      smallCardY - 16,
      fontBold,
      9,
      COLORS.muted,
    );
    drawText(
      page,
      order.orderNumber,
      left + 14,
      smallCardY - 40,
      fontBold,
      13,
      COLORS.text,
    );

    const orderDateX = left + invoiceBoxW + cardGap;
    drawText(
      page,
      "ORDER DATE",
      orderDateX + 14,
      smallCardY - 16,
      fontBold,
      9,
      COLORS.muted,
    );
    drawText(
      page,
      order.placedDate,
      orderDateX + 14,
      smallCardY - 40,
      fontBold,
      12,
      COLORS.text,
    );

    const orderIdX = orderDateX + smallBoxW + cardGap;
    drawText(
      page,
      "ORDER ID",
      orderIdX + 14,
      smallCardY - 16,
      fontBold,
      9,
      COLORS.muted,
    );
    drawWrappedText(
      page,
      order.orderNumber,
      orderIdX + 14,
      smallCardY - 38,
      smallBoxW - 28,
      fontRegular,
      8.3,
      11,
      COLORS.text,
      2,
    );

    y = smallCardY - infoBoxH - 34;

    const billingBoxH = 88;
    const billingW = 260;
    const paymentW = 260;

    drawBox(page, left, y, billingW, billingBoxH, COLORS.white, COLORS.border);
    drawBox(
      page,
      left + billingW + cardGap,
      y,
      paymentW,
      billingBoxH,
      COLORS.white,
      COLORS.border,
    );

    drawText(
      page,
      "BILLING / SHIPPING",
      left + 14,
      y - 16,
      fontBold,
      9,
      COLORS.muted,
    );
    drawText(
      page,
      order.shipping.fullName || "—",
      left + 14,
      y - 34,
      fontBold,
      11.5,
      COLORS.text,
    );

    let shippingTextY = y - 52;
    drawText(
      page,
      order.shipping.addressLine1 || "—",
      left + 14,
      shippingTextY,
      fontRegular,
      10.5,
      COLORS.text,
    );

    if (order.shipping.addressLine2) {
      shippingTextY -= 16;
      drawText(
        page,
        order.shipping.addressLine2,
        left + 14,
        shippingTextY,
        fontRegular,
        10.5,
        COLORS.text,
      );
    }

    shippingTextY -= 16;
    drawText(
      page,
      order.shipping.cityStateZip || "—",
      left + 14,
      shippingTextY,
      fontRegular,
      10.5,
      COLORS.text,
    );

    const paymentX = left + billingW + cardGap;
    drawText(
      page,
      "PAYMENT METHOD",
      paymentX + 14,
      y - 16,
      fontBold,
      9,
      COLORS.muted,
    );
    drawText(
      page,
      order.payment.brand && order.payment.last4
        ? `${order.payment.brand} ending in ${order.payment.last4}`
        : "Card payment",
      paymentX + 14,
      y - 34,
      fontBold,
      11.5,
      COLORS.text,
    );
    drawText(
      page,
      "Paid successfully",
      paymentX + 14,
      y - 52,
      fontRegular,
      10.5,
      COLORS.text,
    );

    y -= billingBoxH + 28;

    drawText(page, "ITEMS", left, y, fontBold, 14, COLORS.text);

    y -= 18;

    const tableX = left;
    const tableW = right - left;
    const headerH = 30;
    const rowH = 36;

    drawBox(
      page,
      tableX,
      y,
      tableW,
      headerH,
      COLORS.primarySoft,
      COLORS.border,
    );

    const colItemX = tableX + 12;
    const colSkuX = tableX + 284;
    const colQtyX = tableX + 360;
    const colPriceRight = tableX + 436;
    const colTotalRight = tableX + tableW - 22;

    drawText(page, "ITEM", colItemX, y - 20, fontBold, 8.5, COLORS.muted);
    drawText(page, "SKU", colSkuX, y - 20, fontBold, 8.5, COLORS.muted);
    drawText(page, "QTY", colQtyX, y - 20, fontBold, 8.5, COLORS.muted);
    drawRightText(
      page,
      "PRICE",
      colPriceRight,
      y - 20,
      fontBold,
      8.5,
      COLORS.muted,
    );
    drawRightText(
      page,
      "TOTAL",
      colTotalRight,
      y - 20,
      fontBold,
      8.5,
      COLORS.muted,
    );

    y -= headerH;

    for (const item of order.items) {
      drawBox(page, tableX, y, tableW, rowH, COLORS.white, COLORS.border);

      const lineTotal =
        Number.parseFloat(item.price || "0") * Number(item.quantity || 0);

      drawText(page, item.name, colItemX, y - 20, fontBold, 8.5, COLORS.text);
      drawText(
        page,
        item.sku || "—",
        colSkuX,
        y - 20,
        fontRegular,
        10,
        COLORS.text,
      );
      drawText(
        page,
        String(item.quantity || 0),
        colQtyX,
        y - 20,
        fontRegular,
        10,
        COLORS.text,
      );

      drawRightText(
        page,
        money(item.price),
        colPriceRight,
        y - 20,
        fontRegular,
        10,
        COLORS.text,
      );

      drawRightText(
        page,
        money(lineTotal),
        colTotalRight,
        y - 20,
        fontBold,
        10,
        COLORS.text,
      );

      y -= rowH;
    }

    y -= 18;

    const summaryW = 223;
    const summaryH = 118;
    const summaryX = right - summaryW;

    drawBox(
      page,
      summaryX,
      y,
      summaryW,
      summaryH,
      COLORS.primarySoft,
      COLORS.border,
    );

    const summaryLabelX = summaryX + 16;
    const summaryValueRight = summaryX + summaryW - 16;

    drawText(
      page,
      "Subtotal",
      summaryLabelX,
      y - 22,
      fontRegular,
      10.5,
      COLORS.text,
    );
    drawRightText(
      page,
      money(order.payment.subtotal),
      summaryValueRight,
      y - 22,
      fontBold,
      10.5,
      COLORS.text,
    );

    drawText(
      page,
      "Shipping",
      summaryLabelX,
      y - 44,
      fontRegular,
      10.5,
      COLORS.text,
    );
    drawRightText(
      page,
      money(order.payment.shipping),
      summaryValueRight,
      y - 44,
      fontBold,
      10.5,
      COLORS.text,
    );

    drawText(
      page,
      "Tax",
      summaryLabelX,
      y - 66,
      fontRegular,
      10.5,
      COLORS.text,
    );
    drawRightText(
      page,
      money(order.payment.tax),
      summaryValueRight,
      y - 66,
      fontBold,
      10.5,
      COLORS.text,
    );

    drawLine(
      page,
      summaryX + 16,
      y - 80,
      summaryX + summaryW - 16,
      y - 80,
      1,
      COLORS.border,
    );

    drawText(
      page,
      "Grand Total",
      summaryLabelX,
      y - 104,
      fontBold,
      11.5,
      COLORS.text,
    );
    drawRightText(
      page,
      money(order.payment.grandTotal),
      summaryValueRight,
      y - 104,
      fontBold,
      15,
      COLORS.primary,
    );

    const footerY = 38;
    drawLine(page, left, footerY + 12, right, footerY + 12, 1, COLORS.border);
    drawText(
      page,
      "Thank you for your order. This invoice was generated automatically from your Texas Airway Institute purchase.",
      left,
      footerY,
      fontRegular,
      8.8,
      COLORS.muted,
    );

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.orderNumber}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Invoice generation failed", error);

    return NextResponse.json(
      { message: "Failed to generate invoice" },
      { status: 500 },
    );
  }
}
