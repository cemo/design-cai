"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  DollarSign,
  GitMerge,
  Globe,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
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

import {
  useCrmData,
  type Account,
  type AccountStatus,
  type AccountContact as Contact,
  type AccountOpportunity as Opportunity,
} from "@/components/crm-data-provider";

type SheetView = "detail" | "approval" | "search" | "merge";

type MergeableField = "name" | "website" | "phone" | "employees" | "taxNumber" | "taxOffice";

const MERGEABLE_FIELDS: { key: MergeableField; label: string }[] = [
  { key: "name", label: "Account Name" },
  { key: "website", label: "Website" },
  { key: "phone", label: "Phone" },
  { key: "employees", label: "Employees" },
  { key: "taxNumber", label: "Tax Number" },
  { key: "taxOffice", label: "Tax Office" },
];

function getConflictType(existing: string, incoming: string): "same" | "one-empty" | "conflict" {
  const a = existing?.trim() || "";
  const b = incoming?.trim() || "";
  if (a === b) return "same";
  if (!a || !b) return "one-empty";
  return "conflict";
}

const statusVariant: Record<
  AccountStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Active: "default",
  Inactive: "secondary",
  "Pending Approval": "outline",
};

const stats = [
  { label: "Total Accounts", value: "1,284", change: "+8.3%", icon: Building2 },
  { label: "Active", value: "1,041", change: "+5.1%", icon: Briefcase },
  { label: "Total Revenue", value: "$892,750", change: "+14.2%", icon: DollarSign },
  { label: "New This Month", value: "63", change: "+19.8%", icon: TrendingUp },
];

