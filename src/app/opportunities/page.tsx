"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  CircleDot,
  CreditCard,
  DollarSign,
  GitMerge,
  Globe,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  User,
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

type OpportunityStatus = "Active" | "Inactive" | "Pending Approval";

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
  id: string;
  name: string;
  amount: string;
  stage: OpportunityStage;
  closeDate: string;
  probability: string;
  accountId: string;
  accountName: string;
  contactId: string;
  contactName: string;
  status: OpportunityStatus;
  lastActivityDate: string;
  initials: string;
  description: string[];
  createdDate: string;
}

type SheetView = "detail" | "approval" | "search" | "merge";

type MergeableField = "name" | "amount" | "stage" | "probability" | "closeDate" | "accountName" | "contactName";

const MERGEABLE_FIELDS: { key: MergeableField; label: string }[] = [
  { key: "name", label: "Opportunity Name" },
  { key: "amount", label: "Amount" },
  { key: "stage", label: "Stage" },
  { key: "probability", label: "Probability" },
  { key: "closeDate", label: "Close Date" },
  { key: "accountName", label: "Account Name" },
  { key: "contactName", label: "Contact Name" },
];

function getConflictType(existing: string, incoming: string): "same" | "one-empty" | "conflict" {
  const a = existing?.trim() || "";
  const b = incoming?.trim() || "";
  if (a === b) return "same";
  if (!a || !b) return "one-empty";
  return "conflict";
}

