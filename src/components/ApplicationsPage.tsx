import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { FileText, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const departments = [
  {
    value: "doj",
    label: "Department Of Justice",
    logo: "/doj logo.webp",
    positions: ["Chief Of Justice", "Judge", "District Attorney", "Public Defender"],
  },
  {
    value: "lspd",
    label: "Los Santos Police Department",
    logo: "/lspd logo.png",
    positions: ["Chief Of LSPD", "Assistant Chief Of LSPD", "Captain", "Officer", "Cadet"],
  },
];

const createEmptyLspdResponses = () => ({
  motivation: "",
  realisticRoleplay: "",
  rudeButNotIllegal: "",
  officerMisconduct: "",
  nonCompliantStop: "",
  balanceWinRp: "",
  abuseAccusation: "",
  injuryRoleplay: "",
  officerQualities: "",
  mistakeHandling: "",
});

export function ApplicationsPage() {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    discord: "",
    experience: "",
    whyJoin: "",
    availability: "",
    lspdQuestions: createEmptyLspdResponses(),
  });
  const isLspd = selectedDepartment === "lspd";

  // Check if user has already submitted on mount
  useEffect(() => {
    const submitted = localStorage.getItem('application_submitted');
    if (submitted === 'true') {
      setHasSubmitted(true);
      setSubmissionSuccess(true);
    }
  }, []);

  // Auto-populate Discord username when user logs in
  useEffect(() => {
    if (user?.username && !formData.discord) {
      setFormData(prev => ({
        ...prev,
        discord: user.username
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim whitespace from fields
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const discord = formData.discord.trim();
    const whyJoin = formData.whyJoin.trim();
    const trimmedLspdQuestions = Object.fromEntries(
      Object.entries(formData.lspdQuestions || {}).map(([key, value]) => [key, (value || "").trim()])
    );
    const lspdQuestionLabels: Record<string, string> = {
      motivation: "LSPD - Why join / approach",
      realisticRoleplay: "LSPD - Realistic roleplay meaning",
      rudeButNotIllegal: "LSPD - Handling rude but legal suspect",
      officerMisconduct: "LSPD - Officer breaking rules",
      nonCompliantStop: "LSPD - Non-violent refusal",
      balanceWinRp: "LSPD - Winning vs RP",
      abuseAccusation: "LSPD - Accused of power abuse",
      injuryRoleplay: "LSPD - Injury roleplay",
      officerQualities: "LSPD - Officer qualities",
      mistakeHandling: "LSPD - Handling your mistake",
    };
    
    // Debug logging
    console.log("=== Form Submission Debug ===");
    console.log("Selected Department:", selectedDepartment);
    console.log("Full Name (raw):", formData.fullName);
    console.log("Full Name (trimmed):", fullName);
    console.log("Email (trimmed):", email);
    console.log("Discord (trimmed):", discord);
    console.log("Why Join (trimmed):", whyJoin);
    console.log("Form Data:", formData);
    
    if (!selectedDepartment || !fullName || !email || !discord || !whyJoin) {
      const missing = [];
      if (!selectedDepartment) missing.push("Department");
      if (!fullName) missing.push("Full Name");
      if (!email) missing.push("Email");
      if (!discord) missing.push("Discord ID");
      if (!whyJoin) missing.push("Why Join");

      const errorMsg = `Please fill in all required fields: ${missing.join(", ")}`;
      console.error("Validation failed:", missing);
      toast.error(errorMsg);
      return;
    }

    const lspdMissing = isLspd
      ? Object.entries(trimmedLspdQuestions)
          .filter(([, value]) => !value)
          .map(([key]) => lspdQuestionLabels[key] || key)
      : [];

    if (lspdMissing.length) {
      const errorMsg = `Please answer all LSPD questions: ${lspdMissing.join(", ")}`;
      console.error("LSPD validation failed:", lspdMissing);
      toast.error(errorMsg);
      return;
    }

    try {
      const response = await fetch("/api/applications/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: fullName,
          email: email,
          discord: discord,
          experience: formData.experience.trim(),
          whyJoin: whyJoin,
          availability: formData.availability.trim(),
          department: selectedDepartment,
          lspdQuestions: isLspd ? trimmedLspdQuestions : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error response:", errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      // Set submission success state and mark as submitted
      setSubmissionSuccess(true);
      setHasSubmitted(true);
      localStorage.setItem('application_submitted', 'true');
      
      toast.success("Application Submitted Successfully!", {
        description: `Your application for ${departments.find(d => d.value === selectedDepartment)?.label} has been received. You will be notified of the outcome via email.`,
        icon: <CheckCircle2 className="w-4 h-4" />,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        discord: "",
        experience: "",
        whyJoin: "",
        availability: "",
        lspdQuestions: createEmptyLspdResponses(),
      });
    } catch (error) {
      console.error("Application error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to submit application", {
        description: errorMessage,
      });
    }
  };

  const selectedDept = departments.find(d => d.value === selectedDepartment);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Department Applications</h1>
        <p className="text-muted-foreground">Apply to join one of our prestigious departments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Select Department</CardTitle>
              <CardDescription>Choose the department you'd like to join</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departments.map((dept) => {
                  return (
                    <button
                      key={dept.value}
                      onClick={() => setSelectedDepartment(dept.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedDepartment === dept.value
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                          <img src={dept.logo} alt={`${dept.label} Logo`} className="h-10 w-10 object-contain" />
                        </div>
                        <div className="flex-1">
                          <div>{dept.label}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedDept && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Requirements
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Must be 18+ years old</li>
                    <li>• Active Discord account</li>
                    <li>• Good microphone quality</li>
                    <li>• No previous bans</li>
                    <li>• Minimum 10 hours/week availability</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDept ? `Apply to ${selectedDept.label}` : "Application Form"}
              </CardTitle>
              <CardDescription>
                Fill out the form below to submit your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissionSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Application Submitted!</h3>
                  <p className="text-muted-foreground mb-4">
                    Your application has been successfully submitted and is now under review.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>What happens next?</strong>
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>✓ Your application is being reviewed by our team</li>
                      <li>✓ You will receive an email notification with the decision</li>
                      <li>✓ You will also get a Discord notification</li>
                      <li>✓ Review typically takes 24 hours</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-red-800">
                      <strong>⚠️ Application Limit Reached</strong><br />
                      You can only submit <strong>ONE application</strong>. Multiple submissions are not allowed and will result in automatic rejection.
                    </p>
                  </div>
                </div>
              ) : !selectedDepartment ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Please select a department to begin your application</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-4">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discord">
                        Discord ID <span className="text-red-500">*</span>
                      </Label>
                        <Input
                          id="discord"
                          placeholder="username#0000"
                          value={formData.discord}
                          onChange={(e) =>
                            setFormData({ ...formData, discord: e.target.value })
                          }
                          readOnly={!!(user?.username && formData.discord === user.username)}
                          title={user?.username ? "Auto-filled from your Discord profile" : ""}
                          required
                        />
                        {user?.username && formData.discord === user.username && (
                          <p className="text-xs text-green-600">✓ Auto-filled from your Discord profile</p>
                        )}
                      </div>
                  </div>

                  {/* Application Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">
                        Previous Roleplay Experience
                      </Label>
                      <Textarea
                        id="experience"
                        placeholder="Describe your previous roleplay experience, servers you've played on, and any relevant positions held..."
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({ ...formData, experience: e.target.value })
                        }
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whyJoin">
                        Why do you want to join this department? <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="whyJoin"
                        placeholder="Tell us why you're interested in joining this department and what you can bring to the team..."
                        value={formData.whyJoin}
                        onChange={(e) =>
                          setFormData({ ...formData, whyJoin: e.target.value })
                        }
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Weekly Availability</Label>
                      <Input
                        id="availability"
                        placeholder="e.g., Monday-Friday 6PM-10PM, Weekends 2PM-8PM"
                        value={formData.availability}
                        onChange={(e) =>
                          setFormData({ ...formData, availability: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {isLspd && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-4">LSPD Scenario Questions</h3>
                        <p className="text-sm text-muted-foreground">These questions are required for LSPD applications to ensure realistic police roleplay.</p>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="lspd-motivation">
                            Why do you want to join the police department in this roleplay server, and what makes your approach different from others? <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="lspd-motivation"
                            placeholder="Explain your motivation and what sets you apart."
                            value={formData.lspdQuestions.motivation}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lspdQuestions: { ...formData.lspdQuestions, motivation: e.target.value },
                              })
                            }
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lspd-realistic">
                            What does “realistic roleplay” mean to you? Give one example of good police RP and one example of bad police RP. <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="lspd-realistic"
                            placeholder="Share your definition and one good and bad example."
                            value={formData.lspdQuestions.realisticRoleplay}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lspdQuestions: { ...formData.lspdQuestions, realisticRoleplay: e.target.value },
                              })
                            }
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lspd-rude">
                            If you stop a suspect who is being rude but not breaking any laws, how would you handle the situation in RP? <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="lspd-rude"
                            placeholder="Describe how you would respond and de-escalate."
                            value={formData.lspdQuestions.rudeButNotIllegal}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lspdQuestions: { ...formData.lspdQuestions, rudeButNotIllegal: e.target.value },
                              })
                            }
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lspd-misconduct">
                            You witness a fellow officer breaking server rules or power-gaming. What would you do? <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="lspd-misconduct"
                            placeholder="Explain your steps and reporting approach."
                            value={formData.lspdQuestions.officerMisconduct}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lspdQuestions: { ...formData.lspdQuestions, officerMisconduct: e.target.value },
                              })
                            }
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lspd-noncompliant">
                            A suspect refuses to cooperate during a traffic stop but is not violent. What steps would you take, and why? <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="lspd-noncompliant"
                            placeholder="Outline your process and justification."
                            value={formData.lspdQuestions.nonCompliantStop}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lspdQuestions: { ...formData.lspdQuestions, nonCompliantStop: e.target.value },
                              })
                            }
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lspd-balance">
                            How would you balance winning a situation versus maintaining realistic roleplay? <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="lspd-balance"
                            placeholder="Share how you prioritize realism over winning."
                            value={formData.lspdQuestions.balanceWinRp}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lspdQuestions: { ...formData.lspdQuestions, balanceWinRp: e.target.value },
                              })
                            }
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lspd-abuse">
                            What would you do if a civilian accuses you of abusing police power during an interaction? <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="lspd-abuse"
                            placeholder="Explain your response and documentation approach."
                            value={formData.lspdQuestions.abuseAccusation}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lspdQuestions: { ...formData.lspdQuestions, abuseAccusation: e.target.value },
                              })
                            }
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lspd-injury">
                            Explain how you would roleplay being injured after a shootout, even if the game mechanics allow you to move freely. <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="lspd-injury"
                            placeholder="Describe how you'd represent injuries and call for help."
                            value={formData.lspdQuestions.injuryRoleplay}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lspdQuestions: { ...formData.lspdQuestions, injuryRoleplay: e.target.value },
                              })
                            }
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lspd-qualities">
                            What are the most important qualities a police officer should have in roleplay, and which of those qualities do you personally bring? <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="lspd-qualities"
                            placeholder="List key qualities and note which you exemplify."
                            value={formData.lspdQuestions.officerQualities}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lspdQuestions: { ...formData.lspdQuestions, officerQualities: e.target.value },
                              })
                            }
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lspd-mistake">
                            If you make a mistake during RP that affects another player, how would you handle it? <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="lspd-mistake"
                            placeholder="Explain how you would address and correct the mistake."
                            value={formData.lspdQuestions.mistakeHandling}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lspdQuestions: { ...formData.lspdQuestions, mistakeHandling: e.target.value },
                              })
                            }
                            rows={3}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="text-red-500">*</span> Required fields
                    </p>
                    <Button type="submit" size="lg" className="min-w-[200px]">
                      Submit Application
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          {selectedDepartment && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-0.5">1</Badge>
                    <div>
                      <strong>Application Review</strong>
                      <p className="text-muted-foreground">
                        Your application will be reviewed by department leadership within 24 hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-0.5">2</Badge>
                    <div>
                      <strong>Interview Invitation</strong>
                      <p className="text-muted-foreground">
                        If selected, you'll receive a Discord message to schedule an interview.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-0.5">3</Badge>
                    <div>
                      <strong>Training & Onboarding</strong>
                      <p className="text-muted-foreground">
                        Upon acceptance, you'll undergo training specific to your department and role.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
