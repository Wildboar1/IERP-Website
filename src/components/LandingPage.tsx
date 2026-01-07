import { DepartmentCard } from "./DepartmentCard";
import { EmployeeCard } from "./EmployeeCard";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-20 px-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/2.webp')`
        }}
      >
        <div className="max-w-7xl mx-auto text-center text-foreground">
          <h1 className="mb-4 text-foreground">Indian Empire Roleplay</h1>
          <p className="text-xl mb-8">Law Enforcement & Justice System</p>
          <Button size="lg" onClick={onNavigateToDocuments} className="bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground">
            View Legal Documents
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Departments Section */}
        <section className="mb-16">
          <h2 className="mb-8">Departments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <DepartmentCard
                key={dept.title}
                title={dept.title}
                description={dept.description}
                logo={dept.logo}
              />
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Government Officials */}
        <section className="mb-16">
          <h2 className="mb-6">Government</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {governmentOfficials.map((official, index) => (
              <EmployeeCard key={`${official.department}-${index}`} {...official} />
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* DOJ Officials */}
        <section className="mb-16">
          <h2 className="mb-6">Department Of Justice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dojOfficials.map((official, index) => (
              <EmployeeCard key={`${official.department}-${index}`} {...official} />
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* SASP Officials */}
        <section className="mb-16">
          <h2 className="mb-6">San Andreas State Police</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {saspOfficials.map((official, index) => (
              <EmployeeCard key={`${official.department}-${index}`} {...official} />
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* LSPD Officials */}
        <section className="mb-16">
          <h2 className="mb-6">Los Santos Police Department</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lspdOfficials.map((official, index) => (
              <EmployeeCard key={`${official.department}-${index}`} {...official} />
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* BCSO Officials */}
        <section className="mb-16">
          <h2 className="mb-6">Blaine County Sheriff's Office</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bcsoOfficials.map((official, index) => (
              <EmployeeCard key={`${official.department}-${index}`} {...official} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