const initialOpportunities: Opportunity[] = [
  {
    id: "opp_1",
    name: "Türk Traktör - Fleet Management System",
    amount: "$185,000",
    stage: "Prospecting",
    closeDate: "2024-08-15",
    probability: "20%",
    accountId: "acc_tt",
    accountName: "Türk Traktör",
    contactId: "con_ad",
    contactName: "Ayşe Demir",
    status: "Pending Approval",
    lastActivityDate: "2 hours ago",
    initials: "TT",
    description: ["Auto-created by cai from email analysis"],
    createdDate: "Feb 6, 2024",
  },
  {
    id: "opp_2",
    name: "Caterpillar TR - Parts Portal",
    amount: "$92,000",
    stage: "Qualification",
    closeDate: "2024-09-01",
    probability: "30%",
    accountId: "acc_cat",
    accountName: "Caterpillar Turkey",
    contactId: "con_my",
    contactName: "Mehmet Yılmaz",
    status: "Pending Approval",
    lastActivityDate: "5 hours ago",
    initials: "CT",
    description: ["Auto-created by cai from email analysis"],
    createdDate: "Feb 6, 2024",
  },
  {
    id: "opp_3",
    name: "JCB LATAM - Dealer Network Platform",
    amount: "$340,000",
    stage: "Needs Analysis",
    closeDate: "2024-10-15",
    probability: "40%",
    accountId: "acc_jcb",
    accountName: "JCB Latin America",
    contactId: "con_cm",
    contactName: "Carlos Mendez",
    status: "Pending Approval",
    lastActivityDate: "4 days ago",
    initials: "JL",
    description: ["Auto-created by cai from email analysis"],
    createdDate: "Feb 6, 2024",
  },
  {
    id: "opp_4",
    name: "Acme Corp - Enterprise Plan",
    amount: "$10,000",
    stage: "Negotiation/Review",
    closeDate: "2024-06-30",
    probability: "80%",
    accountId: "acc_acme",
    accountName: "Acme Corp",
    contactId: "con_sj",
    contactName: "Sarah Johnson",
    status: "Active",
    lastActivityDate: "2 hours ago",
    initials: "AC",
    description: ["Key enterprise account", "Expanding to EU markets"],
    createdDate: "Jan 15, 2024",
  },
  {
    id: "opp_5",
    name: "Acme Corp - Support Add-on",
    amount: "$2,500",
    stage: "Closed Won",
    closeDate: "2024-03-15",
    probability: "100%",
    accountId: "acc_acme",
    accountName: "Acme Corp",
    contactId: "con_sj",
    contactName: "Sarah Johnson",
    status: "Active",
    lastActivityDate: "1 week ago",
    initials: "AC",
    description: ["Support tier upgrade"],
    createdDate: "Feb 1, 2024",
  },
  {
    id: "opp_6",
    name: "TechStart - Starter Plan",
    amount: "$5,200",
    stage: "Qualification",
    closeDate: "2024-07-15",
    probability: "30%",
    accountId: "acc_ts",
    accountName: "TechStart",
    contactId: "con_mc",
    contactName: "Michael Chen",
    status: "Active",
    lastActivityDate: "1 day ago",
    initials: "TS",
    description: ["Interested in API integrations"],
    createdDate: "Mar 3, 2024",
  },
  {
    id: "opp_7",
    name: "GlobalFin - Compliance Module",
    amount: "$18,000",
    stage: "Proposal/Price Quote",
    closeDate: "2024-08-01",
    probability: "60%",
    accountId: "acc_gf",
    accountName: "GlobalFin",
    contactId: "con_er",
    contactName: "Emily Rodriguez",
    status: "Active",
    lastActivityDate: "3 days ago",
    initials: "GF",
    description: ["Needs compliance features", "Budget approval pending"],
    createdDate: "Feb 20, 2024",
  },
  {
    id: "opp_8",
    name: "Innovate Labs - Pro Plan",
    amount: "$12,000",
    stage: "Negotiation/Review",
    closeDate: "2024-05-20",
    probability: "75%",
    accountId: "acc_il",
    accountName: "Innovate Labs",
    contactId: "con_jw",
    contactName: "James Wilson",
    status: "Active",
    lastActivityDate: "5 hours ago",
    initials: "IL",
    description: ["Champion for internal adoption"],
    createdDate: "Dec 8, 2023",
  },
  {
    id: "opp_9",
    name: "BuildRight - Basic Plan",
    amount: "$4,300",
    stage: "Closed Lost",
    closeDate: "2024-03-01",
    probability: "0%",
    accountId: "acc_br",
    accountName: "BuildRight",
    contactId: "con_lt",
    contactName: "Lisa Thompson",
    status: "Inactive",
    lastActivityDate: "2 weeks ago",
    initials: "BR",
    description: ["Lost due to budget cuts", "May return Q3"],
    createdDate: "Nov 12, 2023",
  },
  {
    id: "opp_10",
    name: "NextEra - Enterprise Suite",
    amount: "$25,000",
    stage: "Closed Won",
    closeDate: "2024-01-30",
    probability: "100%",
    accountId: "acc_ne",
    accountName: "NextEra",
    contactId: "con_dk",
    contactName: "David Kim",
    status: "Active",
    lastActivityDate: "1 hour ago",
    initials: "NE",
    description: ["VIP account", "Quarterly business reviews scheduled"],
    createdDate: "Oct 5, 2023",
  },
  {
    id: "opp_11",
    name: "SolarWind - Growth Plan",
    amount: "$14,000",
    stage: "Closed Won",
    closeDate: "2023-11-15",
    probability: "100%",
    accountId: "acc_sw",
    accountName: "SolarWind",
    contactId: "con_rg",
    contactName: "Robert Garcia",
    status: "Active",
    lastActivityDate: "6 hours ago",
    initials: "SW",
    description: ["Expanding to 3 new offices"],
    createdDate: "Sep 22, 2023",
  },
  {
    id: "opp_12",
    name: "CloudNine - Annual License",
    amount: "$18,000",
    stage: "Closed Won",
    closeDate: "2024-02-15",
    probability: "100%",
    accountId: "acc_cn",
    accountName: "CloudNine",
    contactId: "con_pp",
    contactName: "Priya Patel",
    status: "Active",
    lastActivityDate: "Yesterday",
    initials: "CN",
    description: ["Referred by David Kim", "Wants annual billing discount"],
    createdDate: "Jan 30, 2024",
  },
  {
    id: "opp_13",
    name: "SteelBridge - Enterprise Plan",
    amount: "$6,700",
    stage: "Closed Lost",
    closeDate: "2023-12-01",
    probability: "0%",
    accountId: "acc_sb",
    accountName: "SteelBridge",
    contactId: "con_ta",
    contactName: "Tom Anderson",
    status: "Inactive",
    lastActivityDate: "1 month ago",
    initials: "SB",
    description: ["Contract expired", "Follow up in 6 months"],
    createdDate: "Aug 14, 2023",
  },
];

const statusVariant: Record<
  OpportunityStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Active: "default",
  Inactive: "secondary",
  "Pending Approval": "outline",
};

const stats = [
  { label: "Total Opportunities", value: "847", change: "+10.3%", icon: CircleDot },
  { label: "Open Pipeline", value: "$2.4M", change: "+15.8%", icon: DollarSign },
  { label: "Won This Quarter", value: "$892K", change: "+22.1%", icon: TrendingUp },
  { label: "Avg Deal Size", value: "$28.5K", change: "+5.4%", icon: Target },
];

