import { DepartmentCard } from "./DepartmentCard";
import { EmployeeCard } from "./EmployeeCard";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { GlobalFeedbackSection } from "./ui/global-feedback-section";
import { FileText, ClipboardList, LayoutDashboard, Sun, Palette, Moon } from "lucide-react";

interface LandingPageProps {
  onNavigateToDocuments: () => void;
}

const departments = [
  {
    title: "Government",
    description: "The central governing body responsible for executive decisions, policy making, and overall administration of the Indian Empire. Oversees all state operations and ensures smooth governance.",
    logo: "/gOVERMENT logo.webp",
  },
  {
    title: "DOJ (Department Of Justice)",
    description: "The judicial arm responsible for administering justice, conducting fair trials, and upholding the rule of law. Handles all legal proceedings and ensures constitutional rights are protected.",
    logo: "/doj logo.webp",
  },
  {
    title: "SASP (San Andreas State Police)",
    description: "The primary state-level law enforcement agency responsible for maintaining law and order across all of San Andreas. Handles major crimes, highway patrol, and inter-county coordination.",
    logo: "/sasp logo.webp",
  },
  {
    title: "LSPD (Los Santos Police Department)",
    description: "The municipal police force serving Los Santos city. Responsible for local law enforcement, community policing, crime prevention, and emergency response within city limits.",
    logo: "/lspd logo.png",
  },
  {
    title: "BCSO (Blaine County Sheriff's Office)",
    description: "The county law enforcement agency serving Blaine County. Manages rural policing, county jail operations, and provides law enforcement services in unincorporated areas.",
    logo: "/bcso logo.gif",
  },
];

const governmentOfficials = [
  {
    name: "Vacant",
    rank: "Governor",
    photo: "/VACANT.jpg",
    department: "Government",
  },
  {
    name: "Vacant",
    rank: "Mayor",
    photo: "/VACANT.jpg",
    department: "Government",
  },
  {
    name: "Vacant",
    rank: "State Security Head",
    photo: "/VACANT.jpg",
    department: "Government",
  },
];

const dojOfficials = [
  {
    name: "Vacant",
    rank: "Chief Of Justice",
    photo: "/VACANT.jpg",
    department: "DOJ",
  },
  {
    name: "Vacant",
    rank: "Judge",
    photo: "/VACANT.jpg",
    department: "DOJ",
  },
  {
    name: "Vacant",
    rank: "District Attorney",
    photo: "/VACANT.jpg",
    department: "DOJ",
  },
];

const saspOfficials = [
  {
    name: "Vacant",
    rank: "Commissioner",
    photo: "/VACANT.jpg",
    department: "SASP",
  },
  {
    name: "Vacant",
    rank: "Assistant Commissioner",
    photo: "/VACANT.jpg",
    department: "SASP",
  },
  {
    name: "Vacant",
    rank: "State Trooper",
    photo: "/VACANT.jpg",
    department: "SASP",
  },
];

const lspdOfficials = [
  {
    name: "Vacant",
    rank: "Chief Of LSPD",
    photo: "/VACANT.jpg",
    department: "LSPD",
  },
  {
    name: "Vacant",
    rank: "Assistant Chief Of LSPD",
    photo: "/VACANT.jpg",
    department: "LSPD",
  },
  {
    name: "Vacant",
    rank: "Captain",
    photo: "/VACANT.jpg",
    department: "LSPD",
  },
];

const bcsoOfficials = [
  {
    name: "Vacant",
    rank: "Sheriff",
    photo: "/VACANT.jpg",
    department: "BCSO",
  },
  {
    name: "Vacant",
    rank: "UnderSheriff",
    photo: "/VACANT.jpg",
    department: "BCSO",
  },
  {
    name: "Vacant",
    rank: "Colonel",
    photo: "/VACANT.jpg",
    department: "BCSO",
  },
];

export function LandingPage({ onNavigateToDocuments }: LandingPageProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-[#1e293b] text-foreground flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 text-center relative">
        <div className="max-w-2xl mx-auto z-10">
          <div className="mb-4 inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">Your Essential Law Enforcement Guide</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">Indian Empire RP Guide</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">Master law enforcement roleplay with comprehensive guides covering legal documents, SOPs, penal codes, and everything you need for authentic RP experiences.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={onNavigateToDocuments} className="bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground">Start Learning</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
        {/* Optional: background watermark icons or gradients */}
      </section>

      {/* Card Grid Section */}
      <section className="max-w-5xl mx-auto w-full px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <a href="/documents" className="group rounded-xl bg-card/80 hover:bg-primary/10 border border-border p-6 flex flex-col items-center transition shadow">
            <FileText className="w-10 h-10 mb-3 text-primary group-hover:scale-110 transition" />
            <div className="font-bold text-lg mb-1">Legal Documents</div>
            <div className="text-sm text-muted-foreground text-center">All laws, codes, and official procedures for the server.</div>
          </a>
          <a href="/applications" className="group rounded-xl bg-card/80 hover:bg-primary/10 border border-border p-6 flex flex-col items-center transition shadow">
            <ClipboardList className="w-10 h-10 mb-3 text-primary group-hover:scale-110 transition" />
            <div className="font-bold text-lg mb-1">Applications</div>
            <div className="text-sm text-muted-foreground text-center">Submit and manage your law enforcement or legal applications.</div>
          </a>
          <a href="/admin" className="group rounded-xl bg-card/80 hover:bg-primary/10 border border-border p-6 flex flex-col items-center transition shadow">
            <LayoutDashboard className="w-10 h-10 mb-3 text-primary group-hover:scale-110 transition" />
            <div className="font-bold text-lg mb-1">Admin Dashboard</div>
            <div className="text-sm text-muted-foreground text-center">Admin tools and management for staff and server leaders.</div>
          </a>
          <a href="/theme-warm" className="group rounded-xl bg-card/80 hover:bg-primary/10 border border-border p-6 flex flex-col items-center transition shadow">
            <Sun className="w-10 h-10 mb-3 text-primary group-hover:scale-110 transition" />
            <div className="font-bold text-lg mb-1">Warm Theme</div>
            <div className="text-sm text-muted-foreground text-center">Switch to a warm, immersive color palette.</div>
          </a>
          <a href="/theme-mono" className="group rounded-xl bg-card/80 hover:bg-primary/10 border border-border p-6 flex flex-col items-center transition shadow">
            <Palette className="w-10 h-10 mb-3 text-primary group-hover:scale-110 transition" />
            <div className="font-bold text-lg mb-1">Mono Theme</div>
            <div className="text-sm text-muted-foreground text-center">Try a clean, monochrome look for the site.</div>
          </a>
          <a href="/theme-ocean" className="group rounded-xl bg-card/80 hover:bg-primary/10 border border-border p-6 flex flex-col items-center transition shadow">
            <Moon className="w-10 h-10 mb-3 text-primary group-hover:scale-110 transition" />
            <div className="font-bold text-lg mb-1">Ocean Theme</div>
            <div className="text-sm text-muted-foreground text-center">Experience a cool, ocean-inspired interface.</div>
          </a>
        </div>
      </section>
    </div>
  );
}
