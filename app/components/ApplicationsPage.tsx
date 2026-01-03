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

export function ApplicationsPage() {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    discord: "",
    experience: "",
    whyJoin: "",
    availability: "",
  });

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
          phone: formData.phone.trim(),
          discord: discord,
          experience: formData.experience.trim(),
          whyJoin: whyJoin,
          availability: formData.availability.trim(),
          department: selectedDepartment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error response:", errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      toast.success("Application Submitted Successfully!", {
        description: `Your application for ${departments.find(d => d.value === selectedDepartment)?.label} has been received. You will be notified of the outcome via email.`,
        icon: <CheckCircle2 className="w-4 h-4" />,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        discord: "",
        experience: "",
        whyJoin: "",
        availability: "",
      });
      setSelectedDepartment("");
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
              {!selectedDepartment ? (
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
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
                        Your application will be reviewed by department leadership within 48 hours.
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
