import React from "react";
import { DepartmentCard } from "./DepartmentCard";

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

export default function DepartmentOfficialsPage() {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Department Officials</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => (
          <DepartmentCard
            key={dept.title}
            title={dept.title}
            description={dept.description}
            logo={dept.logo}
          />
        ))}
      </div>
    </div>
  );
}
