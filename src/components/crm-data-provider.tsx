"use client";

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react";

// ─── Status & Stage Types ──────────────────────────────────────────

export type ContactStatus = "Active" | "Inactive" | "Pending Approval";
export type AccountStatus = "Active" | "Inactive" | "Pending Approval";
export type OpportunityStatus = "Active" | "Inactive" | "Pending Approval";

export type OpportunityStage =
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

// ─── Nested Sub-types ──────────────────────────────────────────────

export interface ContactOpportunity {
  name: string;
  amount: string;
  stage: OpportunityStage;
  closeDate: string;
}

export interface AccountContact {
  name: string;
  email: string;
  phone: string;
}

export interface AccountOpportunity {
  name: string;
  amount: string;
  stage: string;
  closeDate: string;
}

// ─── Entity Interfaces ─────────────────────────────────────────────

export interface Contact {
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
  opportunities: ContactOpportunity[];
  description: string[];
  createdDate: string;
}

export interface Account {
  id: string;
  name: string;
  website: string;
  phone: string;
  employees: string;
  taxNumber: string;
  taxOffice: string;
  status: AccountStatus;
  totalRevenue: string;
  lastActivityDate: string;
  initials: string;
  contacts: AccountContact[];
  opportunities: AccountOpportunity[];
  description: string[];
  createdDate: string;
}

export interface Opportunity {
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

// ─── Context Type ──────────────────────────────────────────────────

interface CrmDataContextType {
  // Raw data (for merge search etc.)
  contacts: Contact[];
  accounts: Account[];
  opportunities: Opportunity[];

  // Search state
  contactSearch: string;
  accountSearch: string;
  opportunitySearch: string;
  setContactSearch: (q: string) => void;
  setAccountSearch: (q: string) => void;
  setOpportunitySearch: (q: string) => void;

  // Filtered data
  filteredContacts: Contact[];
  filteredAccounts: Account[];
  filteredOpportunities: Opportunity[];

  // Contact actions
  approveContact: (id: string, editForm: Partial<Contact>) => void;
  rejectContact: (id: string) => void;
  mergeContact: (caiId: string, targetId: string, mergeForm: Record<string, string>) => void;

  // Account actions
  approveAccount: (id: string, editForm: Partial<Account>) => void;
  rejectAccount: (id: string) => void;
  mergeAccount: (caiId: string, targetId: string, mergeForm: Record<string, string>) => void;