export default function AccountsPage() {
  const {
    accounts,
    filteredAccounts: accountList,
    accountSearch,
    setAccountSearch,
    approveAccount,
    rejectAccount,
    mergeAccount,
  } = useCrmData();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editForm, setEditForm] = useState<Partial<Account>>({});
  const [sheetView, setSheetView] = useState<SheetView>("detail");
  const [mergeTarget, setMergeTarget] = useState<Account | null>(null);
  const [mergeSearch, setMergeSearch] = useState("");
  const [mergeForm, setMergeForm] = useState<Record<MergeableField, string>>({} as Record<MergeableField, string>);

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setSheetView(account.status === "Pending Approval" ? "approval" : "detail");
    setMergeTarget(null);
    setMergeSearch("");
    setEditForm({
      name: account.name,
      website: account.website,
      phone: account.phone,
      employees: account.employees,
      taxNumber: account.taxNumber,
      taxOffice: account.taxOffice,
    });
  };

  const handleApprove = () => {
    if (!selectedAccount) return;
    approveAccount(selectedAccount.id, editForm);
    setSelectedAccount(null);
  };

  const handleReject = () => {
    if (!selectedAccount) return;
    rejectAccount(selectedAccount.id);
    setSelectedAccount(null);
  };

  const updateField = (field: keyof Account, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartMergeSearch = () => {
    setSheetView("search");
    setMergeSearch("");
  };

  const handleSelectMergeTarget = (target: Account) => {
    setMergeTarget(target);
    setSheetView("merge");
    const resolved = {} as Record<MergeableField, string>;
    for (const { key } of MERGEABLE_FIELDS) {
      const existingVal = target[key]?.trim() || "";
      const caiVal = (selectedAccount?.[key] as string)?.trim() || "";
      const conflict = getConflictType(existingVal, caiVal);
      if (conflict === "same") resolved[key] = existingVal;
      else if (conflict === "one-empty") resolved[key] = existingVal || caiVal;
      else resolved[key] = caiVal;
    }
    setMergeForm(resolved);
  };

  const handleMerge = () => {
    if (!selectedAccount || !mergeTarget) return;
    mergeAccount(selectedAccount.id, mergeTarget.id, mergeForm);
    setSelectedAccount(null);
    setSheetView("detail");
    setMergeTarget(null);
  };

  const filteredMergeAccounts = accounts.filter((a) => {
    if (a.id === selectedAccount?.id) return false;
    if (a.status === "Pending Approval") return false;
    if (!mergeSearch) return true;
    const q = mergeSearch.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.website.toLowerCase().includes(q) ||
      a.taxNumber.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium">Accounts</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between pt-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Accounts</h2>
            <p className="text-muted-foreground">
              Manage your accounts, company profiles, and revenue pipeline.
            </p>
          </div>
          <Button className="cursor-pointer">
            <Plus className="mr-2 size-4" />
            New Account
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
            <Input placeholder="Search accounts..." className="pl-9" value={accountSearch} onChange={(e) => setAccountSearch(e.target.value)} />
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Account Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-[50px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountList.map((account) => (
                <TableRow
                  key={account.id}
                  className={`cursor-pointer ${account.status === "Pending Approval" ? "bg-violet-50/50 hover:bg-violet-50 dark:bg-violet-950/20 dark:hover:bg-violet-950/30" : ""}`}
                  onClick={() => handleSelectAccount(account)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {account.status === "Pending Approval" ? (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                          <Sparkles className="size-4 text-violet-600" />
                        </div>
                      ) : (
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                            {account.initials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="font-medium leading-none">
                          {account.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {account.website}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {account.phone || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariant[account.status]}
                      className={account.status === "Pending Approval" ? "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/30 dark:text-violet-400" : ""}
                    >
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {account.totalRevenue}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {account.lastActivityDate}
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
                          Edit Account
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
              Showing <span className="font-medium">{accountList.length}</span> of{" "}
              <span className="font-medium">1,284</span> accounts
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
        open={!!selectedAccount}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAccount(null);
            setSheetView("detail");
            setMergeTarget(null);
            setMergeSearch("");
          }
        }}
      >
        <SheetContent className={`overflow-y-auto ${sheetView === "merge" ? "sm:max-w-2xl" : "sm:max-w-md"}`}>
          {selectedAccount && selectedAccount.status === "Pending Approval" && sheetView === "approval" && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                    <Sparkles className="size-5 text-violet-600" />
                  </div>
                  <div>
                    <SheetTitle>{selectedAccount.name}</SheetTitle>
                    <SheetDescription>{selectedAccount.website}</SheetDescription>
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
                    <label className="text-xs font-medium text-muted-foreground">Account Name</label>
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Website</label>
                    <Input
                      value={editForm.website || ""}
                      onChange={(e) => updateField("website", e.target.value)}
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
                    <label className="text-xs font-medium text-muted-foreground">Employees</label>
                    <Input
                      value={editForm.employees || ""}
                      onChange={(e) => updateField("employees", e.target.value)}
                      placeholder="Not provided"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Tax Number</label>
                      <Input
                        value={editForm.taxNumber || ""}
                        onChange={(e) => updateField("taxNumber", e.target.value)}
                        placeholder="Not provided"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Tax Office</label>
                      <Input
                        value={editForm.taxOffice || ""}
                        onChange={(e) => updateField("taxOffice", e.target.value)}
                        placeholder="Not provided"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
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
              </div>
            </>
          )}

          {selectedAccount && selectedAccount.status === "Pending Approval" && sheetView === "search" && (
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
                      Select an account to merge with {selectedAccount.name}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-3 px-4 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search accounts..."
                    className="pl-9"
                    value={mergeSearch}
                    onChange={(e) => setMergeSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  {filteredMergeAccounts.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No accounts found
                    </p>
                  )}
                  {filteredMergeAccounts.map((account) => (
                    <button
                      key={account.id}
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                      onClick={() => handleSelectMergeTarget(account)}
                    >
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                          {account.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {account.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {account.website}
                        </p>
                      </div>
                      <Badge variant={statusVariant[account.status]} className="shrink-0">
                        {account.status}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedAccount && selectedAccount.status === "Pending Approval" && sheetView === "merge" && mergeTarget && (
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
                    <SheetTitle>Merge Accounts</SheetTitle>
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
                      <p className="truncate text-xs font-semibold text-violet-700 dark:text-violet-300">{selectedAccount.name}</p>
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
                    const caiVal = (selectedAccount[key] as string)?.trim() || "";
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

                {selectedAccount.contacts.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">
                          cai Contacts ({selectedAccount.contacts.length})
                        </p>
                        <div className="flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 dark:border-violet-800 dark:bg-violet-950/30">
                          <ArrowRight className="size-3 text-violet-600" />
                          <span className="text-[10px] font-medium text-violet-700 dark:text-violet-300">
                            Transferring to {mergeTarget.name}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {selectedAccount.contacts.map((contact) => (
                          <div key={contact.email} className="flex items-center justify-between rounded-md border border-violet-100 p-2.5 dark:border-violet-900">
                            <div>
                              <p className="text-xs font-medium">{contact.name}</p>
                              <p className="text-[10px] text-muted-foreground">{contact.email}</p>
                            </div>
                            {contact.phone && (
                              <span className="text-[10px] text-muted-foreground">{contact.phone}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedAccount.opportunities.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">
                          cai Opportunities ({selectedAccount.opportunities.length})
                        </p>
                        <div className="flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 dark:border-violet-800 dark:bg-violet-950/30">
                          <ArrowRight className="size-3 text-violet-600" />
                          <span className="text-[10px] font-medium text-violet-700 dark:text-violet-300">
                            Transferring to {mergeTarget.name}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {selectedAccount.opportunities.map((opp) => (
                          <div key={opp.name} className="flex items-center justify-between rounded-md border border-violet-100 p-2.5 dark:border-violet-900">
                            <div>
                              <p className="text-xs font-medium">{opp.name}</p>
                              <p className="text-[10px] text-muted-foreground">{opp.stage}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-semibold">{opp.amount}</p>
                              <p className="text-[10px] text-muted-foreground">{opp.closeDate}</p>
                            </div>
                          </div>
                        ))}
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
                            Stays in {mergeTarget.name}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {mergeTarget.opportunities.map((opp) => (
                          <div key={opp.name} className="flex items-center justify-between rounded-md border p-2.5">
                            <div>
                              <p className="text-xs font-medium">{opp.name}</p>
                              <p className="text-[10px] text-muted-foreground">{opp.stage}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-semibold">{opp.amount}</p>
                              <p className="text-[10px] text-muted-foreground">{opp.closeDate}</p>
                            </div>
                          </div>
                        ))}
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

          {selectedAccount && selectedAccount.status !== "Pending Approval" && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                      {selectedAccount.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{selectedAccount.name}</SheetTitle>
                    <SheetDescription>{selectedAccount.website}</SheetDescription>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant={statusVariant[selectedAccount.status]}>
                    {selectedAccount.status}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-2 px-4 pb-4">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      Account Details
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-3 px-1 pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">{selectedAccount.phone || "—"}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Website</span>
                        <span className="font-medium">{selectedAccount.website}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Employees</span>
                        <span className="font-medium">{selectedAccount.employees || "—"}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tax Number</span>
                        <span className="font-medium">{selectedAccount.taxNumber || "—"}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tax Office</span>
                        <span className="font-medium">{selectedAccount.taxOffice || "—"}</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-muted-foreground" />
                      Contacts ({selectedAccount.contacts.length})
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 px-1 pt-3">
                      {selectedAccount.contacts.map((contact) => (
                        <div
                          key={contact.email}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.email}</p>
                          </div>
                          {contact.phone && (
                            <span className="text-xs text-muted-foreground">{contact.phone}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-muted-foreground" />
                      Financial
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-3 px-1 pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Revenue</span>
                        <span className="font-medium">{selectedAccount.totalRevenue}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created Date</span>
                        <span className="font-medium">{selectedAccount.createdDate}</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Globe className="size-4 text-muted-foreground" />
                      Description ({selectedAccount.description.length})
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 px-1 pt-3">
                      {selectedAccount.description.map((note, i) => (
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
