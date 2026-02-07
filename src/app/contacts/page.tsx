"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  CreditCard,
  DollarSign,
  GitMerge,
  Globe,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ContactStatus = "Active" | "Inactive" | "Pending Approval";

type OpportunityStage =
  | "Prospecting"
  | "Qualification"
  | "Needs Analysis"
  | "Value Proposition"
  | "Id. Decision Makers"
  | "Perception Analysis"
  | "Proposal/Price Quote"
  | "Negotiation/Review"
  | "Closed Won"
  | "Closed Lost";

interface Opportunity {
  name: string;
  amount: string;
  stage: OpportunityStage;
  closeDate: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountId: string;
  accountName: string;
  status: ContactStatus;
  amount: string;
  lastActivityDate: string;
  initials: string;
  phone: string;
  mailingAddress: string;
  website: string;
  industry: string;
  opportunities: Opportunity[];
  description: string[];
  createdDate: string;
}

const initialContacts: Contact[] = [
  {
    id: "con_ad",
    firstName: "Ayşe",
    lastName: "Demir",
    email: "ayse.demir@turktraktor.com.tr",
    accountId: "acc_tt",
    accountName: "Türk Traktör",
    status: "Pending Approval",
    amount: "$185,000",
    lastActivityDate: "2 hours ago",
    initials: "AD",
    phone: "",
    mailingAddress: "",
    website: "turktraktor.com.tr",
    industry: "Heavy Machinery",
    opportunities: [],
    description: ["Auto-created by cai from email analysis"],
    createdDate: "Feb 6, 2024",
  },
  {
    id: "con_my",
    firstName: "Mehmet",
    lastName: "Yılmaz",
    email: "mehmet@caterpillar.com.tr",
    accountId: "acc_cat",
    accountName: "Caterpillar Turkey",
    status: "Pending Approval",
    amount: "$92,000",
    lastActivityDate: "5 hours ago",
    initials: "MY",
    phone: "",
    mailingAddress: "",
    website: "caterpillar.com.tr",
    industry: "Construction Equipment",
    opportunities: [],
    description: ["Auto-created by cai from email analysis"],
    createdDate: "Feb 6, 2024",
  },
  {
    id: "con_cm",
    firstName: "Carlos",
    lastName: "Mendez",
    email: "carlos@jcb-latam.com",
    accountId: "acc_jcb",
    accountName: "JCB Latin America",
    status: "Pending Approval",
    amount: "$340,000",
    lastActivityDate: "4 days ago",
    initials: "CM",
    phone: "",
    mailingAddress: "",
    website: "jcb-latam.com",
    industry: "Construction Equipment",
    opportunities: [],
    description: ["Auto-created by cai from email analysis"],
    createdDate: "Feb 6, 2024",
  },
  {
    id: "con_sj",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@acme.com",
    accountId: "acc_acme",
    accountName: "Acme Corp",
    status: "Active",
    amount: "$12,500",
    lastActivityDate: "2 hours ago",
    initials: "SJ",
    phone: "+1 (555) 123-4567",
    mailingAddress: "San Francisco, CA",
    website: "acme.com",
    industry: "Technology",
    opportunities: [
      { name: "Acme Corp - Enterprise Plan", amount: "$10,000", stage: "Negotiation/Review", closeDate: "2024-06-30" },
      { name: "Acme Corp - Support Add-on", amount: "$2,500", stage: "Closed Won", closeDate: "2024-03-15" },
    ],
    description: [
      "Key decision maker for Q2 expansion",
      "Prefers email communication",
    ],
    createdDate: "Jan 15, 2024",
  },
  {
    id: "con_mc",
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@techstart.io",
    accountId: "acc_ts",
    accountName: "TechStart",
    status: "Active",
    amount: "$8,200",
    lastActivityDate: "1 day ago",
    initials: "MC",
    phone: "+1 (555) 234-5678",
    mailingAddress: "Austin, TX",
    website: "techstart.io",
    industry: "SaaS",
    opportunities: [
      { name: "TechStart - Starter Plan", amount: "$8,200", stage: "Closed Won", closeDate: "2024-04-01" },
    ],
    description: ["Interested in API integrations"],
    createdDate: "Mar 3, 2024",
  },
  {
    id: "con_er",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily@globalfin.com",
    accountId: "acc_gf",
    accountName: "GlobalFin",
    status: "Active",
    amount: "$24,000",
    lastActivityDate: "3 days ago",
    initials: "ER",
    phone: "+1 (555) 345-6789",
    mailingAddress: "New York, NY",
    website: "globalfin.com",
    industry: "Finance",
    opportunities: [
      { name: "GlobalFin - Premium Suite", amount: "$24,000", stage: "Proposal/Price Quote", closeDate: "2024-07-15" },
    ],
    description: ["Needs compliance features", "Budget approval pending"],
    createdDate: "Feb 20, 2024",
  },
  {
    id: "con_jw",
    firstName: "James",
    lastName: "Wilson",
    email: "jwilson@innovate.co",
    accountId: "acc_il",
    accountName: "Innovate Labs",
    status: "Active",
    amount: "$15,750",
    lastActivityDate: "5 hours ago",
    initials: "JW",
    phone: "+1 (555) 456-7890",
    mailingAddress: "Seattle, WA",
    website: "innovate.co",
    industry: "R&D",
    opportunities: [
      { name: "Innovate Labs - Team Plan", amount: "$12,000", stage: "Closed Won", closeDate: "2024-02-28" },
      { name: "Innovate Labs - Analytics Add-on", amount: "$3,750", stage: "Needs Analysis", closeDate: "2024-08-01" },
    ],
    description: ["Champion for internal adoption"],
    createdDate: "Dec 8, 2023",
  },
  {
    id: "con_lt",
    firstName: "Lisa",
    lastName: "Thompson",
    email: "lisa@buildright.com",
    accountId: "acc_br",
    accountName: "BuildRight",
    status: "Inactive",
    amount: "$4,300",
    lastActivityDate: "2 weeks ago",
    initials: "LT",
    phone: "+1 (555) 567-8901",
    mailingAddress: "Chicago, IL",
    website: "buildright.com",
    industry: "Construction",
    opportunities: [
      { name: "BuildRight - Basic Plan", amount: "$4,300", stage: "Closed Lost", closeDate: "2024-01-15" },
    ],
    description: ["Lost due to budget cuts", "May return Q3"],
    createdDate: "Nov 12, 2023",
  },
  {
    id: "con_dk",
    firstName: "David",
    lastName: "Kim",
    email: "dkim@nextera.io",
    accountId: "acc_ne",
    accountName: "NextEra",
    status: "Active",
    amount: "$31,000",
    lastActivityDate: "1 hour ago",
    initials: "DK",
    phone: "+1 (555) 678-9012",
    mailingAddress: "Los Angeles, CA",
    website: "nextera.io",
    industry: "Energy",
    opportunities: [
      { name: "NextEra - Enterprise Plan", amount: "$25,000", stage: "Closed Won", closeDate: "2024-01-10" },
      { name: "NextEra - Custom Integration", amount: "$6,000", stage: "Negotiation/Review", closeDate: "2024-09-01" },
    ],
    description: ["VIP account", "Quarterly business reviews scheduled"],
    createdDate: "Oct 5, 2023",
  },
  {
    id: "con_ak",
    firstName: "Anna",
    lastName: "Kowalski",
    email: "anna@eurodesign.eu",
    accountId: "acc_ed",
    accountName: "EuroDesign",
    status: "Active",
    amount: "$9,800",
    lastActivityDate: "4 days ago",
    initials: "AK",
    phone: "+48 22 123 4567",
    mailingAddress: "Warsaw, Poland",
    website: "eurodesign.eu",
    industry: "Design",
    opportunities: [
      { name: "EuroDesign - Pro Plan", amount: "$9,800", stage: "Proposal/Price Quote", closeDate: "2024-08-15" },
    ],
    description: ["EU data residency required"],
    createdDate: "Apr 18, 2024",
  },
  {
    id: "con_rg",
    firstName: "Robert",
    lastName: "Garcia",
    email: "rgarcia@solarwind.com",
    accountId: "acc_sw",
    accountName: "SolarWind",
    status: "Active",
    amount: "$18,400",
    lastActivityDate: "6 hours ago",
    initials: "RG",
    phone: "+1 (555) 789-0123",
    mailingAddress: "Denver, CO",
    website: "solarwind.com",
    industry: "Renewable Energy",
    opportunities: [
      { name: "SolarWind - Growth Plan", amount: "$15,000", stage: "Closed Won", closeDate: "2024-03-01" },
      { name: "SolarWind - Training Package", amount: "$3,400", stage: "Qualification", closeDate: "2024-10-01" },
    ],
    description: ["Expanding to 3 new offices"],
    createdDate: "Sep 22, 2023",
  },
  {
    id: "con_pp",
    firstName: "Priya",
    lastName: "Patel",
    email: "priya@cloudnine.dev",
    accountId: "acc_cn",
    accountName: "CloudNine",
    status: "Active",
    amount: "$22,100",
    lastActivityDate: "Yesterday",
    initials: "PP",
    phone: "+1 (555) 890-1234",
    mailingAddress: "Boston, MA",
    website: "cloudnine.dev",
    industry: "Cloud Services",
    opportunities: [
      { name: "CloudNine - Scale Plan", amount: "$22,100", stage: "Closed Won", closeDate: "2024-04-15" },
    ],
    description: ["Referred by David Kim", "Wants annual billing discount"],
    createdDate: "Jan 30, 2024",
  },
  {
    id: "con_ta",
    firstName: "Tom",
    lastName: "Anderson",
    email: "tom@steelbridge.co",
    accountId: "acc_sb",
    accountName: "SteelBridge",
    status: "Inactive",
    amount: "$6,700",
    lastActivityDate: "1 month ago",
    initials: "TA",
    phone: "+1 (555) 901-2345",
    mailingAddress: "Detroit, MI",
    website: "steelbridge.co",
    industry: "Manufacturing",
    opportunities: [
      { name: "SteelBridge - Basic Plan", amount: "$6,700", stage: "Closed Lost", closeDate: "2023-12-01" },
    ],
    description: ["Contract expired", "Follow up in 6 months"],
    createdDate: "Aug 14, 2023",
  },
];

