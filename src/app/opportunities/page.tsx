"use client";

import { useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  CircleDot,
  CreditCard,
  DollarSign,
  Globe,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
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
  type Opportunity,
  type OpportunityStatus,
  type OpportunityStage,
} from "@/components/crm-data-provider";

type SheetView = "detail" | "approval";

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
  const {
    filteredOpportunities: opportunityList,
    opportunitySearch,
    setOpportunitySearch,
    approveOpportunity,
    rejectOpportunity,
  } = useCrmData();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [editForm, setEditForm] = useState<Partial<Opportunity>>({});
  const [sheetView, setSheetView] = useState<SheetView>("detail");

  const handleSelectOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setSheetView(opportunity.status === "Pending Approval" ? "approval" : "detail");
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
    approveOpportunity(selectedOpportunity.id, editForm);
    setSelectedOpportunity(null);
  };

  const handleReject = () => {
    if (!selectedOpportunity) return;
    rejectOpportunity(selectedOpportunity.id);
    setSelectedOpportunity(null);
  };

  const updateField = (field: keyof Opportunity, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

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
            <Input placeholder="Search opportunities..." className="pl-9" value={opportunitySearch} onChange={(e) => setOpportunitySearch(e.target.value)} />
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
          }
        }}
      >
        <SheetContent className="overflow-y-auto sm:max-w-md">
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
