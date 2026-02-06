"use client";

import { useState } from "react";
import {
  ChevronDown,
  Clock,
  Loader2,
  MailOpen,
  Package,
  Paperclip,
  Search,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EmailAnalysisStatus =
  | "New"
  | "Analyzing"
  | "Not Relevant"
  | "Quote Requested"
  | "Extracting"
  | "Processed";

interface EmailThread {
  id: string;
  threadId: string;
  from: { name: string; email: string };
  to: { name: string; email: string };
  subject: string;
  snippet: string;
  body: string;
  receivedDate: string;
  isRead: boolean;
  analysisStatus: EmailAnalysisStatus;
  channel: "email";
  threadCount: number;
  attachments?: { name: string; size: string; href: string }[];
  triage?: {
    summary: string;
    isQuoteRequest: boolean;
  };
  extraction?: {
    accountName: string;
    contactName: string;
    contactEmail: string;
    products: { name: string; quantity: number; unit: string }[];
    tenderStartDate?: string;
    tenderEndDate?: string;
    estimatedValue?: string;
  };
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const emails: EmailThread[] = [
  {
    id: "1",
    threadId: "t-001",
    from: { name: "Ayşe Demir", email: "ayse.demir@turktraktor.com.tr" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "Hidrolik Silindir Teklif Talebi - 2024 Yılı İhtiyacı",
    snippet: "Sayın Yetkili, firmamızın 2024 yılı üretim planı kapsamında hidrolik silindir ihtiyacımız...",
    body: `Sayın Yetkili,

Firmamızın 2024 yılı üretim planı kapsamında aşağıda belirtilen hidrolik silindir ihtiyacımız bulunmaktadır.

Talep edilen ürünler:
- 80x50x500 Hidrolik Silindir (200 adet)
- 100x63x600 Hidrolik Silindir (150 adet)
- 63x40x400 Hidrolik Silindir (300 adet)

İhale başlangıç tarihi: 15 Şubat 2024
Son teklif tarihi: 1 Mart 2024

Tekliflerinizi yukarıda belirtilen tarihe kadar iletmenizi rica ederiz.

Saygılarımızla,
Ayşe Demir
Satın Alma Müdürü
Türk Traktör`,
    receivedDate: "2 hours ago",
    isRead: false,
    analysisStatus: "Processed",
    channel: "email",
    threadCount: 4,
    attachments: [
      {
        name: "Teknik_Sartname_Hidrolik_Silindir.pdf",
        size: "1.8 MB",
        href: "/attachments/teknik-sartname-hidrolik-silindir.pdf",
      },
      {
        name: "Miktar_Listesi_2024.xlsx",
        size: "420 KB",
        href: "/attachments/miktar-listesi-2024.xlsx",
      },
    ],
    triage: {
      summary: "Türk Traktör is requesting a formal quote for hydraulic cylinders. Three product lines with specific quantities. Tender with deadline March 1, 2024.",
      isQuoteRequest: true,
    },
    extraction: {
      accountName: "Türk Traktör",
      contactName: "Ayşe Demir",
      contactEmail: "ayse.demir@turktraktor.com.tr",
      products: [
        { name: "80x50x500 Hidrolik Silindir", quantity: 200, unit: "pcs" },
        { name: "100x63x600 Hidrolik Silindir", quantity: 150, unit: "pcs" },
        { name: "63x40x400 Hidrolik Silindir", quantity: 300, unit: "pcs" },
      ],
      tenderStartDate: "2024-02-15",
      tenderEndDate: "2024-03-01",
      estimatedValue: "$185,000",
    },
  },
  {
    id: "2",
    threadId: "t-002",
    from: { name: "Mehmet Yılmaz", email: "mehmet@caterpillar.com.tr" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "RE: Piston Rod Quotation for CAT 320 Series",
    snippet: "Following up on our previous conversation, we need piston rods for the new production line...",
    body: `Hi,

Following up on our previous conversation, we need piston rods for the new CAT 320 Series production line.

Required items:
- Chrome-plated Piston Rod Ø45mm (500 units)
- Chrome-plated Piston Rod Ø60mm (300 units)

We need delivery by Q2 2024. Please send your best pricing.

Regards,
Mehmet Yılmaz
Procurement Manager
Caterpillar Turkey`,
    receivedDate: "5 hours ago",
    isRead: false,
    analysisStatus: "Processed",
    channel: "email",
    threadCount: 7,
    attachments: [
      {
        name: "CAT320_RFQ_Details.docx",
        size: "690 KB",
        href: "/attachments/cat320-rfq-details.docx",
      },
    ],
    triage: {
      summary: "Caterpillar Turkey requests quotation for chrome-plated piston rods, two sizes. Follow-up to existing conversation. Q2 2024 delivery required.",
      isQuoteRequest: true,
    },
    extraction: {
      accountName: "Caterpillar Turkey",
      contactName: "Mehmet Yılmaz",
      contactEmail: "mehmet@caterpillar.com.tr",
      products: [
        { name: "Chrome-plated Piston Rod Ø45mm", quantity: 500, unit: "pcs" },
        { name: "Chrome-plated Piston Rod Ø60mm", quantity: 300, unit: "pcs" },
      ],
      tenderEndDate: "2024-06-30",
      estimatedValue: "$92,000",
    },
  },
  {
    id: "3",
    threadId: "t-003",
    from: { name: "Elena Vasquez", email: "elena.v@liebherr.com" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "Urgent: Cylinder Assembly Quote for Mining Equipment",
    snippet: "Dear team, Liebherr Mining division urgently requires a quotation for custom cylinder assemblies...",
    body: `Dear team,

Liebherr Mining division urgently requires a quotation for custom cylinder assemblies for our T 284 mining truck line.

Specifications:
- Heavy-duty Cylinder Assembly HD-200 (25 units)
- Heavy-duty Cylinder Assembly HD-350 (15 units)
- Seal kits for both models (100 sets each)

This is a priority procurement. Tender closes February 20, 2024.

Please confirm receipt and provide timeline for quotation.

Best regards,
Elena Vasquez
Senior Procurement Specialist
Liebherr Mining Equipment`,
    receivedDate: "Yesterday",
    isRead: true,
    analysisStatus: "Quote Requested",
    channel: "email",
    threadCount: 3,
    triage: {
      summary: "Liebherr Mining requests urgent quote for heavy-duty cylinder assemblies and seal kits. High-value mining equipment procurement with tight deadline.",
      isQuoteRequest: true,
    },
  },
  {
    id: "4",
    threadId: "t-004",
    from: { name: "Ali Kaya", email: "ali.kaya@hidromek.com.tr" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "Teklif İstegi - Ekskavatör Boom Silindirleri",
    snippet: "Merhaba, HMK 220 LC serisi ekskavatörlerimiz için boom silindir ihtiyacımız hakkında...",
    body: `Merhaba,

HMK 220 LC serisi ekskavatörlerimiz için boom silindir ihtiyacımız hakkında bilgi almak istiyoruz.

Detaylar önümüzdeki hafta netleşecek, ancak tahmini olarak 100-150 adet civarında bir ihtiyacımız olacak.

İlk görüşme için müsait olduğunuz bir zaman dilimi var mı?

Saygılarımla,
Ali Kaya
Hidromek`,
    receivedDate: "Yesterday",
    isRead: true,
    analysisStatus: "Quote Requested",
    channel: "email",
    threadCount: 2,
    triage: {
      summary: "Hidromek inquiring about boom cylinders for HMK 220 LC excavators. Early-stage inquiry, quantities not finalized. Requesting a meeting.",
      isQuoteRequest: true,
    },
  },
  {
    id: "5",
    threadId: "t-005",
    from: { name: "Sarah Mitchell", email: "sarah@volvo-ce.com" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "Partnership Inquiry - Volvo CE Supplier Program",
    snippet: "We are expanding our supplier network and would like to explore potential collaboration...",
    body: `Dear Team,

We are expanding our supplier network for our Construction Equipment division and would like to explore potential collaboration opportunities.

Volvo CE is looking for qualified hydraulic component manufacturers for our 2024-2025 supply chain. If you are interested, please complete the attached supplier qualification form.

This is not a specific order request but a general supplier evaluation process.

Kind regards,
Sarah Mitchell
Supply Chain Development
Volvo Construction Equipment`,
    receivedDate: "2 days ago",
    isRead: true,
    analysisStatus: "Not Relevant",
    channel: "email",
    threadCount: 1,
    triage: {
      summary: "General supplier partnership inquiry from Volvo CE. Not a specific quote request - this is a supplier qualification/evaluation process.",
      isQuoteRequest: false,
    },
  },
  {
    id: "6",
    threadId: "t-006",
    from: { name: "Newsletter", email: "info@hydraulicsindustry.com" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "Weekly Digest: Steel Prices & Industry Trends - Feb 2024",
    snippet: "This week's roundup: Steel prices continue to rise, new EU regulations on hydraulic fluids...",
    body: `Hydraulics Industry Weekly Digest

This week's highlights:
- Steel prices continue upward trend, +3.2% MoM
- New EU regulations on hydraulic fluid disposal coming Q3 2024
- IFPE 2024 show recap and key takeaways
- Market analysis: Construction equipment demand in Europe

Unsubscribe | Manage preferences`,
    receivedDate: "2 days ago",
    isRead: true,
    analysisStatus: "Not Relevant",
    channel: "email",
    threadCount: 1,
    triage: {
      summary: "Industry newsletter - weekly digest about steel prices and hydraulics industry trends. No quote request.",
      isQuoteRequest: false,
    },
  },
  {
    id: "7",
    threadId: "t-007",
    from: { name: "Kenji Tanaka", email: "k.tanaka@komatsu.co.jp" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "RFQ-2024-0892: Hydraulic Cylinder Components",
    snippet: "Please find attached our formal RFQ for hydraulic cylinder components for the PC490 series...",
    body: `Dear Sir/Madam,

Please find below our formal Request for Quotation for hydraulic cylinder components for the Komatsu PC490 series.

RFQ Reference: RFQ-2024-0892

Required components:
- Arm Cylinder Assy (Part# 707-01-0K930) - 80 units
- Boom Cylinder Assy (Part# 707-01-0K920) - 80 units
- Bucket Cylinder Assy (Part# 707-01-0K910) - 80 units

Delivery: FOB Osaka, Japan
Deadline for quotation: March 15, 2024
Expected delivery: Q3 2024

Please provide unit pricing, lead times, and warranty terms.

Best regards,
Kenji Tanaka
Global Procurement Division
Komatsu Ltd.`,
    receivedDate: "3 days ago",
    isRead: true,
    analysisStatus: "Extracting",
    channel: "email",
    threadCount: 2,
    attachments: [
      {
        name: "RFQ-2024-0892.pdf",
        size: "2.2 MB",
        href: "/attachments/rfq-2024-0892.pdf",
      },
      {
        name: "Komatsu_Drawing_Package.zip",
        size: "8.5 MB",
        href: "/attachments/komatsu-drawing-package.zip",
      },
    ],
    triage: {
      summary: "Formal RFQ from Komatsu for PC490 series hydraulic cylinder assemblies. Three product lines, 80 units each. High-value formal procurement with March 15 deadline.",
      isQuoteRequest: true,
    },
  },
  {
    id: "8",
    threadId: "t-008",
    from: { name: "Support Ticket", email: "noreply@zendesk.com" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "[Ticket #4521] Customer reported seal leakage on order #ORD-2023-1847",
    snippet: "A new support ticket has been created. Customer: BuildRight Inc. Issue: Seal leakage on...",
    body: `New Support Ticket Created

Ticket #4521
Customer: BuildRight Inc.
Priority: High
Category: Product Quality

Description:
Customer reports seal leakage on hydraulic cylinders delivered in order #ORD-2023-1847. Requesting replacement seals and technical inspection.

Please respond within 24 hours per SLA.

— Zendesk Notification`,
    receivedDate: "3 days ago",
    isRead: true,
    analysisStatus: "Not Relevant",
    channel: "email",
    threadCount: 5,
    triage: {
      summary: "Support ticket notification about seal leakage issue. This is a customer service matter, not a quote request.",
      isQuoteRequest: false,
    },
  },
  {
    id: "9",
    threadId: "t-009",
    from: { name: "Carlos Mendez", email: "carlos@jcb-latam.com" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "Consulta: Cotización de cilindros para retroexcavadoras JCB 3CX",
    snippet: "Buenos días, necesitamos una cotización para cilindros hidráulicos de la serie JCB 3CX...",
    body: `Buenos días,

Necesitamos una cotización para cilindros hidráulicos para nuestra línea de retroexcavadoras JCB 3CX.

Requerimientos:
- Cilindro de brazo extensible (120 unidades)
- Cilindro de cuchara (120 unidades)
- Cilindro estabilizador (240 unidades)

Plazo de entrega requerido: Abril 2024
Destino: Ciudad de México, México

Favor de enviar cotización a la brevedad.

Saludos,
Carlos Mendez
Gerente de Compras
JCB Latin America`,
    receivedDate: "4 days ago",
    isRead: true,
    analysisStatus: "Processed",
    channel: "email",
    threadCount: 3,
    triage: {
      summary: "JCB Latin America requesting quote for JCB 3CX backhoe loader cylinders. Three product types, 480 units total. Delivery to Mexico City by April 2024.",
      isQuoteRequest: true,
    },
    extraction: {
      accountName: "JCB Latin America",
      contactName: "Carlos Mendez",
      contactEmail: "carlos@jcb-latam.com",
      products: [
        { name: "Extensible Arm Cylinder", quantity: 120, unit: "pcs" },
        { name: "Bucket Cylinder", quantity: 120, unit: "pcs" },
        { name: "Stabilizer Cylinder", quantity: 240, unit: "pcs" },
      ],
      tenderEndDate: "2024-04-30",
      estimatedValue: "$340,000",
    },
  },
  {
    id: "10",
    threadId: "t-010",
    from: { name: "Fatih Özkan", email: "fatih@sanko-makina.com" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "Acil Teklif - Forklift Lift Silindirleri",
    snippet: "Acil olarak forklift lift silindirleri için teklif almak istiyoruz. Detaylar ektedir...",
    body: `Merhaba,

Acil olarak forklift lift silindirleri için teklif almak istiyoruz.

- Forklift Lift Silindir Ø70 (50 adet)
- Forklift Tilt Silindir Ø50 (50 adet)

En kısa sürede dönüş yapmanızı rica ederiz.

Fatih Özkan
Sanko Makina`,
    receivedDate: "5 days ago",
    isRead: true,
    analysisStatus: "Analyzing",
    channel: "email",
    threadCount: 1,
    triage: undefined,
  },
  {
    id: "11",
    threadId: "t-011",
    from: { name: "Recruitment Team", email: "hr@linkedin.com" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "3 new candidates match your Sales Manager job posting",
    snippet: "You have 3 new applicants for your Sales Manager position. Review candidates now...",
    body: `Hi,

You have 3 new candidates who match your Sales Manager job posting:

1. John Smith - 8 years experience
2. Maria Garcia - 5 years experience  
3. Alex Wong - 10 years experience

Review and respond to candidates on LinkedIn.

— LinkedIn Recruiting`,
    receivedDate: "1 week ago",
    isRead: true,
    analysisStatus: "Not Relevant",
    channel: "email",
    threadCount: 1,
    triage: {
      summary: "LinkedIn recruitment notification about job applicants. Not related to sales or quote requests.",
      isQuoteRequest: false,
    },
  },
  {
    id: "12",
    threadId: "t-012",
    from: { name: "Wang Lei", email: "wanglei@sany-group.com" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "Inquiry: Long-term Supply Agreement for Excavator Cylinders",
    snippet: "SANY Group is evaluating suppliers for a 3-year framework agreement on excavator cylinders...",
    body: `Dear Sales Team,

SANY Group is evaluating suppliers for a 3-year framework agreement on excavator hydraulic cylinders.

Annual estimated volumes:
- SY215C Boom Cylinder (2,000 units/year)
- SY215C Arm Cylinder (2,000 units/year)
- SY365H Boom Cylinder (800 units/year)
- SY365H Arm Cylinder (800 units/year)

Total contract period: 2024-2027
Evaluation deadline: February 28, 2024

Please submit your company profile, production capacity details, and indicative pricing.

Best regards,
Wang Lei
Strategic Procurement
SANY Group Co., Ltd.`,
    receivedDate: "1 week ago",
    isRead: true,
    analysisStatus: "New",
    channel: "email",
    threadCount: 6,
  },
  {
    id: "13",
    threadId: "t-013",
    from: { name: "Olga Petrov", email: "o.petrov@belmash.by" },
    to: { name: "Sales Team", email: "sales@crmpro.com" },
    subject: "Price request for telescopic cylinder sets",
    snippet: "Good day, we are looking for a supplier of telescopic hydraulic cylinders for our dump truck...",
    body: `Good day,

We are looking for a supplier of telescopic hydraulic cylinders for our BelAZ dump truck maintenance program.

We need:
- 3-stage Telescopic Cylinder TC-3000 (30 units)
- 4-stage Telescopic Cylinder TC-4500 (20 units)

Could you provide pricing and availability?

Best regards,
Olga Petrov
BelMash Engineering`,
    receivedDate: "1 week ago",
    isRead: false,
    analysisStatus: "New",
    channel: "email",
    threadCount: 1,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStatusBadge(status: EmailAnalysisStatus) {
  switch (status) {
    case "New":
      return <Badge variant="outline">New</Badge>;
    case "Analyzing":
      return (
        <Badge variant="secondary" className="animate-pulse">
          Analyzing
        </Badge>
      );
    case "Not Relevant":
      return <Badge variant="secondary">Not Relevant</Badge>;
    case "Quote Requested":
      return <Badge>Quote Requested</Badge>;
    case "Extracting":
      return (
        <Badge variant="secondary" className="animate-pulse">
          Extracting
        </Badge>
      );
    case "Processed":
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-600">
          Processed
        </Badge>
      );
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EmailsPage() {
  const [selectedEmail, setSelectedEmail] = useState<EmailThread | null>(null);
  const [search, setSearch] = useState("");

  const filtered = emails.filter(
    (e) =>
      e.from.name.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.snippet.toLowerCase().includes(search.toLowerCase())
  );

  const totalEmails = emails.length;
  const unreadCount = emails.filter((e) => !e.isRead).length;
  const quoteCount = emails.filter(
    (e) =>
      e.analysisStatus === "Quote Requested" ||
      e.analysisStatus === "Extracting" ||
      e.analysisStatus === "Processed"
  ).length;
  const processedCount = emails.filter(
    (e) => e.analysisStatus === "Processed"
  ).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium">Emails</h1>
        </div>
      </header>

      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 flex-1"
      >
        {/* ---- Left Panel: Email List ---- */}
        <ResizablePanel defaultSize="35%" minSize="25%" maxSize="50%">
          <div className="flex h-full min-w-0 flex-col overflow-hidden">
            {/* Stats bar */}
            <div className="flex items-center gap-4 border-b px-4 py-3">
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{totalEmails}</span>{" "}
                total
              </span>
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{unreadCount}</span>{" "}
                unread
              </span>
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{quoteCount}</span>{" "}
                quotes
              </span>
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {processedCount}
                </span>{" "}
                processed
              </span>
            </div>

            {/* Search */}
            <div className="border-b px-4 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Email list */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {filtered.map((email) => (
                <button
                  key={email.id}
                  type="button"
                  className={`flex w-full cursor-pointer items-start gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedEmail?.id === email.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <Avatar className="mt-0.5 size-8 shrink-0">
                    <AvatarFallback
                      className={`text-xs font-medium ${
                        !email.isRead
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {getInitials(email.from.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span
                        className={`shrink-0 text-sm ${
                          !email.isRead ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {email.from.name}
                      </span>
                      {email.threadCount > 1 && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          ({email.threadCount})
                        </span>
                      )}
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                        {email.receivedDate}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {email.subject}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* ---- Right Panel: Email Detail ---- */}
        <ResizablePanel defaultSize="65%" minSize="40%">
          <ScrollArea className="h-full">
            {selectedEmail ? (
              <div className="flex min-w-0 flex-col">
                {/* cai Analysis Section */}
                <Collapsible disabled={!selectedEmail.extraction}>
                  {selectedEmail.extraction ? (
                    <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-3 border-b bg-violet-50 px-6 py-3 text-left transition-colors hover:bg-violet-100 dark:bg-violet-950/30 dark:hover:bg-violet-950/50">
                      <Sparkles className="size-4 shrink-0 text-violet-500 dark:text-violet-400" />
                      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                        <Badge variant="outline" className="shrink-0 border-violet-200 bg-white font-semibold text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300">
                          {selectedEmail.extraction.accountName}
                        </Badge>
                        <Badge variant="outline" className="shrink-0 border-violet-200 bg-white font-semibold text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300">
                          {selectedEmail.extraction.contactName}
                        </Badge>
                        {(selectedEmail.extraction.tenderStartDate ||
                          selectedEmail.extraction.tenderEndDate) && (
                          <Badge variant="outline" className="shrink-0 border-violet-200 bg-white font-semibold text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300">
                            {selectedEmail.extraction.tenderStartDate &&
                              `${selectedEmail.extraction.tenderStartDate} — `}
                            {selectedEmail.extraction.tenderEndDate}
                          </Badge>
                        )}
                      </div>
                      {selectedEmail.triage && (
                        <Badge
                          className={`shrink-0 ${
                            selectedEmail.triage.isQuoteRequest
                              ? "bg-violet-600 hover:bg-violet-600"
                              : ""
                          }`}
                          variant={selectedEmail.triage.isQuoteRequest ? "default" : "secondary"}
                        >
                          {selectedEmail.triage.isQuoteRequest ? "Quote Request" : "Not a Quote"}
                        </Badge>
                      )}
                      <ChevronDown className="size-4 shrink-0 text-violet-400 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                    </CollapsibleTrigger>
                  ) : (
                    <div className="flex w-full items-center gap-3 border-b bg-violet-50 px-6 py-3 dark:bg-violet-950/30">
                      <Sparkles className="size-4 shrink-0 text-violet-500 dark:text-violet-400" />
                      {selectedEmail.analysisStatus === "New" && (
                        <Badge variant="outline" className="ml-auto shrink-0 border-violet-200 text-violet-600">
                          Awaiting
                        </Badge>
                      )}
                      {(selectedEmail.analysisStatus === "Analyzing" ||
                        selectedEmail.analysisStatus === "Extracting") && (
                        <Badge variant="secondary" className="ml-auto shrink-0 gap-1">
                          <Loader2 className="size-3 animate-spin" />
                          Analyzing
                        </Badge>
                      )}
                      {selectedEmail.triage &&
                        selectedEmail.analysisStatus !== "Analyzing" &&
                        selectedEmail.analysisStatus !== "Extracting" && (
                        <Badge
                          className={`ml-auto shrink-0 ${
                            selectedEmail.triage.isQuoteRequest
                              ? "bg-violet-600 hover:bg-violet-600"
                              : ""
                          }`}
                          variant={selectedEmail.triage.isQuoteRequest ? "default" : "secondary"}
                        >
                          {selectedEmail.triage.isQuoteRequest ? "Quote Request" : "Not a Quote"}
                        </Badge>
                      )}
                    </div>
                  )}
                  <CollapsibleContent>
                    <div className="border-b bg-violet-50/50 px-6 py-3 dark:bg-violet-950/20">
                      {selectedEmail.extraction && (
                        <div>
                          <div className="rounded-lg border border-violet-200/50 dark:border-violet-800/50">
                            <Table>
                              <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                  <TableHead className="h-8 text-xs">Product</TableHead>
                                  <TableHead className="h-8 text-right text-xs">Qty</TableHead>
                                  <TableHead className="h-8 text-right text-xs">Unit</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedEmail.extraction.products.map((product) => (
                                  <TableRow key={product.name} className="hover:bg-violet-50/50 dark:hover:bg-violet-950/30">
                                    <TableCell className="py-1.5 text-sm">
                                      {product.name}
                                    </TableCell>
                                    <TableCell className="py-1.5 text-right text-sm">
                                      {product.quantity.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-1.5 text-right text-sm text-muted-foreground">
                                      {product.unit}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Email header + body */}
                <div className="flex flex-col gap-6 p-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-lg font-semibold leading-tight">
                        {selectedEmail.subject}
                      </h2>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                          {getInitials(selectedEmail.from.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {selectedEmail.from.name}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            &lt;{selectedEmail.from.email}&gt;
                          </span>
                        </div>
                      <p className="text-xs text-muted-foreground">
                        To: {selectedEmail.to.name} &lt;{selectedEmail.to.email}
                        &gt;
                      </p>
                      {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          {selectedEmail.attachments.map((att) => (
                            <a
                              key={att.name}
                              href={att.href}
                              download
                              className="inline-flex cursor-pointer items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted"
                            >
                              <Paperclip className="size-2.5" />
                              <span className="max-w-36 truncate">{att.name}</span>
                              <span className="text-[10px]">({att.size})</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {selectedEmail.receivedDate}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {selectedEmail.body}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <MailOpen className="mx-auto size-12 text-muted-foreground/40" />
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    Select an email to view details
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
