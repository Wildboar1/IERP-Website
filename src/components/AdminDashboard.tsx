import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, CheckCircle2, XCircle, Clock, Plus } from "lucide-react";

interface Application {
  _id: string;
  fullName: string;
  email: string;
  discord: string;
  department: string;
  position?: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  experience?: string;
  whyJoin: string;
  availability?: string;
  phone?: string;
}

export function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [showTestForm, setShowTestForm] = useState(false);
  const [testFormData, setTestFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    discord: "",
    department: "lspd" as "lspd" | "doj",
    experience: "",
    whyJoin: "",
    availability: "",
  });
  const [submittingTest, setSubmittingTest] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/applications", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: "approved" | "rejected", notes?: string) => {
    try {
      const endpoint = newStatus === "approved" ? "/api/applications-approve" : "/api/applications-reject";
      console.log(`Sending ${newStatus} request to:`, endpoint);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ applicationId: appId, notes }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`${newStatus} failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // Show detailed error message
        const errorMsg = errorData.details 
          ? `${errorData.error || 'Error'} - ${errorData.details}`
          : errorData.error || response.statusText || 'Unknown error';
        
        alert(`Failed to ${newStatus} application:\n\n${errorMsg}\n\nCheck Vercel logs for details.`);
        throw new Error(errorData.error || `Failed to update status (${response.status})`);
      }

      const updated = await response.json();
      setApplications(applications.map(app => app._id === appId ? updated : app));
      setSelectedApp(updated);
      console.log(`✓ Application ${newStatus}:`, appId);
      alert(`Application ${newStatus} successfully!`);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleSubmitTestApplication = async () => {
    try {
      setSubmittingTest(true);
      const response = await fetch("/api/applications/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(testFormData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Error: " + error.error);
        return;
      }

      const result = await response.json();
      alert("Test application submitted successfully!");
      setShowTestForm(false);
      setTestFormData({
        fullName: "",
        email: "",
        phone: "",
        discord: "",
        department: "lspd",
        experience: "",
        whyJoin: "",
        availability: "",
      });
      fetchApplications();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit test application");
    } finally {
      setSubmittingTest(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">You must be logged in to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Admin Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">You do not have permission to access the admin dashboard. Contact an administrator for access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredApps = filter === "all" 
    ? applications 
    : applications.filter(app => app.status === filter);

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "pending").length,
    approved: applications.filter(app => app.status === "approved").length,
    rejected: applications.filter(app => app.status === "rejected").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage department applications</p>
      </div>

      <div className="mb-6">
        <Button onClick={() => setShowTestForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Test Application
        </Button>
      </div>

      {showTestForm && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Test Application
            </CardTitle>
            <CardDescription>Submit a test application and test approval/rejection with Discord notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={testFormData.fullName}
                  onChange={(e) => setTestFormData({ ...testFormData, fullName: e.target.value })}
                  placeholder="Test User"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={testFormData.email}
                  onChange={(e) => setTestFormData({ ...testFormData, email: e.target.value })}
                  placeholder="test@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={testFormData.phone}
                  onChange={(e) => setTestFormData({ ...testFormData, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Discord Username</label>
                <Input
                  value={testFormData.discord}
                  onChange={(e) => setTestFormData({ ...testFormData, discord: e.target.value })}
                  placeholder="TestUser#0000"
                />
              </div>
            </div>
            <div>
              <label htmlFor="test-department" className="text-sm font-medium">Department</label>
              <select
                id="test-department"
                value={testFormData.department}
                onChange={(e) => setTestFormData({ ...testFormData, department: e.target.value as "lspd" | "doj" })}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="lspd">LSPD - Los Santos Police Department</option>
                <option value="doj">DOJ - Department of Justice</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Why Join</label>
              <Textarea
                value={testFormData.whyJoin}
                onChange={(e) => setTestFormData({ ...testFormData, whyJoin: e.target.value })}
                placeholder="Tell us why you want to join..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Experience</label>
              <Textarea
                value={testFormData.experience}
                onChange={(e) => setTestFormData({ ...testFormData, experience: e.target.value })}
                placeholder="Your experience (optional)"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Availability</label>
              <Input
                value={testFormData.availability}
                onChange={(e) => setTestFormData({ ...testFormData, availability: e.target.value })}
                placeholder="e.g., 10 hours/week"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSubmitTestApplication}
                disabled={submittingTest}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {submittingTest ? "Submitting..." : "Submit Test Application"}
              </Button>
              <Button
                onClick={() => setShowTestForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <div className="flex gap-2 mt-4">
                {(["all", "pending", "approved", "rejected"] as const).map(status => (
                  <Button
                    key={status}
                    variant={filter === status ? "default" : "outline"}
                    onClick={() => setFilter(status)}
                    size="sm"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading applications...</div>
              ) : filteredApps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No applications found</div>
              ) : (
                <div className="space-y-3">
                  {filteredApps.map(app => (
                    <button
                      key={app._id}
                      onClick={() => setSelectedApp(app)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedApp?._id === app._id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{app.fullName}</div>
                          <div className="text-sm text-muted-foreground">{app.department.toUpperCase()}</div>
                        </div>
                        <Badge
                          variant={
                            app.status === "approved"
                              ? "default"
                              : app.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Application Details */}
        <div className="lg:col-span-1">
          {selectedApp ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedApp.fullName}</CardTitle>
                <CardDescription>{new Date(selectedApp.appliedAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedApp.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Discord</label>
                  <p className="text-sm text-muted-foreground">{selectedApp.discord}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-muted-foreground">{selectedApp.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <p className="text-sm text-muted-foreground">{selectedApp.department.toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Why Join</label>
                  <p className="text-sm text-muted-foreground">{selectedApp.whyJoin}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Experience</label>
                  <p className="text-sm text-muted-foreground">{selectedApp.experience || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Availability</label>
                  <p className="text-sm text-muted-foreground">{selectedApp.availability || "Not specified"}</p>
                </div>

                {selectedApp.status === "pending" && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(selectedApp._id, "approved")}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusChange(selectedApp._id, "rejected")}
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Select an application to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
