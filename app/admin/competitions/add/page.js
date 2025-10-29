"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Users,
  Trophy,
  Clock,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function AddCompetition() {
  const router = useRouter();

  // Competition basic info
  const [competition, setCompetition] = useState({
    title: "",
    description: "",
    registrationFee: 0,
    registrationDeadline: "",
    registrationTime: "",
    teamSize: 1,
    otherRewards: "",
    detailsMdPath: "",
  });

  // Prizes
  const [prizes, setPrizes] = useState({
    first: "",
    second: "",
    third: "",
  });

  // Stages
  const [numStages, setNumStages] = useState(1);
  const [stages, setStages] = useState([
    {
      roundNumber: 1,
      roundTitle: "",
      roundDesc: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },
  ]);

  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle competition field changes
  const handleCompetitionChange = (field, value) => {
    setCompetition((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle prize changes
  const handlePrizeChange = (position, value) => {
    setPrizes((prev) => ({
      ...prev,
      [position]: value,
    }));
  };

  // Handle number of stages change
  const handleNumStagesChange = (num) => {
    const newNum = parseInt(num);
    setNumStages(newNum);

    if (newNum > stages.length) {
      // Add new stages
      const newStages = [...stages];
      for (let i = stages.length; i < newNum; i++) {
        newStages.push({
          roundNumber: i + 1,
          roundTitle: "",
          roundDesc: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
        });
      }
      setStages(newStages);
    } else if (newNum < stages.length) {
      // Remove stages
      setStages(stages.slice(0, newNum));
    }
  };

  // Handle stage changes
  const handleStageChange = (index, field, value) => {
    const newStages = [...stages];
    newStages[index] = {
      ...newStages[index],
      [field]: value,
    };
    setStages(newStages);
  };

  // Combine date and time for API
  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}`);
  };

  // Validate form
  const validateForm = () => {
    if (!competition.title.trim()) return "Title is required";
    if (!competition.description.trim()) return "Description is required";
    if (!competition.registrationDeadline)
      return "Registration deadline date is required";
    if (!competition.registrationTime)
      return "Registration deadline time is required";
    if (competition.teamSize < 1) return "Team size must be at least 1";

    // Validate stages
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      if (!stage.roundTitle.trim()) return `Stage ${i + 1} title is required`;
      if (!stage.roundDesc.trim())
        return `Stage ${i + 1} description is required`;
      if (!stage.startDate) return `Stage ${i + 1} start date is required`;
      if (!stage.startTime) return `Stage ${i + 1} start time is required`;
      if (!stage.endDate) return `Stage ${i + 1} end date is required`;
      if (!stage.endTime) return `Stage ${i + 1} end time is required`;

      const startDateTime = combineDateTime(stage.startDate, stage.startTime);
      const endDateTime = combineDateTime(stage.endDate, stage.endTime);

      if (startDateTime >= endDateTime) {
        return `Stage ${i + 1} end time must be after start time`;
      }
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare data for API
      const competitionData = {
        ...competition,
        registrationFee: parseFloat(competition.registrationFee),
        teamSize: parseInt(competition.teamSize),
        registrationDeadline: combineDateTime(
          competition.registrationDeadline,
          competition.registrationTime
        ),
        prizes: prizes.first || prizes.second || prizes.third ? prizes : null,
        stagesAndTimelines: stages.map((stage) => ({
          ...stage,
          startDate: combineDateTime(stage.startDate, stage.startTime),
          endDate: combineDateTime(stage.endDate, stage.endTime),
        })),
      };

      await axiosInstance.post("/competitions", competitionData);
      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/competitions");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create competition");
      console.error("Error creating competition:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-green-600">
              <CheckCircle className="h-12 w-12 mx-auto mb-4" />
              <p className="font-semibold text-lg">Competition Created!</p>
              <p className="text-sm mt-2">
                Redirecting to competitions list...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Competition
        </h1>
        <p className="text-gray-600">
          Fill in the details to create a new competition
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Competition Title *</Label>
                <Input
                  id="title"
                  value={competition.title}
                  onChange={(e) =>
                    handleCompetitionChange("title", e.target.value)
                  }
                  placeholder="Enter competition title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="teamSize">Team Size *</Label>
                <Input
                  id="teamSize"
                  type="number"
                  min="1"
                  value={competition.teamSize}
                  onChange={(e) =>
                    handleCompetitionChange("teamSize", e.target.value)
                  }
                  placeholder="Number of team members"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={competition.description}
                onChange={(e) =>
                  handleCompetitionChange("description", e.target.value)
                }
                placeholder="Describe the competition"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
                <Input
                  id="registrationFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={competition.registrationFee}
                  onChange={(e) =>
                    handleCompetitionChange("registrationFee", e.target.value)
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="registrationDeadline">
                  Registration Deadline *
                </Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={competition.registrationDeadline}
                  onChange={(e) =>
                    handleCompetitionChange(
                      "registrationDeadline",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="registrationTime">Deadline Time *</Label>
                <Input
                  id="registrationTime"
                  type="time"
                  value={competition.registrationTime}
                  onChange={(e) =>
                    handleCompetitionChange("registrationTime", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="otherRewards">Other Rewards</Label>
              <Textarea
                id="otherRewards"
                value={competition.otherRewards}
                onChange={(e) =>
                  handleCompetitionChange("otherRewards", e.target.value)
                }
                placeholder="Certificates, goodies, etc."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="detailsMdPath">Details File Path</Label>
              <Input
                id="detailsMdPath"
                value={competition.detailsMdPath}
                onChange={(e) =>
                  handleCompetitionChange("detailsMdPath", e.target.value)
                }
                placeholder="Path to detailed competition rules"
              />
            </div>
          </CardContent>
        </Card>

        {/* Prizes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Prize Pool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstPrize">1st Prize</Label>
                <Input
                  id="firstPrize"
                  value={prizes.first}
                  onChange={(e) => handlePrizeChange("first", e.target.value)}
                  placeholder="First place reward"
                />
              </div>
              <div>
                <Label htmlFor="secondPrize">2nd Prize</Label>
                <Input
                  id="secondPrize"
                  value={prizes.second}
                  onChange={(e) => handlePrizeChange("second", e.target.value)}
                  placeholder="Second place reward"
                />
              </div>
              <div>
                <Label htmlFor="thirdPrize">3rd Prize</Label>
                <Input
                  id="thirdPrize"
                  value={prizes.third}
                  onChange={(e) => handlePrizeChange("third", e.target.value)}
                  placeholder="Third place reward"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stages Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Competition Stages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Label htmlFor="numStages">Number of Stages:</Label>
              <Input
                id="numStages"
                type="number"
                min="1"
                max="10"
                value={numStages}
                onChange={(e) => handleNumStagesChange(e.target.value)}
                className="w-20"
              />
            </div>

            {stages.map((stage, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg">Stage {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`stageTitle-${index}`}>
                        Stage Title *
                      </Label>
                      <Input
                        id={`stageTitle-${index}`}
                        value={stage.roundTitle}
                        onChange={(e) =>
                          handleStageChange(index, "roundTitle", e.target.value)
                        }
                        placeholder="e.g., Registration Round"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`roundNumber-${index}`}>
                        Round Number
                      </Label>
                      <Input
                        id={`roundNumber-${index}`}
                        type="number"
                        value={stage.roundNumber}
                        onChange={(e) =>
                          handleStageChange(
                            index,
                            "roundNumber",
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`stageDesc-${index}`}>
                      Stage Description *
                    </Label>
                    <Textarea
                      id={`stageDesc-${index}`}
                      value={stage.roundDesc}
                      onChange={(e) =>
                        handleStageChange(index, "roundDesc", e.target.value)
                      }
                      placeholder="Describe what happens in this stage"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`startDate-${index}`}>Start Date *</Label>
                      <Input
                        id={`startDate-${index}`}
                        type="date"
                        value={stage.startDate}
                        onChange={(e) =>
                          handleStageChange(index, "startDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`startTime-${index}`}>Start Time *</Label>
                      <Input
                        id={`startTime-${index}`}
                        type="time"
                        value={stage.startTime}
                        onChange={(e) =>
                          handleStageChange(index, "startTime", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${index}`}>End Date *</Label>
                      <Input
                        id={`endDate-${index}`}
                        type="date"
                        value={stage.endDate}
                        onChange={(e) =>
                          handleStageChange(index, "endDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endTime-${index}`}>End Time *</Label>
                      <Input
                        id={`endTime-${index}`}
                        type="time"
                        value={stage.endTime}
                        onChange={(e) =>
                          handleStageChange(index, "endTime", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Competition
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
