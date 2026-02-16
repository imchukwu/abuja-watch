import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import { LGA_DATA } from "@/data/mockElectionData";

const ALL_PARTIES = [
    "APC", "PDP", "LP", "NNPP", "APGA", "ADC", "SDP", "YPP", "ZLP", "APP", "AAC", "BP", "ADP"
];

export const PartyConfiguration = () => {
    const { toast } = useToast();
    const [selectedLga, setSelectedLga] = useState<string>("");
    const [configuredParties, setConfiguredParties] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedLga) {
            setLoading(true);
            api.getAreaCouncilParties(selectedLga)
                .then(parties => {
                    setConfiguredParties(parties || []);
                })
                .catch(err => {
                    console.error(err);
                    toast({ title: "Error", description: "Failed to load party configuration.", variant: "destructive" });
                })
                .finally(() => setLoading(false));
        } else {
            setConfiguredParties([]);
        }
    }, [selectedLga, toast]);

    const handleToggleParty = (party: string) => {
        if (configuredParties.includes(party)) {
            setConfiguredParties(configuredParties.filter(p => p !== party));
        } else {
            setConfiguredParties([...configuredParties, party]);
        }
    };

    const handleSave = async () => {
        if (!selectedLga) return;

        try {
            setLoading(true);
            await api.updateAreaCouncilParties(selectedLga, configuredParties);
            toast({ title: "Configuration Saved", description: `Parties updated for ${LGA_DATA.find(l => l.id === selectedLga)?.name}` });
        } catch (err) {
            toast({ title: "Error", description: "Failed to save configuration.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Area Council Party Configuration</CardTitle>
                <CardDescription>Select which parties are participating in each Area Council.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2 max-w-md">
                    <Label>Select Area Council</Label>
                    <Select value={selectedLga} onValueChange={setSelectedLga}>
                        <SelectTrigger><SelectValue placeholder="Select Area Council" /></SelectTrigger>
                        <SelectContent>
                            {LGA_DATA.map(lga => (
                                <SelectItem key={lga.id} value={lga.id}>{lga.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedLga && (
                    <div className="space-y-4">
                        <Label>Participating Parties</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border p-4 rounded-lg">
                            {ALL_PARTIES.map(party => (
                                <div key={party} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`party-${party}`}
                                        checked={configuredParties.includes(party)}
                                        onCheckedChange={() => handleToggleParty(party)}
                                    />
                                    <Label htmlFor={`party-${party}`}>{party}</Label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? "Saving..." : "Save Configuration"}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