export default function OpportunitiesPage() {
  const [opportunityList, setOpportunityList] = useState<Opportunity[]>(initialOpportunities);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [editForm, setEditForm] = useState<Partial<Opportunity>>({});
  const [sheetView, setSheetView] = useState<SheetView>("detail");
  const [mergeTarget, setMergeTarget] = useState<Opportunity | null>(null);
  const [mergeSearch, setMergeSearch] = useState("");
  const [mergeForm, setMergeForm] = useState<Record<MergeableField, string>>({} as Record<MergeableField, string>);

  const handleSelectOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setSheetView(opportunity.status === "Pending Approval" ? "approval" : "detail");
    setMergeTarget(null);
    setMergeSearch("");
    setEditForm({
      name: opportunity.name,
      amount: opportunity.amount,
      stage: opportunity.stage,
      probability: opportunity.probability,
      closeDate: opportunity.closeDate,
      accountName: opportunity.accountName,
      contactName: opportunity.contactName,
    });
  };

  const handleApprove = () => {
    if (!selectedOpportunity) return;
    setOpportunityList((prev) =>
      prev.map((o) =>
        o.id === selectedOpportunity.id
          ? {
              ...o,
              ...editForm,
              status: "Active" as OpportunityStatus,
              initials: (editForm.name || o.name).split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
            }
          : o
      )
    );
    setSelectedOpportunity(null);
  };

  const handleReject = () => {
    if (!selectedOpportunity) return;
    setOpportunityList((prev) =>
      prev.filter((o) => o.id !== selectedOpportunity.id)
    );
    setSelectedOpportunity(null);
  };

  const updateField = (field: keyof Opportunity, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartMergeSearch = () => {
    setSheetView("search");
    setMergeSearch("");
  };

  const handleSelectMergeTarget = (target: Opportunity) => {
    setMergeTarget(target);
    setSheetView("merge");
    const resolved = {} as Record<MergeableField, string>;
    for (const { key } of MERGEABLE_FIELDS) {
      const existingVal = target[key]?.trim() || "";
      const caiVal = (selectedOpportunity?.[key] as string)?.trim() || "";
      const conflict = getConflictType(existingVal, caiVal);
      if (conflict === "same") resolved[key] = existingVal;
      else if (conflict === "one-empty") resolved[key] = existingVal || caiVal;
      else resolved[key] = caiVal;
    }
    setMergeForm(resolved);
  };

  const handleMerge = () => {
    if (!selectedOpportunity || !mergeTarget) return;
    setOpportunityList((prev) =>
      prev
        .map((o) =>
          o.id === mergeTarget.id
            ? {
                ...o,
                ...mergeForm,
                stage: mergeForm.stage as OpportunityStage,
                initials: mergeForm.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
              }
            : o
        )
        .filter((o) => o.id !== selectedOpportunity.id)
    );
    setSelectedOpportunity(null);
    setSheetView("detail");
    setMergeTarget(null);
  };

  const filteredMergeOpportunities = opportunityList.filter((o) => {
    if (o.id === selectedOpportunity?.id) return false;
    if (o.status === "Pending Approval") return false;
    if (!mergeSearch) return true;
    const q = mergeSearch.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.accountName.toLowerCase().includes(q) ||
      o.contactName.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium">Opportunities</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between pt-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Opportunities</h2>
            <p className="text-muted-foreground">
              Manage your sales pipeline, deals, and revenue forecasts.
            </p>
          </div>
          <Button className="cursor-pointer">
            <Plus className="mr-2 size-4" />
            New Opportunity
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
            <Input placeholder="Search opportunities..." className="pl-9" />
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Opportunity Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead className="w-[50px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunityList.map((opportunity) => (
                <TableRow
                  key={opportunity.id}
                  className={`cursor-pointer ${opportunity.status === "Pending Approval" ? "bg-violet-50/50 hover:bg-violet-50 dark:bg-violet-950/20 dark:hover:bg-violet-950/30" : ""}`}
                  onClick={() => handleSelectOpportunity(opportunity)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {opportunity.status === "Pending Approval" ? (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                          <Sparkles className="size-4 text-violet-600" />
                        </div>
                      ) : (
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                            {opportunity.initials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="font-medium leading-none">
                          {opportunity.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {opportunity.accountName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {opportunity.contactName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {opportunity.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {opportunity.amount}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {opportunity.closeDate}
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
                          Edit Opportunity
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
              Showing <span className="font-medium">{opportunityList.length}</span> of{" "}
              <span className="font-medium">847</span> opportunities
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="cursor-pointer">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Sheet
        open={!!selectedOpportunity}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOpportunity(null);
            setSheetView("detail");
            setMergeTarget(null);
            setMergeSearch("");
          }
        }}
      >
        <SheetContent className={`overflow-y-auto ${sheetView === "merge" ? "sm:max-w-2xl" : "sm:max-w-md"}`}>
          {selectedOpportunity && selectedOpportunity.status === "Pending Approval" && sheetView === "approval" && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                    <Sparkles className="size-5 text-violet-600" />
                  </div>
                  <div>
                    <SheetTitle>{selectedOpportunity.name}</SheetTitle>
                    <SheetDescription>{selectedOpportunity.accountName}</SheetDescription>
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
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Opportunity Name</label>
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Amount</label>
                      <Input
                        value={editForm.amount || ""}
                        onChange={(e) => updateField("amount", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Probability</label>
                      <Input
                        value={editForm.probability || ""}
                        onChange={(e) => updateField("probability", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Stage</label>
                    <Input
                      value={(editForm.stage as string) || ""}
                      onChange={(e) => updateField("stage", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Close Date</label>
                    <Input
                      value={editForm.closeDate || ""}
                      onChange={(e) => updateField("closeDate", e.target.value)}
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
                    <label className="text-xs font-medium text-muted-foreground">Contact Name</label>
                    <Input
                      value={editForm.contactName || ""}
                      onChange={(e) => updateField("contactName", e.target.value)}
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

          {selectedOpportunity && selectedOpportunity.status === "Pending Approval" && sheetView === "search" && (
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
                      Select an opportunity to merge with {selectedOpportunity.name}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-3 px-4 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search opportunities..."
                    className="pl-9"
                    value={mergeSearch}
                    onChange={(e) => setMergeSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  {filteredMergeOpportunities.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No opportunities found
                    </p>
                  )}
                  {filteredMergeOpportunities.map((opportunity) => (
                    <button
                      key={opportunity.id}
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                      onClick={() => handleSelectMergeTarget(opportunity)}
                    >
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                          {opportunity.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {opportunity.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {opportunity.accountName} · {opportunity.contactName}
                        </p>
                      </div>
                      <Badge variant={statusVariant[opportunity.status]} className="shrink-0">
                        {opportunity.status}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedOpportunity && selectedOpportunity.status === "Pending Approval" && sheetView === "merge" && mergeTarget && (
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
                    <SheetTitle>Merge Opportunities</SheetTitle>
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
                      <p className="truncate text-xs font-semibold text-violet-700 dark:text-violet-300">{selectedOpportunity.name}</p>
                      <p className="truncate text-[10px] text-violet-600/70 dark:text-violet-400/70">Created by cai</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border px-3 py-2.5">
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                        {mergeTarget.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{mergeTarget.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">Existing Record</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  {MERGEABLE_FIELDS.map(({ key, label }) => {
                    const caiVal = (selectedOpportunity[key] as string)?.trim() || "";
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

                {mergeTarget.accountId !== selectedOpportunity.accountId && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
                      <Building2 className="size-4 shrink-0 text-amber-600" />
                      <div className="flex items-center gap-1.5 text-sm font-medium text-amber-800 dark:text-amber-300">
                        <span>{selectedOpportunity.accountName}</span>
                        <ArrowRight className="size-3.5" />
                        <span>{mergeTarget.accountName}</span>
                      </div>
                    </div>
                  </>
                )}

                {mergeTarget.contactId !== selectedOpportunity.contactId && (
                  <>
                    {mergeTarget.accountId === selectedOpportunity.accountId && <Separator />}
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
                      <User className="size-4 shrink-0 text-amber-600" />
                      <div className="flex items-center gap-1.5 text-sm font-medium text-amber-800 dark:text-amber-300">
                        <span>{selectedOpportunity.contactName}</span>
                        <ArrowRight className="size-3.5" />
                        <span>{mergeTarget.contactName}</span>
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

          {selectedOpportunity && selectedOpportunity.status !== "Pending Approval" && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                      {selectedOpportunity.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{selectedOpportunity.name}</SheetTitle>
                    <SheetDescription>{selectedOpportunity.accountName}</SheetDescription>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant={statusVariant[selectedOpportunity.status]}>
                    {selectedOpportunity.status}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-2 px-4 pb-4">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-muted-foreground" />
                      Opportunity Details
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-3 px-1 pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Stage</span>
                        <Badge variant="outline">{selectedOpportunity.stage}</Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">{selectedOpportunity.amount}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Probability</span>
                        <span className="font-medium">{selectedOpportunity.probability}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Close Date</span>
                        <span className="font-medium">{selectedOpportunity.closeDate}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created Date</span>
                        <span className="font-medium">{selectedOpportunity.createdDate}</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      Related Records
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-3 px-1 pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Account Name</span>
                        <span className="font-medium">{selectedOpportunity.accountName}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Contact Name</span>
                        <span className="font-medium">{selectedOpportunity.contactName}</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Globe className="size-4 text-muted-foreground" />
                      Description ({selectedOpportunity.description.length})
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 px-1 pt-3">
                      {selectedOpportunity.description.map((note, i) => (
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