  // Opportunity actions
  approveOpportunity: (id: string, editForm: Partial<Opportunity>) => void;
  rejectOpportunity: (id: string) => void;
}

// ─── Mock Data: Contacts ───────────────────────────────────────────

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

// ─── Mock Data: Accounts ───────────────────────────────────────────

const initialAccounts: Account[] = [
  {
    id: "acc_tt",
    name: "Türk Traktör",
    website: "turktraktor.com.tr",
    phone: "",
    employees: "",
    taxNumber: "",
    taxOffice: "",
    status: "Pending Approval",
    totalRevenue: "$185,000",
    lastActivityDate: "2 hours ago",
    initials: "TT",
    contacts: [{ name: "Ayşe Demir", email: "ayse.demir@turktraktor.com.tr", phone: "" }],
    opportunities: [],
    description: ["Auto-created by cai from email analysis"],
    createdDate: "Feb 6, 2024",
  },
  {
    id: "acc_cat",
    name: "Caterpillar Turkey",
    website: "caterpillar.com.tr",
    phone: "",
    employees: "",
    taxNumber: "",
    taxOffice: "",
    status: "Pending Approval",
    totalRevenue: "$92,000",
    lastActivityDate: "5 hours ago",
    initials: "CT",
    contacts: [{ name: "Mehmet Yılmaz", email: "mehmet@caterpillar.com.tr", phone: "" }],
    opportunities: [],
    description: ["Auto-created by cai from email analysis"],
    createdDate: "Feb 6, 2024",
  },
  {
    id: "acc_jcb",
    name: "JCB Latin America",
    website: "jcb-latam.com",
    phone: "",
    employees: "",
    taxNumber: "",
    taxOffice: "",
    status: "Pending Approval",
    totalRevenue: "$340,000",
    lastActivityDate: "4 days ago",
    initials: "JL",
    contacts: [{ name: "Carlos Mendez", email: "carlos@jcb-latam.com", phone: "" }],
    opportunities: [],
    description: ["Auto-created by cai from email analysis"],
    createdDate: "Feb 6, 2024",
  },
  {
    id: "acc_acme",
    name: "Acme Corp",
    website: "acme.com",
    phone: "+1 (555) 100-2000",
    employees: "250",
    taxNumber: "12-3456789",
    taxOffice: "San Francisco",
    status: "Active",
    totalRevenue: "$12,500",
    lastActivityDate: "2 hours ago",
    initials: "AC",
    contacts: [{ name: "Sarah Johnson", email: "sarah@acme.com", phone: "+1 (555) 123-4567" }],
    opportunities: [
      { name: "Acme Corp - Enterprise Plan", amount: "$10,000", stage: "Negotiation/Review", closeDate: "2024-06-30" },
      { name: "Acme Corp - Support Add-on", amount: "$2,500", stage: "Closed Won", closeDate: "2024-03-15" },
    ],
    description: ["Key enterprise account", "Expanding to EU markets"],
    createdDate: "Jan 15, 2024",
  },
  {
    id: "acc_ts",
    name: "TechStart",
    website: "techstart.io",
    phone: "+1 (555) 200-3000",
    employees: "45",
    taxNumber: "98-7654321",
    taxOffice: "Austin",
    status: "Active",
    totalRevenue: "$8,200",
    lastActivityDate: "1 day ago",
    initials: "TS",
    contacts: [{ name: "Michael Chen", email: "m.chen@techstart.io", phone: "+1 (555) 234-5678" }],
    opportunities: [
      { name: "TechStart - Starter Plan", amount: "$5,200", stage: "Qualification", closeDate: "2024-07-15" },
    ],
    description: ["Interested in API integrations"],
    createdDate: "Mar 3, 2024",
  },
  {
    id: "acc_gf",
    name: "GlobalFin",
    website: "globalfin.com",
    phone: "+1 (555) 300-4000",
    employees: "1,200",
    taxNumber: "55-1234567",
    taxOffice: "New York",
    status: "Active",
    totalRevenue: "$24,000",
    lastActivityDate: "3 days ago",
    initials: "GF",
    contacts: [{ name: "Emily Rodriguez", email: "emily@globalfin.com", phone: "+1 (555) 345-6789" }],
    opportunities: [
      { name: "GlobalFin - Compliance Module", amount: "$18,000", stage: "Proposal/Price Quote", closeDate: "2024-08-01" },
      { name: "GlobalFin - Data Analytics", amount: "$6,000", stage: "Closed Won", closeDate: "2024-02-28" },
    ],
    description: ["Needs compliance features", "Budget approval pending"],
    createdDate: "Feb 20, 2024",
  },
  {
    id: "acc_il",
    name: "Innovate Labs",
    website: "innovate.co",
    phone: "+1 (555) 400-5000",
    employees: "80",
    taxNumber: "33-9876543",
    taxOffice: "Seattle",
    status: "Active",
    totalRevenue: "$15,750",
    lastActivityDate: "5 hours ago",
    initials: "IL",
    contacts: [{ name: "James Wilson", email: "jwilson@innovate.co", phone: "+1 (555) 456-7890" }],
    opportunities: [
      { name: "Innovate Labs - Pro Plan", amount: "$12,000", stage: "Negotiation/Review", closeDate: "2024-05-20" },
      { name: "Innovate Labs - Training Package", amount: "$3,750", stage: "Closed Won", closeDate: "2024-01-10" },
    ],
    description: ["Champion for internal adoption"],
    createdDate: "Dec 8, 2023",
  },
  {
    id: "acc_br",
    name: "BuildRight",
    website: "buildright.com",
    phone: "+1 (555) 500-6000",
    employees: "150",
    taxNumber: "44-5678901",
    taxOffice: "Chicago",
    status: "Inactive",
    totalRevenue: "$4,300",
    lastActivityDate: "2 weeks ago",
    initials: "BR",
    contacts: [{ name: "Lisa Thompson", email: "lisa@buildright.com", phone: "+1 (555) 567-8901" }],
    opportunities: [
      { name: "BuildRight - Basic Plan", amount: "$4,300", stage: "Closed Lost", closeDate: "2024-03-01" },
    ],
    description: ["Lost due to budget cuts", "May return Q3"],
    createdDate: "Nov 12, 2023",
  },
  {
    id: "acc_ne",
    name: "NextEra",
    website: "nextera.io",
    phone: "+1 (555) 600-7000",
    employees: "320",
    taxNumber: "66-4321098",
    taxOffice: "Los Angeles",
    status: "Active",
    totalRevenue: "$31,000",
    lastActivityDate: "1 hour ago",
    initials: "NE",
    contacts: [{ name: "David Kim", email: "dkim@nextera.io", phone: "+1 (555) 678-9012" }],
    opportunities: [
      { name: "NextEra - Enterprise Suite", amount: "$25,000", stage: "Closed Won", closeDate: "2024-01-30" },
      { name: "NextEra - API Premium", amount: "$6,000", stage: "Negotiation/Review", closeDate: "2024-06-15" },
    ],
    description: ["VIP account", "Quarterly business reviews scheduled"],
    createdDate: "Oct 5, 2023",
  },
  {
    id: "acc_ed",
    name: "EuroDesign",
    website: "eurodesign.eu",
    phone: "+48 22 100 2000",
    employees: "60",
    taxNumber: "PL-7654321098",
    taxOffice: "Warsaw",
    status: "Active",
    totalRevenue: "$9,800",
    lastActivityDate: "4 days ago",
    initials: "ED",
    contacts: [{ name: "Anna Kowalski", email: "anna@eurodesign.eu", phone: "+48 22 123 4567" }],
    opportunities: [
      { name: "EuroDesign - EU Starter", amount: "$9,800", stage: "Closed Won", closeDate: "2024-04-22" },
    ],
    description: ["EU data residency required"],
    createdDate: "Apr 18, 2024",
  },
  {
    id: "acc_sw",
    name: "SolarWind",
    website: "solarwind.com",
    phone: "+1 (555) 700-8000",
    employees: "200",
    taxNumber: "77-8901234",
    taxOffice: "Denver",
    status: "Active",
    totalRevenue: "$18,400",
    lastActivityDate: "6 hours ago",
    initials: "SW",
    contacts: [{ name: "Robert Garcia", email: "rgarcia@solarwind.com", phone: "+1 (555) 789-0123" }],
    opportunities: [
      { name: "SolarWind - Growth Plan", amount: "$14,000", stage: "Closed Won", closeDate: "2023-11-15" },
      { name: "SolarWind - Multi-Office Expansion", amount: "$4,400", stage: "Qualification", closeDate: "2024-09-01" },
    ],
    description: ["Expanding to 3 new offices"],
    createdDate: "Sep 22, 2023",
  },
  {
    id: "acc_cn",
    name: "CloudNine",
    website: "cloudnine.dev",
    phone: "+1 (555) 800-9000",
    employees: "95",
    taxNumber: "88-2345678",
    taxOffice: "Boston",
    status: "Active",
    totalRevenue: "$22,100",
    lastActivityDate: "Yesterday",
    initials: "CN",
    contacts: [{ name: "Priya Patel", email: "priya@cloudnine.dev", phone: "+1 (555) 890-1234" }],
    opportunities: [
      { name: "CloudNine - Annual License", amount: "$18,000", stage: "Closed Won", closeDate: "2024-02-15" },
      { name: "CloudNine - Integration Add-on", amount: "$4,100", stage: "Proposal/Price Quote", closeDate: "2024-07-01" },
    ],
    description: ["Referred by David Kim", "Wants annual billing discount"],
    createdDate: "Jan 30, 2024",
  },
  {
    id: "acc_sb",
    name: "SteelBridge",
    website: "steelbridge.co",
    phone: "+1 (555) 900-1000",
    employees: "500",
    taxNumber: "99-3456789",
    taxOffice: "Detroit",
    status: "Inactive",
    totalRevenue: "$6,700",
    lastActivityDate: "1 month ago",
    initials: "SB",
    contacts: [{ name: "Tom Anderson", email: "tom@steelbridge.co", phone: "+1 (555) 901-2345" }],
    opportunities: [
      { name: "SteelBridge - Enterprise Plan", amount: "$6,700", stage: "Closed Lost", closeDate: "2023-12-01" },
    ],
    description: ["Contract expired", "Follow up in 6 months"],
    createdDate: "Aug 14, 2023",
  },
];

// ─── Mock Data: Opportunities ──────────────────────────────────────

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

// ─── Context ───────────────────────────────────────────────────────

const CrmDataContext = createContext<CrmDataContextType | null>(null);

export function useCrmData(): CrmDataContextType {
  const ctx = useContext(CrmDataContext);
  if (!ctx) throw new Error("useCrmData must be used within CrmDataProvider");
  return ctx;
}

// ─── Provider ──────────────────────────────────────────────────────

export function CrmDataProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);

  const [contactSearch, setContactSearch] = useState("");
  const [accountSearch, setAccountSearch] = useState("");
  const [opportunitySearch, setOpportunitySearch] = useState("");

  // ── Filtered data ──

  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return contacts;
    const q = contactSearch.toLowerCase();
    return contacts.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.accountName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [contacts, contactSearch]);

  const filteredAccounts = useMemo(() => {
    if (!accountSearch.trim()) return accounts;
    const q = accountSearch.toLowerCase();
    return accounts.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.website.toLowerCase().includes(q) ||
        a.taxNumber.toLowerCase().includes(q)
    );
  }, [accounts, accountSearch]);

  const filteredOpportunities = useMemo(() => {
    if (!opportunitySearch.trim()) return opportunities;
    const q = opportunitySearch.toLowerCase();
    return opportunities.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.accountName.toLowerCase().includes(q) ||
        o.contactName.toLowerCase().includes(q)
    );
  }, [opportunities, opportunitySearch]);

  // ── Contact Actions ──

  const approveContact = useCallback((id: string, editForm: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...editForm,
              status: "Active" as ContactStatus,
              initials: `${(editForm.firstName || c.firstName)[0]}${(editForm.lastName || c.lastName)[0]}`.toUpperCase(),
            }
          : c
      )
    );
  }, []);

  const rejectContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const mergeContact = useCallback((caiId: string, targetId: string, mergeForm: Record<string, string>) => {
    setContacts((prev) => {
      const caiContact = prev.find((c) => c.id === caiId);
      return prev
        .map((c) =>
          c.id === targetId
            ? {
                ...c,
                ...mergeForm,
                initials: `${mergeForm.firstName[0]}${mergeForm.lastName[0]}`.toUpperCase(),
                opportunities: [...c.opportunities, ...(caiContact?.opportunities || [])],
              }
            : c
        )
        .filter((c) => c.id !== caiId);
    });

    // CASCADE: Update opportunities referencing the merged-away contact
    const mergedName = `${mergeForm.firstName} ${mergeForm.lastName}`;
    setOpportunities((prev) =>
      prev.map((o) =>
        o.contactId === caiId
          ? { ...o, contactId: targetId, contactName: mergedName }
          : o
      )
    );
  }, []);

  // ── Account Actions ──

  const approveAccount = useCallback((id: string, editForm: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              ...editForm,
              status: "Active" as AccountStatus,
              initials: (editForm.name || a.name).split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
            }
          : a
      )
    );
  }, []);

  const rejectAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const mergeAccount = useCallback((caiId: string, targetId: string, mergeForm: Record<string, string>) => {
    setAccounts((prev) => {
      const caiAccount = prev.find((a) => a.id === caiId);
      return prev
        .map((a) =>
          a.id === targetId
            ? {
                ...a,
                ...mergeForm,
                initials: mergeForm.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
                contacts: [...a.contacts, ...(caiAccount?.contacts || [])],
                opportunities: [...a.opportunities, ...(caiAccount?.opportunities || [])],
              }
            : a
        )
        .filter((a) => a.id !== caiId);
    });

    // CASCADE: Update contacts referencing the merged-away account
    const mergedAccountName = mergeForm.name;
    setContacts((prev) =>
      prev.map((c) =>
        c.accountId === caiId
          ? { ...c, accountId: targetId, accountName: mergedAccountName }
          : c
      )
    );

    // CASCADE: Update opportunities referencing the merged-away account
    setOpportunities((prev) =>
      prev.map((o) =>
        o.accountId === caiId
          ? { ...o, accountId: targetId, accountName: mergedAccountName }
          : o
      )
    );
  }, []);

  // ── Opportunity Actions ──

  const approveOpportunity = useCallback((id: string, editForm: Partial<Opportunity>) => {
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              ...editForm,
              status: "Active" as OpportunityStatus,
              initials: (editForm.name || o.name).split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
            }
          : o
      )
    );
  }, []);

  const rejectOpportunity = useCallback((id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  }, []);

  // ── Value ──

  const value = useMemo<CrmDataContextType>(
    () => ({
      contacts,
      accounts,
      opportunities,
      contactSearch,
      accountSearch,
      opportunitySearch,
      setContactSearch,
      setAccountSearch,
      setOpportunitySearch,
      filteredContacts,
      filteredAccounts,
      filteredOpportunities,
      approveContact,
      rejectContact,
      mergeContact,
      approveAccount,
      rejectAccount,
      mergeAccount,
      approveOpportunity,
      rejectOpportunity,
    }),
    [
      contacts,
      accounts,
      opportunities,
      contactSearch,
      accountSearch,
      opportunitySearch,
      filteredContacts,
      filteredAccounts,
      filteredOpportunities,
      approveContact,
      rejectContact,
      mergeContact,
      approveAccount,
      rejectAccount,
      mergeAccount,
      approveOpportunity,
      rejectOpportunity,
    ]
  );

  return (
    <CrmDataContext.Provider value={value}>
      {children}
    </CrmDataContext.Provider>
  );
}