const statusVariant: Record<
  ContactStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Active: "default",
  Inactive: "secondary",
  "Pending Approval": "outline",
};

const stats = [
  { label: "Total Contacts", value: "2,847", change: "+12.5%", icon: Users },
  { label: "Active", value: "2,103", change: "+8.2%", icon: UserCheck },
  {
    label: "Open Pipeline",
    value: "$482,500",
    change: "+18.7%",
    icon: DollarSign,
  },
  { label: "New This Month", value: "147", change: "+24.1%", icon: UserPlus },
];

type SheetView = "approval" | "search" | "merge";

type MergeableField = "firstName" | "lastName" | "email" | "phone" | "accountName" | "mailingAddress" | "website" | "industry";

const MERGEABLE_FIELDS: { key: MergeableField; label: string }[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "accountName", label: "Account Name" },
  { key: "industry", label: "Industry" },
  { key: "website", label: "Website" },
];

function getConflictType(existing: string, incoming: string): "same" | "one-empty" | "conflict" {
  const a = existing?.trim() || "";
  const b = incoming?.trim() || "";
  if (a === b) return "same";
  if (!a || !b) return "one-empty";
  return "conflict";
}

export default function ContactsPage() {
  const [contactList, setContactList] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editForm, setEditForm] = useState<Partial<Contact>>({});
  const [sheetView, setSheetView] = useState<SheetView>("approval");
  const [mergeTarget, setMergeTarget] = useState<Contact | null>(null);
  const [mergeSearch, setMergeSearch] = useState("");
  const [mergeForm, setMergeForm] = useState<Record<MergeableField, string>>({} as Record<MergeableField, string>);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setSheetView("approval");
    setMergeTarget(null);
    setMergeSearch("");
    setEditForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      accountName: contact.accountName,
      website: contact.website,
      industry: contact.industry,
    });
  };

  const handleStartMergeSearch = () => {
    setSheetView("search");
    setMergeSearch("");
  };

  const handleSelectMergeTarget = (target: Contact) => {
    setMergeTarget(target);
    setSheetView("merge");
    // Auto-resolve merge form: prefer non-empty, default to cai value on conflict
    const resolved = {} as Record<MergeableField, string>;
    for (const { key } of MERGEABLE_FIELDS) {
      const existingVal = target[key]?.trim() || "";
      const caiVal = (selectedContact?.[key] as string)?.trim() || "";
      const conflict = getConflictType(existingVal, caiVal);
      if (conflict === "same") resolved[key] = existingVal;
      else if (conflict === "one-empty") resolved[key] = existingVal || caiVal;
      else resolved[key] = caiVal;
    }
    setMergeForm(resolved);
  };

  const handleMerge = () => {
    if (!selectedContact || !mergeTarget) return;
    setContactList((prev) =>
      prev
        .map((c) =>
          c.id === mergeTarget.id
            ? {
                ...c,
                ...mergeForm,
                initials: `${mergeForm.firstName[0]}${mergeForm.lastName[0]}`.toUpperCase(),
              }
            : c
        )
        .filter((c) => c.id !== selectedContact.id)
    );
    setSelectedContact(null);
    setSheetView("approval");
    setMergeTarget(null);
  };

  const filteredMergeContacts = contactList.filter((c) => {
    if (c.id === selectedContact?.id) return false;
    if (c.status === "Pending Approval") return false;
    if (!mergeSearch) return true;
    const q = mergeSearch.toLowerCase();
    return (
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.accountName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const handleApprove = () => {
    if (!selectedContact) return;
    setContactList((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id
          ? {
              ...c,
              ...editForm,
              status: "Active" as ContactStatus,
              initials: `${(editForm.firstName || c.firstName)[0]}${(editForm.lastName || c.lastName)[0]}`.toUpperCase(),
            }
          : c
      )
    );
    setSelectedContact(null);
  };

  const handleReject = () => {
    if (!selectedContact) return;
    setContactList((prev) =>
      prev.filter((c) => c.id !== selectedContact.id)
    );
    setSelectedContact(null);
  };

  const updateField = (field: keyof Contact, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium">Contacts</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between pt-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
            <p className="text-muted-foreground">
              Manage your contacts, accounts, and opportunity pipeline.
            </p>
          </div>
          <Button className="cursor-pointer">
            <Plus className="mr-2 size-4" />
            New Contact
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <stat.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span className="text-xs font-medium text-emerald-600">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search contacts..." className="pl-9" />
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Contact Name</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-[50px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactList.map((contact) => (
                <TableRow
                  key={contact.id}
                  className={`cursor-pointer ${contact.status === "Pending Approval" ? "bg-violet-50/50 hover:bg-violet-50 dark:bg-violet-950/20 dark:hover:bg-violet-950/30" : ""}`}
                  onClick={() => handleSelectContact(contact)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {contact.status === "Pending Approval" && (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                          <Sparkles className="size-4 text-violet-600" />
                        </div>
                      )}
                      {contact.status !== "Pending Approval" && (
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                            {contact.initials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="font-medium leading-none">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.accountName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariant[contact.status]}
                      className={contact.status === "Pending Approval" ? "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/30 dark:text-violet-400" : ""}
                    >
                      {contact.status === "Pending Approval" ? "Pending Approval" : contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {contact.amount}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.lastActivityDate}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          View Record
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          Edit Contact
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">10</span> of{" "}
              <span className="font-medium">2,847</span> contacts
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Sheet
        open={!!selectedContact}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedContact(null);
            setSheetView("approval");
            setMergeTarget(null);
            setMergeSearch("");
          }
        }}
      >
        <SheetContent className={`overflow-y-auto ${sheetView === "merge" ? "sm:max-w-2xl" : "sm:max-w-md"}`}>
          {selectedContact && selectedContact.status === "Pending Approval" && sheetView === "approval" && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                    <Sparkles className="size-5 text-violet-600" />
                  </div>
                  <div>
                    <SheetTitle>
                      {selectedContact.firstName} {selectedContact.lastName}
                    </SheetTitle>
                    <SheetDescription>
                      {selectedContact.accountName}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-4 px-4 pb-4">
                <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-800 dark:bg-violet-950/30">
                  <Sparkles className="size-4 shrink-0 text-violet-600" />
                  <p className="text-sm font-medium text-violet-800 dark:text-violet-300">
                    Created by cai · Awaiting your review
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">First Name</label>
                      <Input
                        value={editForm.firstName || ""}
                        onChange={(e) => updateField("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                      <Input
                        value={editForm.lastName || ""}
                        onChange={(e) => updateField("lastName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Email</label>
                    <Input
                      value={editForm.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Phone</label>
                    <Input
                      value={editForm.phone || ""}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="Not provided"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Account Name</label>
                    <Input
                      value={editForm.accountName || ""}
                      onChange={(e) => updateField("accountName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Industry</label>
                    <Input
                      value={editForm.industry || ""}
                      onChange={(e) => updateField("industry", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Website</label>
                    <Input
                      value={editForm.website || ""}
                      onChange={(e) => updateField("website", e.target.value)}
                    />
                  </div>


                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                    onClick={handleReject}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 cursor-pointer bg-violet-600 text-white hover:bg-violet-700"
                    onClick={handleStartMergeSearch}
                  >
                    <GitMerge className="mr-2 size-4" />
                    Merge with...
                  </Button>
                  <Button
                    className="flex-1 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={handleApprove}
                  >
                    <Check className="mr-2 size-4" />
                    Approve
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedContact && selectedContact.status === "Pending Approval" && sheetView === "search" && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 cursor-pointer"
                    onClick={() => setSheetView("approval")}
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <div>
                    <SheetTitle>Merge with Existing</SheetTitle>
                    <SheetDescription>
                      Select a contact to merge with {selectedContact.firstName} {selectedContact.lastName}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-3 px-4 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-9"
                    value={mergeSearch}
                    onChange={(e) => setMergeSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  {filteredMergeContacts.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No contacts found
                    </p>
                  )}
                  {filteredMergeContacts.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                      onClick={() => handleSelectMergeTarget(contact)}
                    >
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {contact.accountName} · {contact.email}
                        </p>
                      </div>
                      <Badge variant={statusVariant[contact.status]} className="shrink-0">
                        {contact.status}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedContact && selectedContact.status === "Pending Approval" && sheetView === "merge" && mergeTarget && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 cursor-pointer"
                    onClick={() => {
                      setSheetView("search");
                      setMergeTarget(null);
                    }}
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <div className="flex-1">
                    <SheetTitle>Merge Contacts</SheetTitle>
                    <SheetDescription>
                      cai data will overwrite the existing record
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-4 px-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2.5 dark:border-violet-800 dark:bg-violet-950/30">
                    <Sparkles className="size-4 shrink-0 text-violet-600" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-violet-700 dark:text-violet-300">{selectedContact.firstName} {selectedContact.lastName}</p>
                      <p className="truncate text-[10px] text-violet-600/70 dark:text-violet-400/70">cai · {selectedContact.accountName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border px-3 py-2.5">
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                        {mergeTarget.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{mergeTarget.firstName} {mergeTarget.lastName}</p>
                      <p className="truncate text-[10px] text-muted-foreground">Existing · {mergeTarget.accountName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  {MERGEABLE_FIELDS.map(({ key, label }) => {
                    const caiVal = (selectedContact[key] as string)?.trim() || "";
                    const existingVal = mergeTarget[key]?.trim() || "";
                    const isDifferent = existingVal !== caiVal && !!caiVal;

                    return (
                      <div key={key} className={`grid grid-cols-2 gap-3 rounded-lg px-1 py-2 ${isDifferent ? "bg-violet-50/30 dark:bg-violet-950/10" : ""}`}>
                        <div>
                          <div className="mb-1 flex items-center gap-1">
                            <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
                            {isDifferent && <Zap className="size-2.5 text-violet-500" />}
                          </div>
                          <div className={`rounded-md border border-dashed border-violet-200 px-2.5 py-1.5 text-xs dark:border-violet-800 ${!caiVal ? "text-muted-foreground" : "text-foreground"}`}>
                            {caiVal || "—"}
                          </div>
                        </div>

                        <div>
                          <p className="mb-1 text-[10px] font-medium text-muted-foreground">{label}</p>
                          <Input
                            className="h-auto px-2.5 py-1.5 text-xs"
                            value={mergeForm[key] || ""}
                            onChange={(e) => setMergeForm((prev) => ({ ...prev, [key]: e.target.value }))}
                            placeholder="—"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {mergeTarget.accountId !== selectedContact.accountId && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
                      <Building2 className="size-4 shrink-0 text-amber-600" />
                      <div className="flex items-center gap-1.5 text-sm font-medium text-amber-800 dark:text-amber-300">
                        <span>{selectedContact.accountName}</span>
                        <ArrowRight className="size-3.5" />
                        <span>{mergeTarget.accountName}</span>
                      </div>
                    </div>
                  </>
                )}

                {selectedContact.opportunities.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">
                          cai Opportunities ({selectedContact.opportunities.length})
                        </p>
                        <div className="flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 dark:border-violet-800 dark:bg-violet-950/30">
                          <ArrowRight className="size-3 text-violet-600" />
                          <span className="text-[10px] font-medium text-violet-700 dark:text-violet-300">
                            Transferring to {mergeTarget.firstName} {mergeTarget.lastName}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-lg border border-violet-100 dark:border-violet-900">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="h-8 text-xs">Name</TableHead>
                              <TableHead className="h-8 text-xs">Stage</TableHead>
                              <TableHead className="h-8 text-right text-xs">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedContact.opportunities.map((opp) => (
                              <TableRow key={opp.name}>
                                <TableCell className="py-1.5 text-xs">{opp.name}</TableCell>
                                <TableCell className="py-1.5">
                                  <Badge variant="outline" className="text-[10px]">{opp.stage}</Badge>
                                </TableCell>
                                <TableCell className="py-1.5 text-right text-xs font-medium">{opp.amount}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </>
                )}

                {mergeTarget.opportunities.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">
                          Existing Opportunities ({mergeTarget.opportunities.length})
                        </p>
                        <div className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 dark:border-emerald-800 dark:bg-emerald-950/30">
                          <Check className="size-3 text-emerald-600" />
                          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                            Stays in {mergeTarget.firstName} {mergeTarget.lastName}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="h-8 text-xs">Name</TableHead>
                              <TableHead className="h-8 text-xs">Stage</TableHead>
                              <TableHead className="h-8 text-right text-xs">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mergeTarget.opportunities.map((opp) => (
                              <TableRow key={opp.name}>
                                <TableCell className="py-1.5 text-xs">{opp.name}</TableCell>
                                <TableCell className="py-1.5">
                                  <Badge variant="outline" className="text-[10px]">{opp.stage}</Badge>
                                </TableCell>
                                <TableCell className="py-1.5 text-right text-xs font-medium">{opp.amount}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="cursor-pointer border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                    onClick={handleReject}
                  >
                    <X className="mr-2 size-4" />
                    Reject
                  </Button>
                  <Button
                    className="cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={handleMerge}
                  >
                    <GitMerge className="mr-2 size-4" />
                    Merge
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedContact && selectedContact.status !== "Pending Approval" && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                      {selectedContact.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>
                      {selectedContact.firstName} {selectedContact.lastName}
                    </SheetTitle>
                    <SheetDescription>
                      {selectedContact.accountName}
                    </SheetDescription>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant={statusVariant[selectedContact.status]}>
                    {selectedContact.status}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-2 px-4 pb-4">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-muted-foreground" />
                      Contact Details
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-3 px-1 pt-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="size-4 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {selectedContact.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="size-4 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {selectedContact.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="size-4 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {selectedContact.mailingAddress}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="size-4 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {selectedContact.website}
                        </span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      Account Information
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-3 px-1 pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Account Name</span>
                        <span className="font-medium">
                          {selectedContact.accountName}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Industry</span>
                        <span className="font-medium">
                          {selectedContact.industry}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Created Date
                        </span>
                        <span className="font-medium">
                          {selectedContact.createdDate}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total Amount
                        </span>
                        <span className="font-medium">
                          {selectedContact.amount}
                        </span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-muted-foreground" />
                      Opportunities ({selectedContact.opportunities.length})
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 px-1 pt-3">
                      {selectedContact.opportunities.map((opp) => (
                        <div
                          key={opp.name}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{opp.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {opp.stage} &middot; Close {opp.closeDate}
                            </p>
                          </div>
                          <span className="text-sm font-semibold">
                            {opp.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      Description ({selectedContact.description.length})
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 px-1 pt-3">
                      {selectedContact.description.map((note, i) => (
                        <div
                          key={i}
                          className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground"
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
