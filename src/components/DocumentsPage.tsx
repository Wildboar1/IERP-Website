import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  FileText,
  Scale,
  BookOpen,
  Shield,
  Users,
  Radio,
  Zap,
  AlertCircle,
} from "lucide-react";
import penalCodes from "../../data/penal-codes.json";
import misdemeanorCharges from "../../data/misdemeanor-charges.json";
import infractionCharges from "../../data/infractions-charges.json";
import tenCodes from "../../data/10-codes.json";
import shortForms from "../../data/short-forms.json";
import codeCommunications from "../../data/code-communications.json";
import { GlobalFeedbackSection } from "./ui/global-feedback-section";

export function DocumentsPage() {
  // --- Penal Code State ---
  const [penalSearchTerm, setPenalSearchTerm] = useState("");
  const [crimetype, setCrimetype] = useState("all");
  const [felonyFilter, setFelonyFilter] = useState("all");
  const [misdemeanorFilter, setMisdemeanorFilter] = useState("all");
  const [infractionFilter, setInfractionFilter] = useState("all");
  const [chargeTypeFilter, setChargeTypeFilter] = useState("all");

  // --- 10-Codes State ---
  const [tenCodeSearch, setTenCodeSearch] = useState("");
  const [tenCodeCategory, setTenCodeCategory] = useState("All");

  // --- Code Comms State ---
  const [codeCommSearch, setCodeCommSearch] = useState("");
  const [codeCommPriority, setCodeCommPriority] = useState("All");
  const [codeCommType, setCodeCommType] = useState("All");

  // --- Short Forms State ---
  const [shortFormSearch, setShortFormSearch] = useState("");
  const [shortFormCategory, setShortFormCategory] = useState("All");

  // --- Filter Logic for Penal Codes ---
  const allOffenses = [
    ...penalCodes,
    ...misdemeanorCharges,
    ...infractionCharges,
  ];

  const filteredOffenses = allOffenses.filter((offense) => {
    // 1. Search Term
    const matchesSearch =
      offense.offense.toLowerCase().includes(penalSearchTerm.toLowerCase()) ||
      offense.description.toLowerCase().includes(penalSearchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Charge Type Filter
    if (
      chargeTypeFilter === "felony" &&
      offense.classification !== "Felony" &&
      offense.classification !== "Capital Offense"
    )
      return false;
    if (
      chargeTypeFilter === "misdemeanor" &&
      offense.classification !== "Misdemeanor"
    )
      return false;
    if (
      chargeTypeFilter === "infraction" &&
      offense.classification !== "Infraction"
    )
      return false;

    // 3. Crime Type (Assuming data has a 'type' field, otherwise this filter needs adjustment based on JSON structure)
    // Note: The original code had this state but didn't implement the logic inside the filter.
    // If your JSON has a 'type' field, uncomment the lines below:
    // if (crimetype !== "all" && offense.type !== crimetype) return false;

    // 4. Felony Filter
    if (felonyFilter !== "all") {
      if (
        felonyFilter === "capital" &&
        offense.classification !== "Capital Offense"
      )
        return false;
      if (felonyFilter === "felony" && offense.classification !== "Felony")
        return false;
    }

    // 5. Misdemeanor Filter
    if (misdemeanorFilter === "hide" && offense.classification === "Misdemeanor")
      return false;

    // 6. Infraction Filter
    if (infractionFilter === "hide" && offense.classification === "Infraction")
      return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-[#1e293b] text-foreground flex flex-col">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">
                Legal Documents
              </h1>
              <p className="text-muted-foreground">
                Official laws, codes, and standard operating procedures
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="penal">
          <TabsList className="grid grid-cols-7 mb-8">
            <TabsTrigger value="penal" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Penal Codes
            </TabsTrigger>
            <TabsTrigger value="10codes" className="flex items-center gap-2">
              <Radio className="w-4 h-4" />
              10-Codes
            </TabsTrigger>
            <TabsTrigger value="codecomms" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Code Comms
            </TabsTrigger>
            <TabsTrigger value="shortforms" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Short Forms
            </TabsTrigger>
            <TabsTrigger value="amendments" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Amendments
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Case Laws
            </TabsTrigger>
            <TabsTrigger value="sop" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Police SOP
            </TabsTrigger>
            {/* Added Subdepts trigger based on content below */}
            <TabsTrigger value="subdepts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Sub Depts
            </TabsTrigger>
          </TabsList>

          {/* --- Penal Codes Tab --- */}
          <TabsContent value="penal">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Important Legal Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm mb-8">
                  <p>
                    <strong>HUT (Held Until Trial):</strong> Reserved for the
                    most serious offenses where bail is typically denied.
                  </p>
                  <p>
                    <strong>Capital Offense:</strong> Crimes that may be
                    punishable by life imprisonment or other severe penalties.
                  </p>
                  <p>
                    <strong>Sentence Modifications:</strong> Actual sentences
                    may vary based on circumstances, criminal history, and
                    judicial discretion.
                  </p>
                  <p>
                    <strong>License Points:</strong> Apply only to
                    vehicle-related offenses and affect driving privileges.
                  </p>
                </div>

                <div className="grid gap-4">
                  {/* Search Bar */}
                  <div>
                    <input
                      type="text"
                      placeholder="Search offenses by name or description..."
                      value={penalSearchTerm}
                      onChange={(e) => setPenalSearchTerm(e.target.value)}
                      className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
                    <select
                      title="Charge Type"
                      value={chargeTypeFilter}
                      onChange={(e) => setChargeTypeFilter(e.target.value)}
                      className="py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                    >
                      <option value="all">All Charge Types</option>
                      <option value="felony">Felonies Only</option>
                      <option value="misdemeanor">Misdemeanors Only</option>
                      <option value="infraction">Infractions Only</option>
                    </select>

                    <select
                      title="Crime Type"
                      value={crimetype}
                      onChange={(e) => setCrimetype(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Types of Crime</option>
                      <option value="violent">Violent Crimes</option>
                      <option value="property">Property Crimes</option>
                      <option value="drug">Drug Crimes</option>
                      <option value="other">Other Crimes</option>
                    </select>

                    <select
                      title="Felony Filter"
                      value={felonyFilter}
                      onChange={(e) => setFelonyFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Felonies</option>
                      <option value="capital">Capital Offense</option>
                      <option value="felony">Standard Felony</option>
                    </select>

                    <select
                      title="Misdemeanor Filter"
                      value={misdemeanorFilter}
                      onChange={(e) => setMisdemeanorFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Misdemeanors</option>
                      <option value="show">Include Misdemeanors</option>
                      <option value="hide">Exclude Misdemeanors</option>
                    </select>

                    <select
                      title="Infraction Filter"
                      value={infractionFilter}
                      onChange={(e) => setInfractionFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Infractions</option>
                      <option value="show">Include Infractions</option>
                      <option value="hide">Exclude Infractions</option>
                    </select>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                          <th className="text-left px-4 py-3 font-semibold">
                            Offense
                          </th>
                          <th className="text-left px-4 py-3 font-semibold">
                            Classification
                          </th>
                          <th className="text-left px-4 py-3 font-semibold">
                            Sentence
                          </th>
                          <th className="text-left px-4 py-3 font-semibold">
                            License Points
                          </th>
                          <th className="text-left px-4 py-3 font-semibold">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOffenses.map((offense, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                              {offense.offense}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                className={
                                  offense.classification === "Capital Offense"
                                    ? "bg-red-700 hover:bg-red-800"
                                    : offense.classification === "Felony"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : offense.classification === "Misdemeanor"
                                    ? "bg-orange-500 hover:bg-orange-600"
                                    : "bg-yellow-500 hover:bg-yellow-600"
                                }
                              >
                                {offense.classification}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                              {offense.sentence}
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                              {offense.licensePoints}
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-md">
                              {offense.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredOffenses.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No offenses found matching your search.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- 10-Codes Tab --- */}
          <TabsContent value="10codes">
            <Card>
              <CardHeader>
                <CardTitle>10-Codes</CardTitle>
                <CardDescription>
                  Essential radio communication codes for law enforcement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex gap-4">
                  <input
                    type="text"
                    placeholder="Search 10-codes..."
                    className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={tenCodeSearch}
                    onChange={(e) => setTenCodeSearch(e.target.value)}
                  />
                  <select
                    title="Category Selector"
                    aria-label="Filter 10-codes by category"
                    className="py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={tenCodeCategory}
                    onChange={(e) => setTenCodeCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Communication">Communication</option>
                    <option value="Status">Status</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Incident">Incident</option>
                    <option value="Information">Information</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Movement">Movement</option>
                    <option value="Assistance">Assistance</option>
                  </select>
                </div>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tenCodes
                      .filter((item) => {
                        const matchesSearch =
                          item.code
                            .toLowerCase()
                            .includes(tenCodeSearch.toLowerCase()) ||
                          item.description
                            .toLowerCase()
                            .includes(tenCodeSearch.toLowerCase());
                        const matchesCategory =
                          tenCodeCategory === "All" ||
                          item.category === tenCodeCategory;
                        return matchesSearch && matchesCategory;
                      })
                      .map((item, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                              {item.code}
                            </h3>
                            <Badge
                              variant={
                                item.priority === "High"
                                  ? "destructive"
                                  : item.priority === "Medium"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-3">
                            {item.description}
                          </p>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- Code Communications Tab --- */}
          <TabsContent value="codecomms">
            <Card>
              <CardHeader>
                <CardTitle>Code Communications</CardTitle>
                <CardDescription>
                  Essential response codes and priority levels for law
                  enforcement operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex gap-4">
                  <input
                    type="text"
                    placeholder="Search codes..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={codeCommSearch}
                    onChange={(e) => setCodeCommSearch(e.target.value)}
                  />
                  <select
                    title="Priority Selector"
                    aria-label="Filter code communications by priority"
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={codeCommPriority}
                    onChange={(e) => setCodeCommPriority(e.target.value)}
                  >
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <select
                    title="Type Selector"
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={codeCommType}
                    onChange={(e) => setCodeCommType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Status">Status</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </div>
                <ScrollArea className="h-[600px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {codeCommunications
                      .filter((item) => {
                        const matchesSearch =
                          item.code
                            .toLowerCase()
                            .includes(codeCommSearch.toLowerCase()) ||
                          item.description
                            .toLowerCase()
                            .includes(codeCommSearch.toLowerCase());
                        const matchesPriority =
                          codeCommPriority === "All" ||
                          item.priority === codeCommPriority;
                        const matchesType =
                          codeCommType === "All" || item.type === codeCommType;
                        return matchesSearch && matchesPriority && matchesType;
                      })
                      .map((item, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                              {item.code}
                            </h3>
                            <Badge
                              variant={
                                item.priority === "High"
                                  ? "destructive"
                                  : item.priority === "Medium"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-3">
                            {item.description}
                          </p>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- Short Forms Tab --- */}
          <TabsContent value="shortforms">
            <Card>
              <CardHeader>
                <CardTitle>Short Forms</CardTitle>
                <CardDescription>
                  Common abbreviations used in law enforcement communication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex gap-4">
                  <input
                    type="text"
                    placeholder="Search abbreviations..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={shortFormSearch}
                    onChange={(e) => setShortFormSearch(e.target.value)}
                  />
                  <select
                    title="Shortform Category Selector"
                    aria-label="Shortform Category Selector"
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={shortFormCategory}
                    onChange={(e) => setShortFormCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Communication">Communication</option>
                    <option value="Organization">Organization</option>
                    <option value="Procedure">Procedure</option>
                    <option value="Incident">Incident</option>
                    <option value="Legal">Legal</option>
                    <option value="Medical">Medical</option>
                    <option value="Personnel">Personnel</option>
                    <option value="Investigation">Investigation</option>
                    <option value="Equipment">Equipment</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shortForms
                      .filter((item) => {
                        const matchesSearch =
                          item.abbreviation
                            .toLowerCase()
                            .includes(shortFormSearch.toLowerCase()) ||
                          item.meaning
                            .toLowerCase()
                            .includes(shortFormSearch.toLowerCase());
                        const matchesCategory =
                          shortFormCategory === "All" ||
                          item.category === shortFormCategory;
                        return matchesSearch && matchesCategory;
                      })
                      .map((item, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
                        >
                          <h3 className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400 mb-2">
                            {item.abbreviation}
                          </h3>
                          <p className="text-sm font-medium mb-3">
                            {item.meaning}
                          </p>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- Amendments Tab --- */}
          <TabsContent value="amendments">
            <Card>
              <CardHeader>
                <CardTitle>Constitutional Amendments</CardTitle>
                <CardDescription>
                  Fundamental rights and plain-language explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {/* Amendment 1 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>Amendment 1</Badge>
                          Freedom of Speech, Religion, Assembly & Petition
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Guarantees the rights to free speech and expression,
                          to practice religion, to assemble peacefully, and to
                          petition the government. These rights are fundamental
                          but may be subject to reasonable restrictions for
                          public order, decency, and safety.
                        </p>
                        <div className="text-sm">
                          <strong>Plain language:</strong> You may speak,
                          believe, meet, and complain to government without
                          undue interference.
                        </div>
                      </CardContent>
                    </Card>

                    {/* Amendment 2 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>Amendment 2</Badge>
                          Right to Bear Arms (simple explanation)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Recognizes an individual's right to possess and carry
                          firearms for lawful purposes, such as self-defense.
                          Jurisdictions may regulate possession (permits,
                          background checks, prohibited persons) while balancing
                          public safety.
                        </p>
                        <div className="text-sm">
                          <strong>Practical for officers:</strong> Verify lawful
                          possession and permits; follow department policies
                          when confronting armed subjects.
                        </div>
                      </CardContent>
                    </Card>

                    {/* Amendment 3 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>Amendment 3</Badge>
                          Protection Against Quartering of Soldiers / No
                          Unreasonable Entry
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          During peacetime, the government cannot force citizens
                          to house soldiers. More broadly this reflects the
                          principle that private homes are protected from
                          arbitrary governmental intrusion without consent or
                          proper legal authority.
                        </p>
                        <div className="text-sm">
                          <strong>Practical for officers:</strong> Do not enter
                          private residences without consent, a warrant, or a
                          recognized exigent circumstance.
                        </div>
                      </CardContent>
                    </Card>

                    {/* Amendment 4 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>Amendment 4</Badge>
                          Protection Against Unreasonable Search & Seizure
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Authorities must have probable cause and, ordinarily,
                          a warrant to search persons, homes, vehicles, or
                          effects. Exceptions (consent, plain view, exigent
                          circumstances, automobile exception) are narrowly
                          defined and must be documented.
                        </p>
                        <div className="text-sm">
                          <strong>Practical for officers:</strong> Establish and
                          document probable cause before searches; where
                          exceptions apply, record the facts supporting them.
                        </div>
                      </CardContent>
                    </Card>

                    {/* Amendment 5 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>Amendment 5</Badge>
                          Right Against Self-Incrimination & Double Jeopardy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Protects individuals from being compelled to
                          incriminate themselves and prevents being tried twice
                          for the same offense (double jeopardy). Evidence must
                          be lawfully obtained and presented in court.
                        </p>
                        <div className="text-sm">
                          <strong>Practical for officers:</strong> Do not coerce
                          statements; ensure evidence collection follows legal
                          procedures so it is admissible.
                        </div>
                      </CardContent>
                    </Card>

                    {/* Amendment 6 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>Amendment 6</Badge>
                          Right to a Fair Trial & Counsel
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Guarantees a speedy and public trial, an impartial
                          jury, the right to be informed of charges, the right
                          to confront witnesses, to call witnesses, and to have
                          legal counsel. If a suspect cannot afford an attorney,
                          the state must provide one.
                        </p>
                        <div className="text-sm mb-2">
                          <strong>Operational note:</strong> Police should not
                          hold persons beyond lawful limits without court orders
                          — suspects typically must be presented to court within
                          established time limits (check local rules; the SOP
                          notes a 24-hour presentation guideline).
                        </div>
                      </CardContent>
                    </Card>

                    {/* Amendment 7 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>Amendment 7</Badge>
                          Right to Jury Trial in Civil Cases
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Preserves the right to a jury trial in certain civil
                          disputes (historic threshold commonly described as
                          matters exceeding a set monetary value).
                        </p>
                        <div className="text-sm">
                          <strong>Practical for officers:</strong> Civil matters
                          may be decided by jury where statutory thresholds
                          apply — police role is generally limited to evidence
                          and witness cooperation.
                        </div>
                      </CardContent>
                    </Card>

                    {/* Amendment 8 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>Amendment 8</Badge>
                          No Cruel or Unusual Punishment / Excessive Bail or
                          Fines
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Forbids excessive bail or fines and cruel or unusual
                          punishment. Sentencing must be proportional and
                          lawful.
                        </p>
                        <div className="text-sm">
                          <strong>Practical for officers:</strong> Follow lawful
                          arrest-to-booking procedures; decisions about bail and
                          sentencing are judicial functions.
                        </div>
                      </CardContent>
                    </Card>

                    {/* Amendment 9 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>Amendment 9</Badge>
                          Rights Retained by the People (Unenumerated Rights)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          The enumeration of certain rights in the Constitution
                          does not mean other rights do not exist. People retain
                          rights beyond those specifically listed.
                        </p>
                        <div className="text-sm">
                          <strong>Example:</strong> Rights such as marriage or
                          other fundamental liberties are protected even if not
                          explicitly enumerated.
                        </div>
                      </CardContent>
                    </Card>

                    {/* Amendment 10 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>Amendment 10</Badge>
                          States' Rights / Reserved Powers
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Powers not delegated to the federal government are
                          reserved to the states or the people. This preserves a
                          balance between national and local authority.
                        </p>
                        <div className="text-sm">
                          <strong>Practical for officers:</strong> Be aware
                          local/state statutes and policies govern many aspects
                          of policing (education, licensing, local ordinances).
                        </div>
                      </CardContent>
                    </Card>

                    {/* Simple summary table */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Amendments — Simple Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <div>
                            <strong>1st</strong> — No religious discrimination;
                            free speech & assembly.
                          </div>
                          <div>
                            <strong>2nd</strong> — Right to bear arms
                            (regulated).
                          </div>
                          <div>
                            <strong>3rd</strong> — No quartering of soldiers /
                            no forced entry without authority.
                          </div>
                          <div>
                            <strong>4th</strong> — No unreasonable search &
                            seizure (warrant/probable cause required).
                          </div>
                          <div>
                            <strong>5th</strong> — No self-incrimination; lawful
                            evidence required; double jeopardy protected.
                          </div>
                          <div>
                            <strong>6th</strong> — Right to attorney, speedy &
                            public trial, confront witnesses.
                          </div>
                          <div>
                            <strong>7th</strong> — Right to jury trial in civil
                            cases (thresholds apply).
                          </div>
                          <div>
                            <strong>8th</strong> — No cruel or unusual
                            punishment; no excessive bail/fines.
                          </div>
                          <div>
                            <strong>9th</strong> — Protects rights not
                            explicitly listed in the Constitution.
                          </div>
                          <div>
                            <strong>10th</strong> — Powers not delegated to
                            federal government reserved to states/people.
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- Case Laws Tab --- */}
          <TabsContent value="cases">
            <Card>
              <CardHeader>
                <CardTitle>Landmark Case Laws</CardTitle>
                <CardDescription>
                  Precedent-setting judicial decisions and officer guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {/* Tennessee v. Garner */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle>Tennessee v. Garner</CardTitle>
                          <Badge variant="destructive">Use of Force</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          <strong>Holding:</strong> An officer may use deadly
                          force only when the officer has a good-faith belief
                          that the suspect poses a significant threat of death
                          or serious physical injury to the officer or others.
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Practical guidance:</strong> Before using
                          lethal force evaluate threat to life or serious bodily
                          harm, consider alternatives, identify yourself, and
                          give a warning when feasible. Document the perceived
                          threat and facts supporting the belief.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Terry v. Ohio */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle>Terry v. Ohio</CardTitle>
                          <Badge>Stop & Frisk</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          <strong>Holding:</strong> An officer may stop a person
                          based on reasonable suspicion of criminal activity and
                          conduct a frisk (pat-down) for weapons if the officer
                          reasonably believes the person is armed and dangerous.
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Practical guidance:</strong> Articulate the
                          specific facts creating reasonable suspicion. Frisk is
                          limited to a search for weapons — avoid exploratory
                          searches for evidence without probable cause or
                          consent.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Pennsylvania v. Mimms */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle>Pennsylvania v. Mimms</CardTitle>
                          <Badge>Traffic Stops</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          <strong>Holding:</strong> Ordering the driver out of a
                          vehicle during a lawful traffic stop is permissible
                          and does not, by itself, violate the Fourth Amendment.
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Practical guidance:</strong> Officers may
                          lawfully direct drivers to exit their vehicles for
                          officer safety. Take care to treat passengers
                          appropriately and only take further intrusions
                          (searches, detentions) with proper legal basis.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Wyoming v. Houghton */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle>Wyoming v. Houghton</CardTitle>
                          <Badge>Vehicle Search</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          <strong>Holding:</strong> If an officer has probable
                          cause to search a vehicle, that probable cause extends
                          to containers belonging to passengers that might
                          reasonably hold the item(s) sought.
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Practical guidance:</strong> When you have
                          probable cause to search a vehicle, consider
                          containers that could conceal the contraband. Document
                          the probable cause and scope before searching
                          passenger belongings.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Carroll v. United States */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle>Carroll v. United States</CardTitle>
                          <Badge>Auto Exception</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          <strong>Holding:</strong> The automobile exception
                          permits warrantless searches of vehicles when officers
                          have probable cause to believe the vehicle contains
                          contraband or evidence, given the vehicle's inherent
                          mobility.
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Practical guidance:</strong> If you rely on
                          the automobile exception, articulate the facts giving
                          rise to probable cause and limit the search to areas
                          where the evidence could be found. Secure and document
                          vehicle condition and items found.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Mike Smoore v. LSPD (local/procedural) */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle>Mike Smoore v. LSPD</CardTitle>
                          <Badge variant="secondary">
                            Felony Stop Procedure
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          <strong>Issue / Holding:</strong> Relates to
                          procedures for felony stops — after arrest, officers
                          must perform a protective sweep (including quickly
                          checking trunk) but avoid conducting a full inventory
                          search of the vehicle without proper authority.
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Practical guidance:</strong> After securing
                          suspects, conduct safety sweeps to locate threats or
                          contraband that pose immediate danger. Distinguish
                          protective sweeps from inventory searches; follow
                          departmental inventory procedures when applicable.
                        </p>
                      </CardContent>
                    </Card>

                    {/* The People v. Otto Delmar (exigent circumstances) */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle>The People v. Otto Delmar</CardTitle>
                          <Badge>Exigent Circumstances</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          <strong>Holding:</strong> Generally, officers need a
                          warrant to enter private property; however, exigent
                          circumstances (for example, a reasonable belief that a
                          person inside is injured and needs immediate aid) can
                          justify warrantless entry.
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Practical guidance:</strong> When entering
                          without a warrant, document the emergency facts (who,
                          what, where, when) and actions taken. Limit intrusion
                          to what is necessary to address the emergency and
                          preserve scene integrity for subsequent legal steps.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Miranda v. Arizona */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle>Miranda v. Arizona</CardTitle>
                          <Badge>Fifth Amendment</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          <strong>Holding:</strong> Statements obtained from
                          custodial interrogation are inadmissible unless the
                          suspect has been advised of Miranda rights (right to
                          remain silent, that statements may be used in court,
                          and right to an attorney).
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Practical guidance:</strong> Advise custodial
                          suspects of their Miranda rights before interrogation.
                          If a suspect invokes the right to counsel or to remain
                          silent, cease questioning and document the invocation
                          and subsequent actions.
                        </p>
                      </CardContent>
                    </Card>

                    {/* The People v. Georgina Williams (undercover exception) */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle>The People v. Georgina Williams</CardTitle>
                          <Badge>Undercover Operations</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          <strong>Holding:</strong> Conversations between
                          suspects and undercover officers can be admissible
                          without Miranda warnings because the suspect is not in
                          custody and is speaking to a covert law enforcement
                          agent.
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Practical guidance:</strong> Undercover
                          operations remain powerful investigative tools —
                          maintain strict operational security, use encrypted
                          comms for coordination, and ensure legal oversight for
                          any recordings or controlled buys.
                        </p>
                      </CardContent>
                    </Card>

                    {/* The People v. Meg Kyracruz (right to counsel) */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle>The People v. Meg Kyracruz</CardTitle>
                          <Badge>Right to Counsel</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">
                          <strong>Holding:</strong> If a suspect requests an
                          attorney, officers must provide access to counsel (or
                          cease interrogation) — the right to counsel is
                          fundamental and must be honored.
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Practical guidance:</strong> When a suspect
                          requests an attorney, stop interrogation immediately
                          and facilitate access to counsel. Document the request
                          and any steps taken to provide or arrange counsel.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- Police SOP Tab --- */}
          <TabsContent value="sop">
            <Card>
              <CardHeader>
                <CardTitle>
                  Police Department Standard Operating Procedures
                </CardTitle>
                <CardDescription>
                  Official protocols and guidelines for law enforcement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {/* Introduction */}
                    <AccordionItem value="introduction">
                      <AccordionTrigger>Introduction & Authority</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            San Andreas law enforcement derive authority from
                            the Executive Branch of San Andreas. Mission: "To
                            Protect and Serve" — ensure safety, security and
                            community wellbeing through law enforcement,
                            investigations and custody operations.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Officers are responsible for staying current with
                            SOP updates, regular training and recertification.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Oath */}
                    <AccordionItem value="oath">
                      <AccordionTrigger>Oath of Office</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            All officers take the official oath to support and
                            defend the Constitution of the State of San Andreas,
                            to discharge duties faithfully and without mental
                            reservation.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Agencies */}
                    <AccordionItem value="agencies">
                      <AccordionTrigger>Law Enforcement Agencies</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Major agencies covered: San Andreas State Police
                            (SASP), Los Santos Police Department (LSPD), Blaine
                            County Sheriff's Office (BCSO), San Andreas State
                            Park Rangers (SASPR). Each agency has jurisdictional
                            responsibilities and specialized roles.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Chain of Command */}
                    <AccordionItem value="chain-of-command">
                      <AccordionTrigger>
                        Chain of Command & Rank Structure
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Ranks are organized from Trainees (Cadet, Solo
                            Cadet) through Officer ranks (Officer, Senior
                            Officer, Corporal), Command (Sergeant,
                            Lieutenant/Major, Captain/Colonel) up to High
                            Command (Assistant Chief, Chief/Sheriff/Game
                            Warden). The chain of command establishes
                            supervision, responsibility and authority.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Code of Conduct */}
                    <AccordionItem value="code-of-conduct">
                      <AccordionTrigger>
                        Code of Conduct & Professionalism
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Officers must demonstrate specialized knowledge,
                            competency, honesty, integrity, accountability,
                            self-regulation and professional appearance. Treat
                            civilians with dignity, follow departmental dress
                            code, use only allotted vehicles, provide Miranda
                            and attorney access as required.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Legal Framework */}
                    <AccordionItem value="legal-framework">
                      <AccordionTrigger>
                        Legal Framework & Constitutional Rights
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Key rights and concepts: Miranda warnings (English &
                            Hindi variants provided in SOP), Reasonable
                            Suspicion (frisk/detain) and Probable Cause
                            (search/arrest). Frisk is limited to a pat-down for
                            weapons; searches require probable cause or consent.
                            Officers must respect constitutional protections.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Use of Force */}
                    <AccordionItem value="use-of-force">
                      <AccordionTrigger>Use of Force Continuum</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div className="border-l-4 border-green-500 pl-4 py-2">
                            <h4 className="mb-1">Level 1: Officer Presence</h4>
                            <p className="text-sm text-muted-foreground">
                              No physical force; deter or diffuse by presence.
                            </p>
                          </div>
                          <div className="border-l-4 border-blue-500 pl-4 py-2">
                            <h4 className="mb-1">Level 2: Verbal Commands</h4>
                            <p className="text-sm text-muted-foreground">
                              Calm, concise commands to gain compliance.
                            </p>
                          </div>
                          <div className="border-l-4 border-yellow-500 pl-4 py-2">
                            <h4 className="mb-1">Level 3: Empty-Hand Control</h4>
                            <p className="text-sm text-muted-foreground">
                              Soft (holds, joint locks) to gain control.
                            </p>
                          </div>
                          <div className="border-l-4 border-orange-500 pl-4 py-2">
                            <h4 className="mb-1">Level 4: Less-Lethal</h4>
                            <p className="text-sm text-muted-foreground">
                              Batons, tasers, chemical sprays; de-escalate asap.
                            </p>
                          </div>
                          <div className="border-l-4 border-red-500 pl-4 py-2">
                            <h4 className="mb-1">Level 5: Lethal Force</h4>
                            <p className="text-sm text-muted-foreground">
                              Only when facing imminent threat of death/serious
                              injury.
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded mt-2">
                            <p className="text-sm text-muted-foreground">
                              Officers must use only the force reasonable and
                              necessary. All force incidents require
                              documentation and review.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Vehicle Pursuit */}
                    <AccordionItem value="vehicle-pursuit">
                      <AccordionTrigger>
                        Vehicle Operations & Pursuit Procedures
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Response codes: Code 1 (routine), Code 2 (lights),
                            Code 3 (full emergency), Code 4 (cleared), Code 5
                            (felony stop). Pursuits: classify by danger (Code
                            Green/Amber/Red), roles include Primary (driving),
                            Secondary (comms), Tertiary (maneuvers). Maximum
                            typical units: 3 ground + 1 standby. PIT/spike
                            deployment and restrictions defined (authorization,
                            locations, speed limits).
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Traffic */}
                    <AccordionItem value="traffic">
                      <AccordionTrigger>Traffic Stop Procedures</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <h4 className="mb-1">1. Initiating the Stop</h4>
                          <p className="text-sm text-muted-foreground">
                            Reasonable suspicion required. Signal vehicle to a
                            safe location and notify dispatch.
                          </p>

                          <h4 className="mb-1">2. Officer Safety</h4>
                          <p className="text-sm text-muted-foreground">
                            Angle vehicle for protection, observe occupants,
                            request backup for high-risk stops.
                          </p>

                          <h4 className="mb-1">3. Contact & Documentation</h4>
                          <p className="text-sm text-muted-foreground">
                            Request license/registration/insurance, explain
                            reason, issue citation/warning and document.
                          </p>

                          <h4 className="mb-1">4. Search Authority</h4>
                          <p className="text-sm text-muted-foreground">
                            Searches require consent, probable cause, or
                            incident-to-arrest. Plain view doctrine applies.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Evidence */}
                    <AccordionItem value="evidence">
                      <AccordionTrigger>
                        Evidence Collection & Chain of Custody
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <h4 className="mb-1">1. Scene Security</h4>
                          <p className="text-sm text-muted-foreground">
                            Secure perimeter, limit access and document all
                            entrants.
                          </p>

                          <h4 className="mb-1">2. Documentation</h4>
                          <p className="text-sm text-muted-foreground">
                            Photograph/video before collection; note conditions
                            and times.
                          </p>

                          <h4 className="mb-1">3. Collection Protocol</h4>
                          <p className="text-sm text-muted-foreground">
                            Use PPE, package appropriately, label with case
                            metadata and collector's name.
                          </p>

                          <h4 className="mb-1">4. Chain of Custody</h4>
                          <p className="text-sm text-muted-foreground">
                            Log every transfer, signatures & dates; store in
                            secure evidence locker.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Specialized Units */}
                    <AccordionItem value="specialized-units">
                      <AccordionTrigger>
                        Specialized Units (HSPU, SEU, SWAT, EOD, MPU, K-9, CID)
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <h4 className="mb-1">
                            High Speed Pursuit Unit (HSPU)
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            HSPU personnel require certification, regular
                            recertification, specialized equipment (lights,
                            sirens, vests, dashcam, GPS, RAM bars) and body-cams
                            on pursuits. Chain of command includes Leads,
                            Supervisors and Certified Officers.
                          </p>

                          <h4 className="mb-1">Speed Enforcement Unit (SEU)</h4>
                          <p className="text-sm text-muted-foreground">
                            SEU has vehicle tiers (Mustang, Challenger,
                            Corvette, Viper) with operational limits (max
                            interceptors, certifications). Tier usage is
                            restricted by rank and certification.
                          </p>

                          <h4 className="mb-1">SWAT & EOD</h4>
                          <p className="text-sm text-muted-foreground">
                            SWAT handles high-risk incidents (hostage,
                            barricade, active shooter). Chain of command is
                            Commander -&gt; Team Leader -&gt; Operators. EOD
                            follows strict device assessment, disruptor usage
                            and prioritizes perimeter safety.
                          </p>

                          <h4 className="mb-1">Motorbike Pursuit Unit (MPU)</h4>
                          <p className="text-sm text-muted-foreground">
                            MPU provides agile response on motorcycles. Helmets
                            and heavy armor required, MPU may operate Code-1
                            with supervisor permission, and has specific
                            limitations for being a primary on stops and
                            pursuits.
                          </p>

                          <h4 className="mb-1">K-9 Task Force</h4>
                          <p className="text-sm text-muted-foreground">
                            K-9 teams require handler training and
                            certification. K-9s are less-lethal tools for
                            search/tracking and narcotics detection. Deployment
                            rules: not on compliant/custodial suspects, handlers
                            maintain care and chain-of-command reporting for
                            bites/incidents.
                          </p>

                          <h4 className="mb-1">
                            Criminal Investigations Division (CID)
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            CID focuses on major felonies, gang investigations
                            and undercover operations. Maintain gang database,
                            use encrypted comms for undercover, coordinate
                            high-risk arrests with SWAT and preserve evidence
                            chain-of-custody.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* General Ops */}
                    <AccordionItem value="general-operations">
                      <AccordionTrigger>
                        General Operations & Radio Protocols
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Starting shift: clock in at PD reception or MDT, set
                            callsign. Use radio 10-codes (10-2, 10-7, 10-8,
                            10-11, 10-15, 10-20, 10-42, 10-80) and follow "YOU
                            this is ME" format. Speak clearly, avoid chatter,
                            keep net clear for priority traffic.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Arrest Procedures */}
                    <AccordionItem value="arrest-procedures">
                      <AccordionTrigger>Arrest Procedures</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Arrests require probable cause or a valid warrant.
                            Use minimum force necessary, advise of Miranda
                            before custodial interrogation, document suspect
                            info, charges, witnesses, evidence and generate
                            arrest/booking reports.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Admin */}
                    <AccordionItem value="administrative">
                      <AccordionTrigger>
                        Administrative Policies (Ride-Alongs, Promotion,
                        Reinstatement)
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <h4 className="mb-1">Ride-Alongs</h4>
                          <p className="text-sm text-muted-foreground">
                            Civilian ride-alongs require screening and approval;
                            max two active. No uniform pieces for civilians;
                            follow safety restrictions.
                          </p>

                          <h4 className="mb-1">Promotion Guidelines</h4>
                          <p className="text-sm text-muted-foreground">
                            Promotions are merit-based. Progression rules (Cadet
                            -&gt; Solo Cadet -&gt; Officer -&gt; Senior Officer
                            -&gt; Corporal -&gt; Sergeant/Command) include
                            minimum time-in-grade, MDT/report requirements and
                            supervisor assessments. Durations reset after each
                            promotion.
                          </p>

                          <h4 className="mb-1">Reinstatement</h4>
                          <p className="text-sm text-muted-foreground">
                            Former officers may apply for reinstatement;
                            typically returned at one rank below previous rank
                            and must serve a 15-day minimum before further
                            promotion consideration.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Emergency Response */}
                    <AccordionItem value="emergency-response">
                      <AccordionTrigger>
                        Emergency Response Procedures
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <h4 className="mb-1">Gang Wars & Hostage</h4>
                          <p className="text-sm text-muted-foreground">
                            In-city gang conflicts: establish perimeter,
                            evacuate civilians, issue warnings, intervene if
                            needed. Hostage: prioritize safety, negotiate,
                            request SWAT for complex negotiations, breaching as
                            last resort.
                          </p>

                          <h4 className="mb-1">Active Shooter / Code Red</h4>
                          <p className="text-sm text-muted-foreground">
                            Immediate aggressive response; all available units
                            respond with lights/sirens and authorized to use
                            maximum force necessary.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Equipment */}
                    <AccordionItem value="equipment-safety">
                      <AccordionTrigger>
                        Equipment & Safety Requirements
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Mandatory equipment: issued Glock, taser, radio,
                            body armor, badge, uniform and vehicle equipment
                            (lights, sirens, first aid, cones, dashcam). Taser
                            and firearm safety rules: taser
                            constraints/warnings, firearm restraint, no warning
                            shots, avoid firing from moving vehicles unless life
                            is at risk.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Discipline */}
                    <AccordionItem value="discipline">
                      <AccordionTrigger>
                        Disciplinary Actions & Standards
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Most departments use a strike system (up to 3
                            strikes leading to termination). Violations include
                            incomplete MDTs, misuse of equipment, SOP
                            violations, criminal actions on/off duty. SEU and
                            unit-specific sanction rules apply (license
                            suspension/revocation).
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Special Response */}
                    <AccordionItem value="special-response">
                      <AccordionTrigger>
                        Boosting, Pursuit, & Street Racing Response
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Boost/response classifications (D -&gt; S classes)
                            define resources and personnel. Pursuit protocol
                            limits active pursuit units, PIT/spike restrictions,
                            ASU support requirements and refuel rules. Street
                            racing responses limit unit count and rely on Air-1
                            for tracking.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Uniforms */}
                    <AccordionItem value="uniforms-pr">
                      <AccordionTrigger>
                        Uniform Guidelines & Public Relations
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Uniforms must be clean, well-fitted, and display
                            badge/name tag. Officers should maintain
                            professional conduct on- and off-duty, avoid
                            discussing police matters in public chats, and refer
                            complaints to SROs or formal written reports. Keep
                            the public image positive.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Conclusion */}
                    <AccordionItem value="conclusion">
                      <AccordionTrigger>
                        Conclusion & Document Control
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            This Master SOP consolidates policies across San
                            Andreas law enforcement. Officers are responsible
                            for staying current with revisions. Effective date:
                            Current. Version: SASP SOP v1.0. Created by Preet
                            Joshi — use without permission prohibited.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- Sub Departments Tab --- */}
          <TabsContent value="subdepts">
            <Card>
              <CardHeader>
                <CardTitle>Police Sub Departments</CardTitle>
                <CardDescription>
                  Operational details for core specialized units
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* HSPU */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="destructive">HSPU</Badge>
                          High Speed Pursuit Unit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          HSPU handles high-speed intercepts, long-duration
                          pursuits and operations that exceed standard patrol
                          vehicle capabilities. Focused on safe suspect
                          apprehension while minimizing risk to the public.
                        </p>

                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Chain of Command:</strong>
                            <div>
                              • Overwatch / Command: HSPU Lead & Assistant Leads
                            </div>
                            <div>
                              • Supervisor / Trainer: Senior Officers certified
                              in all HSPU levels
                            </div>
                            <div>
                              • Officer (Certified): Completed HSPU training and
                              certified
                            </div>
                            <div>
                              • Probationary Officers: Undergoing evaluation for
                              certification
                            </div>
                          </div>

                          <div>
                            <strong>Authorization Requirements:</strong>
                            <div>
                              • Official HSPU certification program completion
                            </div>
                            <div>
                              • Valid SASP driver’s license and medical
                              clearance
                            </div>
                            <div>
                              • SEU certification at applicable level (1–4) and
                              documented recertification
                            </div>
                          </div>

                          <div>
                            <strong>Equipment Requirements:</strong>
                            <div>
                              • Emergency lighting & sirens, operational dashcam
                              & body-cam (record during pursuits)
                            </div>
                            <div>
                              • Ballistic vest (Level II+), hands-free comms,
                              vehicle RAM bar / push bumper
                            </div>
                            <div>
                              • GPS tracker/dispatch navigation, road
                              flares/cones, tire repair / spike strip kit (if
                              authorized)
                            </div>
                            <div>• First aid / trauma kit</div>
                          </div>

                          <div>
                            <strong>Additional notes:</strong>
                            <div>
                              • HSPU operations require documented pre-approval
                              for certain maneuvers (PIT, roadblocks).
                              Post-pursuit reviews (safety, legal, training
                              gaps) are mandatory — data from each event drives
                              training cycles.
                            </div>
                            <div>
                              • Mental health and fatigue management are
                              critical; limit continuous high-speed shifts and
                              require mandatory debrief + rest after major
                              pursuits.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* SEU */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>SEU</Badge>
                          Speed Enforcement Unit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          SEU focuses on proactive speed enforcement, planned
                          intercepts and high-performance vehicle operations.
                          Team operations emphasize vehicle control, risk
                          management and equipment proficiency.
                        </p>

                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Chain of Command:</strong>
                            <div>1. SEU Overwatch (final authority)</div>
                            <div>2. SEU Head</div>
                            <div>3. SEU Supervisor</div>
                            <div>4. SEU Instructor / Trainer</div>
                            <div>5. SEU Driver</div>
                            <div>
                              6. SEU Trainee (2–3 day supervised eval)
                            </div>
                          </div>

                          <div>
                            <strong>Vehicle Tiers & Requirements:</strong>
                            <div>
                              • Tier 1 — Ford Mustang: 140–150 MPH (Senior
                              Officer+)
                            </div>
                            <div>
                              • Tier 2 — Dodge Challenger: 150–160 MPH
                              (Corporal+)
                            </div>
                            <div>
                              • Tier 3 — Chevrolet Corvette: 160–170 MPH
                              (Corporal+)
                            </div>
                            <div>
                              • Tier 4 — Dodge Viper: 170+ MPH (Sergeant+;
                              restricted)
                            </div>
                          </div>

                          <div>
                            <strong>Operational Limits:</strong>
                            <div>
                              • Max 3 interceptors on patrol simultaneously
                            </div>
                            <div>• Max 2 interceptors in S-category pursuits</div>
                            <div>• Max 1 Viper in non-S-category pursuits</div>
                            <div>
                              • Max 3 interceptors for street racing incidents
                            </div>
                          </div>

                          <div>
                            <strong>Additional notes:</strong>
                            <div>
                              • Vehicle assignments consider officer experience,
                              recent recertification, and health/fitness for
                              duty. Use telemetry and dashcam data for
                              continuous improvement and incident
                              reconstruction.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* SWAT */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="destructive">SWAT</Badge>
                          Special Weapons & Tactics (with EOD)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          SWAT is deployed for the highest-risk, complex
                          incidents: hostage rescue, barricades, active
                          shooters, high-risk warrants. EOD supports
                          explosive/IED threats with specialized tools and
                          containment protocols.
                        </p>

                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Chain of Command & Roles:</strong>
                            <div>• Commander (division lead)</div>
                            <div>• Team Leader (training, tactics)</div>
                            <div>
                              • Sniper Operator (precision, AIR-1 operations)
                            </div>
                            <div>
                              • Operator (tactical entry & engagement)
                            </div>
                            <div>• Recruit (training phase)</div>
                            <div>
                              Note: SWAT chain of command supersedes standard
                              LSPD structure during deployments.
                            </div>
                          </div>

                          <div>
                            <strong>Selection & Training:</strong>
                            <div>
                              • Application + selection by SWAT command;
                              psychological screening and scenario-based
                              training
                            </div>
                            <div>
                              • Regular joint exercises with CID, HSPU, EOD, Air
                              Support and Tactical EMS
                            </div>
                          </div>

                          <div>
                            <strong>Deployment Protocols:</strong>
                            <div>
                              • Assess situation, gather intelligence, plan with
                              safety as priority
                            </div>
                            <div>
                              • Snipers deploy as Sierra-1 (sniper) &
                              Sierra-Oscar (spotter)
                            </div>
                            <div>
                              • No solo deployments; chain-of-command adherence
                              required
                            </div>
                            <div>
                              • Post-incident: secure area, render aid, maintain
                              evidence integrity and debrief
                            </div>
                          </div>

                          <div>
                            <strong>Equipment & EOD:</strong>
                            <div>
                              • Uniforms: black tactical kit, Level III+ armor,
                              helmets for assault teams
                            </div>
                            <div>
                              • Weapons: Remington 700 (.308), AR-15 (5.56),
                              Glock 17 (9mm) — employment per ROE
                            </div>
                            <div>
                              • EOD: MK/VI IEDD suits, Bearcat support,
                              disruptors, x-ray systems, blast containment tools
                            </div>
                          </div>

                          <div>
                            <strong>Discipline & Media Rules:</strong>
                            <div>
                              • Violations (streaming tactics, gang ties,
                              training absence) have strict sanctions up to
                              blacklisting
                            </div>
                          </div>

                          <div>
                            <strong>Additional notes:</strong>
                            <div>
                              • Legal oversight (search warrants, use-of-force
                              review) and TECC-trained medics embedded in teams
                              improve outcomes. Maintain robust after-action
                              reviews to address tactics, equipment failures,
                              and training needs.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* MPU */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="secondary">MPU</Badge>
                          Motorbike Pursuit Unit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          MPU provides rapid response in congested or narrow
                          environments where patrol cars are less effective.
                          Units must balance maneuverability with safety and
                          coordination.
                        </p>

                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Chain of Command:</strong>
                            <div>• MPU Department Overwatch</div>
                            <div>• Department Lead: Tim Brook</div>
                            <div>• Department Supervisor: Harshad Mehta</div>
                            <div>• Eligibility: Senior Officer+</div>
                          </div>

                          <div>
                            <strong>Basic MPU Test:</strong>
                            <div>1. Phase 1 — SOP knowledge</div>
                            <div>2. Phase 2 — Track run (control & cornering)</div>
                            <div>3. Phase 3 — Controlled chase simulation</div>
                          </div>

                          <div>
                            <strong>
                              Authorization & Operational Protocols:
                            </strong>
                            <div>
                              • Bike units may operate Code-1 only with
                              supervisor permission
                            </div>
                            <div>
                              • Helmet & heavy armor mandatory; first-aid kit &
                              repair kit required on every shift
                            </div>
                            <div>
                              • Prefer solo operation unless commanded
                              otherwise; MPU primary only under MPU Head / HC
                              supervision
                            </div>
                            <div>
                              • No solo 10-11 traffic stops on bike; wait for
                              support
                            </div>
                          </div>

                          <div>
                            <strong>Deployment Guidance:</strong>
                            <div>
                              • 90-D: First responder; yield to 4-wheeler PIU if
                              necessary
                            </div>
                            <div>
                              • 10-80 (chase) on bike-only pursuits or where
                              four-wheel units are ineffective
                            </div>
                            <div>
                              • Recommended bikes: agile and pursuit-rated
                              models — maintain strict maintenance logs
                            </div>
                          </div>

                          <div>
                            <strong>Additional notes:</strong>
                            <div>
                              • Emphasize rider fitness, PPE inspections, and
                              weather risk assessments. MPU riders rotate
                              frequently to avoid fatigue, and training includes
                              emergency braking, evasive maneuvers and casualty
                              care.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* CID */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>CID</Badge>
                          Criminal Investigations Division
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          CID investigates major crimes, organized crime,
                          financial offenses and gang activity. Operates both
                          overt and covert investigations with a strong emphasis
                          on legal process and evidence integrity.
                        </p>

                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Chain of Command:</strong>
                            <div>• Director of CID</div>
                            <div>• Deputy Director</div>
                            <div>• Lead Detective</div>
                            <div>
                              • Senior Detective / Detective / Trainee Detective
                            </div>
                          </div>

                          <div>
                            <strong>Jurisdiction & Mandate:</strong>
                            <div>
                              • Gang-related offenses, major felonies (homicide,
                              robbery, kidnapping), organized financial crimes,
                              undercover ops
                            </div>
                          </div>

                          <div>
                            <strong>
                              Gang Investigations & Undercover Protocols:
                            </strong>
                            <div>
                              • Maintain and validate Gang Database (members,
                              symbols, tattoos, vehicles, hideouts)
                            </div>
                            <div>
                              • Use encrypted comms for undercover operations;
                              regular check-ins and extraction plans required
                            </div>
                            <div>
                              • Coordinate high-risk arrests with SWAT and
                              document probable cause / search warrants
                              thoroughly
                            </div>
                          </div>

                          <div>
                            <strong>Evidence & Documentation:</strong>
                            <div>
                              • Log all evidence into SASP Evidence Locker with
                              full chain-of-custody records
                            </div>
                            <div>
                              • Maintain comprehensive case files and provide
                              weekly updates to CID leadership
                            </div>
                          </div>

                          <div>
                            <strong>Training & Inter-Unit Collaboration:</strong>
                            <div>
                              • Mandatory modules: gang ID, undercover safety,
                              covert comms, infiltration roleplay
                            </div>
                            <div>
                              • Work closely with Gang Unit, SWAT, HSPU and
                              Prosecutor's Office for integrated operations
                            </div>
                          </div>

                          <div>
                            <strong>Additional notes:</strong>
                            <div>
                              • Legal oversight and early prosecutor engagement
                              reduce case risk. Ensure witness protection and
                              confidentiality measures for sensitive informants.
                              Stress officer wellness & counseling for prolonged
                              undercover deployments.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* K-9 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge>K-9</Badge>
                          K-9 Joint Task Force
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          K-9 teams deliver strong detection and tracking
                          capabilities. The unit prioritizes canine welfare,
                          clear deployment criteria and rigorous handler
                          training.
                        </p>

                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Chain of Command:</strong>
                            <div>• K-9 Unit Commander</div>
                            <div>• K-9 Handler</div>
                            <div>• K-9 (canine asset)</div>
                          </div>

                          <div>
                            <strong>Application & Training:</strong>
                            <div>
                              • Eligibility: Serving LEO, Officer I / Trooper /
                              Deputy+
                            </div>
                            <div>
                              • Application review (up to 72 hrs), structured
                              training (handler & canine), FTO evaluation before
                              certification
                            </div>
                          </div>

                          <div>
                            <strong>Deployment & Use-of-Force:</strong>
                            <div>
                              • K-9 is a less-lethal tool — not for subjects who
                              have submitted or are in custody
                            </div>
                            <div>
                              • Handler must call off the dog once subject is
                              controlled and continuously assess for risk
                            </div>
                          </div>

                          <div>
                            <strong>
                              Operational Procedures & Capabilities:
                            </strong>
                            <div>
                              • Uses: building/area searches, tracking, crowd
                              control (limited), tactical deployments with SWAT,
                              narcotics detection
                            </div>
                            <div>
                              • Minimum detectable amounts: Marijuana 7g,
                              Hashish 4g, Cocaine/Heroin/Meth 10g
                            </div>
                            <div>
                              • Procedures: perimeter setup, cover officer
                              assignment, announcement of K-9 presence before
                              deployment
                            </div>
                          </div>

                          <div>
                            <strong>Care, Safety & Commands:</strong>
                            <div>
                              • Handlers ensure food, water, vet checks, rest
                              and appropriate protective gear
                            </div>
                            <div>
                              • Post-bite: immediate injury assessment,
                              supervisor notification and medical attention for
                              dog & person
                            </div>
                            <div>
                              • Example in-game commands (for handlers):{" "}
                              <code>/k9 spawn {"{breed}"}</code>,{" "}
                              <code>/k9 attack</code>,{" "}
                              <code>/k9 search {"{target}"}</code>,{" "}
                              <code>/k9 sit</code>
                            </div>
                          </div>

                          <div>
                            <strong>Additional notes:</strong>
                            <div>
                              • Maintain clear records for canine deployments
                              and bites. Regular welfare audits, fitness testing
                              and scenario-based training improve reliability
                              and reduce liability.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}