import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { LGA_DATA, WardSummary } from "@/data/mockElectionData";
import { api } from "@/services/api";
import { PartyConfiguration } from "@/components/admin/PartyConfiguration";

const Admin = () => {
    const { toast } = useToast();

    // State for Incidents
    const [incidentForm, setIncidentForm] = useState({
        title: "",
        description: "",
        lga: "",
        type: "Disturbance",
        severity: "Medium",
        disagreement: false,
        intimidation: false,
        disruption: false
    });

    // State for LGA Data
    const [lgaConfig, setLgaConfig] = useState({
        lga: "",
        ward: ""
    });

    const [availableWards, setAvailableWards] = useState<WardSummary[]>([]);
    const [activeParties, setActiveParties] = useState<string[]>([]);

    useEffect(() => {
        if (lgaConfig.lga) {
            // Fetch Wards
            api.getWards(lgaConfig.lga).then((data: any) => {
                setAvailableWards(data);
            }).catch(err => {
                console.error("Failed to fetch wards:", err);
                toast({ title: "Error", description: "Failed to load wards.", variant: "destructive" });
            });

            // Fetch configured parties for this LGA
            api.getAreaCouncilParties(lgaConfig.lga).then((parties) => {
                setActiveParties(parties && parties.length > 0 ? parties : ["APC", "PDP", "LP", "NNPP"]); // Default fallback
            }).catch(err => {
                console.error("Failed to fetch parties:", err);
                // Fallback to defaults if fetch fails
                setActiveParties(["APC", "PDP", "LP", "NNPP", "APGA", "ADC", "SDP", "YPP"]);
            });
        } else {
            setAvailableWards([]);
            setActiveParties([]);
        }
    }, [lgaConfig.lga, toast]);

    const [logisticsForm, setLogisticsForm] = useState({
        arrivalTime: "",
        collationStartTime: ""
    });

    const [staffingForm, setStaffingForm] = useState({
        inecOfficers: "",
        femaleOfficers: "",
        securityPresent: "no",
        partyAgents: ""
    });

    const [integrityForm, setIntegrityForm] = useState({
        ec8bSubmitted: false,
        ec8cCollated: false,
        csrvsChecked: false,
        ec40gTransferred: false,
        ec40hTransferred: false,
        votesAnnounced: false,
        agentsConsigned: false,
        ec8cDistributed: false,
        ec60eDisplayed: false
    });

    const [resultsForm, setResultsForm] = useState({
        // Party Agent Participation (Countersigning)
        apcSigned: "no",
        pdpSigned: "no",
        lpSigned: "no",
        apgaSigned: "no",
        nnppSigned: "no",
        othersSigned: "no",

        // Voting Stats
        registeredVoters: "",
        accreditedVoters: "",
        totalVotesCast: "",
        totalValidVotes: "",
        totalRejectedVotes: "",
        cancelledPus: "",
        cancelledVoters: "",

        // Results
        apcVotes: "",
        pdpVotes: "",
        lpVotes: "",
        nnppVotes: "",
        apgaVotes: "",
        sdpVotes: "",
        adcVotes: "",
        appVotes: "",
        yppVotes: "",
        zlpVotes: "",
        othersVotes: ""
    });

    // Submissions Handlers
    const handleIncidentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting incident:", incidentForm);
        // TODO: Implement Incident API
        toast({ title: "Incident Logged", description: "Security incident recorded (Local only)." });
        setIncidentForm({ ...incidentForm, title: "", description: "" });
    };

    const handleLogisticsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lgaConfig.ward) return;

        try {
            await api.submitLogistics({
                ward_id: lgaConfig.ward,
                arrival_time: logisticsForm.arrivalTime,
                collation_start_time: logisticsForm.collationStartTime
            });
            toast({ title: "Logistics Updated", description: "Arrival and collation times saved." });
        } catch (err) {
            toast({ title: "Error", description: "Failed to save logistics.", variant: "destructive" });
        }
    };

    const handleStaffingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lgaConfig.ward) return;

        try {
            await api.submitStaffing({
                ward_id: lgaConfig.ward,
                inec_staff: parseInt(staffingForm.inecOfficers) || 0,
                security_present: staffingForm.securityPresent === "yes",
                party_agents: parseInt(staffingForm.partyAgents) || 0
            });
            toast({ title: "Staffing Updated", description: "Personnel counts saved." });
        } catch (err) {
            toast({ title: "Error", description: "Failed to save staffing.", variant: "destructive" });
        }
    };

    const handleIntegritySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lgaConfig.ward) return;

        try {
            await api.submitIntegrity({
                ward_id: lgaConfig.ward,
                ec8b_submitted: integrityForm.ec8bSubmitted,
                ec8c_collated: integrityForm.ec8cCollated,
                csrvs_done: integrityForm.csrvsChecked,
                votes_announced: integrityForm.votesAnnounced,
                agents_countersigned: integrityForm.agentsConsigned,
                ec60e_displayed: integrityForm.ec60eDisplayed
            });
            toast({ title: "Integrity Checks Updated", description: "Process compliance checklist saved." });
        } catch (err) {
            toast({ title: "Error", description: "Failed to save integrity.", variant: "destructive" });
        }
    };

    const handleResultsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lgaConfig.ward) return;

        try {
            await api.submitResults({
                ward_id: lgaConfig.ward,
                accredited_voters: parseInt(resultsForm.accreditedVoters) || 0,
                valid_votes: parseInt(resultsForm.totalValidVotes) || 0,
                rejected_votes: parseInt(resultsForm.totalRejectedVotes) || 0,
                votes_cast: parseInt(resultsForm.totalVotesCast) || 0
            });
            toast({ title: "Results Updated", description: "Votes and accreditation data saved." });
        } catch (err) {
            toast({ title: "Error", description: "Failed to save results.", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Election Admin Panel</h1>
                    <div className="flex gap-2">
                        <Button variant="outline">Export Data</Button>
                        <Button variant="destructive">Emergency Stop</Button>
                    </div>
                </div>

                <Tabs defaultValue="incidents" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
                        <TabsTrigger value="incidents">Log Incidents</TabsTrigger>
                        <TabsTrigger value="results">Area Council Results</TabsTrigger>
                        <TabsTrigger value="config">System Config</TabsTrigger>
                    </TabsList>

                    {/* Incidents Tab */}
                    <TabsContent value="incidents">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security & Disruptions Log</CardTitle>
                                <CardDescription>Report new security threats, procedural violations, or disruptions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleIncidentSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="inc-lga">Affected Area Council</Label>
                                                <Select value={incidentForm.lga} onValueChange={(v) => setIncidentForm({ ...incidentForm, lga: v })}>
                                                    <SelectTrigger id="inc-lga"><SelectValue placeholder="Select Area Council" /></SelectTrigger>
                                                    <SelectContent>
                                                        {LGA_DATA.map(lga => (
                                                            <SelectItem key={lga.id} value={lga.id}>{lga.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="inc-type">Incident Type</Label>
                                                <Select value={incidentForm.type} onValueChange={(v) => setIncidentForm({ ...incidentForm, type: v })}>
                                                    <SelectTrigger id="inc-type"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Disturbance">Disturbance</SelectItem>
                                                        <SelectItem value="Violence">Violence/Intimidation</SelectItem>
                                                        <SelectItem value="Logistics">Logistics Failure</SelectItem>
                                                        <SelectItem value="Fraud">Vote Buying/Fraud</SelectItem>
                                                        <SelectItem value="Equipment">BVAS/Equipment Failure</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Label>Risk Indicators</Label>
                                            <div className="space-y-3 border p-4 rounded-md">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="disagreement"
                                                        checked={incidentForm.disagreement}
                                                        onCheckedChange={(c) => setIncidentForm({ ...incidentForm, disagreement: c as boolean })}
                                                    />
                                                    <Label htmlFor="disagreement">Disagreement with results?</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="intimidation"
                                                        checked={incidentForm.intimidation}
                                                        onCheckedChange={(c) => setIncidentForm({ ...incidentForm, intimidation: c as boolean })}
                                                    />
                                                    <Label htmlFor="intimidation">Intimidation or Harassment?</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="disruption"
                                                        checked={incidentForm.disruption}
                                                        onCheckedChange={(c) => setIncidentForm({ ...incidentForm, disruption: c as boolean })}
                                                    />
                                                    <Label htmlFor="disruption">Attempted Process Disruption?</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="inc-title">Title</Label>
                                        <Input id="inc-title" placeholder="Brief summary" value={incidentForm.title} onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="inc-desc">Description</Label>
                                        <Textarea id="inc-desc" placeholder="Detailed account..." className="min-h-[100px]" value={incidentForm.description} onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })} />
                                    </div>
                                    <Button type="submit" variant="destructive" className="w-full">Log Incident</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Results Tab - MODULARIZED */}
                    <TabsContent value="results">
                        <Card>
                            <CardHeader>
                                <CardTitle>Area Council Result & Process Verification</CardTitle>
                                <CardDescription>Complete collation data entry via independent modules.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">

                                {/* GLOBAL SELECTOR */}
                                <div className="p-4 bg-muted/30 rounded-lg border">
                                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-4">Select Target Location</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Area Council</Label>
                                            <Select value={lgaConfig.lga} onValueChange={(v) => {
                                                setLgaConfig({ lga: v, ward: "" });
                                            }}>
                                                <SelectTrigger><SelectValue placeholder="Select Area Council" /></SelectTrigger>
                                                <SelectContent>
                                                    {LGA_DATA.map(lga => (
                                                        <SelectItem key={lga.id} value={lga.id}>{lga.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Ward (Optional)</Label>
                                            <Select
                                                value={lgaConfig.ward}
                                                onValueChange={(v) => setLgaConfig({ ...lgaConfig, ward: v })}
                                                disabled={!lgaConfig.lga}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Ward" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableWards.map(ward => (
                                                        <SelectItem key={ward.id} value={ward.id}>{ward.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* MODULE 1: Logistics */}
                                <div className="border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                        <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                        Logistics
                                    </h3>
                                    <form onSubmit={handleLogisticsSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Arrival Time</Label>
                                                <Select value={logisticsForm.arrivalTime} onValueChange={(v) => setLogisticsForm({ ...logisticsForm, arrivalTime: v })}>
                                                    <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="before_4pm">Before 4pm</SelectItem>
                                                        <SelectItem value="4_5pm">4pm - 5pm</SelectItem>
                                                        <SelectItem value="5_6pm">5pm - 6pm</SelectItem>
                                                        <SelectItem value="after_6pm">After 6pm</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Collation Start</Label>
                                                <Select value={logisticsForm.collationStartTime} onValueChange={(v) => setLogisticsForm({ ...logisticsForm, collationStartTime: v })}>
                                                    <SelectTrigger><SelectValue placeholder="Select start time" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="before_4pm">Before 4pm</SelectItem>
                                                        <SelectItem value="4_6pm">4pm - 6pm</SelectItem>
                                                        <SelectItem value="6_9pm">6pm - 9pm</SelectItem>
                                                        <SelectItem value="9_12am">9pm - 12am</SelectItem>
                                                        <SelectItem value="not_started">Not started</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" variant="secondary">Save Logistics</Button>
                                        </div>
                                    </form>
                                </div>

                                {/* MODULE 2: Staffing */}
                                <div className="border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                        <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                        Staffing & Security
                                    </h3>
                                    <form onSubmit={handleStaffingSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label>INEC Officers</Label>
                                                <Input type="number" placeholder="Total" value={staffingForm.inecOfficers} onChange={(e) => setStaffingForm({ ...staffingForm, inecOfficers: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Female Officers</Label>
                                                <Input type="number" placeholder="Count" value={staffingForm.femaleOfficers} onChange={(e) => setStaffingForm({ ...staffingForm, femaleOfficers: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Security Present?</Label>
                                                <Select value={staffingForm.securityPresent} onValueChange={(v) => setStaffingForm({ ...staffingForm, securityPresent: v })}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="yes">Yes</SelectItem>
                                                        <SelectItem value="no">No</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Party Agents</Label>
                                                <Input type="number" placeholder="Total count" value={staffingForm.partyAgents} onChange={(e) => setStaffingForm({ ...staffingForm, partyAgents: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" variant="secondary">Save Staffing</Button>
                                        </div>
                                    </form>
                                </div>

                                {/* MODULE 3: Integrity */}
                                <div className="border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                        <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                        Process Integrity
                                    </h3>
                                    <form onSubmit={handleIntegritySubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[
                                                { id: "ec8bSubmitted", label: "EC8B forms submitted?" },
                                                { id: "ec8cCollated", label: "EC8C properly collated?" },
                                                { id: "csrvsChecked", label: "CSRVS crosscheck done?" },
                                                { id: "ec40gTransferred", label: "EC40G/PWD Checklist transferred?" },
                                                { id: "ec40hTransferred", label: "EC40H transferred?" },
                                                { id: "votesAnnounced", label: "Votes announced loudly?" },
                                                { id: "agentsConsigned", label: "Agents requested to sign?" },
                                                { id: "ec8cDistributed", label: "EC8C copies distributed?" },
                                                { id: "ec60eDisplayed", label: "EC60E displayed?" }
                                            ].map((item: any) => (
                                                <div key={item.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={item.id}
                                                        checked={(integrityForm as any)[item.id]}
                                                        onCheckedChange={(c) => setIntegrityForm({ ...integrityForm, [item.id]: c as boolean })}
                                                    />
                                                    <Label htmlFor={item.id}>{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" variant="secondary">Save Integrity</Button>
                                        </div>
                                    </form>
                                </div>

                                {/* MODULE 4: Results */}
                                <div className="border rounded-lg p-6 bg-muted/10">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                        <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                                        Official Results & Cancellations
                                    </h3>
                                    <form onSubmit={handleResultsSubmit} className="space-y-6">

                                        {/* Countersigning */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-muted-foreground">Party Countersigning</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                {[
                                                    { key: 'apcSigned', label: 'APC' },
                                                    { key: 'pdpSigned', label: 'PDP' },
                                                    { key: 'lpSigned', label: 'LP' },
                                                    { key: 'nnppSigned', label: 'NNPP' },
                                                    { key: 'apgaSigned', label: 'APGA' },
                                                    { key: 'othersSigned', label: 'Others' }
                                                ].map((party) => (
                                                    <div key={party.key}>
                                                        <Label className="text-xs">{party.label}</Label>
                                                        <Select value={(resultsForm as any)[party.key]} onValueChange={(v) => setResultsForm({ ...resultsForm, [party.key]: v })}>
                                                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="yes">Yes</SelectItem>
                                                                <SelectItem value="no">No</SelectItem>
                                                                <SelectItem value="absent">No Agent</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Stats */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-muted-foreground">Accreditation & Cancellation</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Reg. Voters</Label>
                                                    <Input type="number" value={resultsForm.registeredVoters} onChange={(e) => setResultsForm({ ...resultsForm, registeredVoters: e.target.value })} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Accredited</Label>
                                                    <Input type="number" value={resultsForm.accreditedVoters} onChange={(e) => setResultsForm({ ...resultsForm, accreditedVoters: e.target.value })} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-destructive">Cancelled PUs</Label>
                                                    <Input type="number" className="border-destructive/30" value={resultsForm.cancelledPus} onChange={(e) => setResultsForm({ ...resultsForm, cancelledPus: e.target.value })} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-destructive">Affected Voters</Label>
                                                    <Input type="number" className="border-destructive/30" value={resultsForm.cancelledVoters} onChange={(e) => setResultsForm({ ...resultsForm, cancelledVoters: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Votes */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-muted-foreground">Vote Counts</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-background p-4 rounded-lg border">
                                                {activeParties.map((party) => {
                                                    const key = `${party.toLowerCase()}Votes`;
                                                    // Ensure the key exists in resultsForm, or handle it dynamically if we refactor state
                                                    // For now, we assume standard parties match the state keys or we default to empty
                                                    const value = (resultsForm as any)[key] || "";

                                                    return (
                                                        <div key={party} className="space-y-1">
                                                            <Label className="text-xs font-bold text-muted-foreground">{party}</Label>
                                                            <Input
                                                                type="number"
                                                                value={value}
                                                                onChange={(e) => setResultsForm({ ...resultsForm, [key]: e.target.value })}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 mt-4">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Total Cast</Label>
                                                    <Input type="number" value={resultsForm.totalVotesCast} onChange={(e) => setResultsForm({ ...resultsForm, totalVotesCast: e.target.value })} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Total Valid</Label>
                                                    <Input type="number" value={resultsForm.totalValidVotes} onChange={(e) => setResultsForm({ ...resultsForm, totalValidVotes: e.target.value })} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-destructive">Rejected</Label>
                                                    <Input type="number" className="border-destructive/30" value={resultsForm.totalRejectedVotes} onChange={(e) => setResultsForm({ ...resultsForm, totalRejectedVotes: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button type="submit" size="lg" className="px-8">Save Results</Button>
                                        </div>
                                    </form>
                                </div>

                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="config">
                        <PartyConfiguration />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default Admin;
