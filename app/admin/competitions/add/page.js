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
    type: "SOLO", // SOLO, TEAM
    minTeamSize: null,
    maxTeamSize: null,
    registrationFee: 0,
    registrationDeadline: "",
    registrationTime: "",
    otherRewards: "",
  });

  // File uploads
  const [files, setFiles] = useState({
    detailsMd: null,
    image: null,
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
    setCompetition((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      
      // Auto-adjust team sizes when type changes
      if (field === "type") {
        if (value === "SOLO") {
          updated.minTeamSize = null;
          updated.maxTeamSize = null;
        } else if (value === "TEAM" && (prev.minTeamSize === null || prev.maxTeamSize === null)) {
          updated.minTeamSize = 2;
          updated.maxTeamSize = 5;
        }
      }
      
      return updated;
    });
  };

  // Handle file changes
  const handleFileChange = (field, file) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
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
    // Team size validation only for TEAM type
    if (competition.type === "TEAM") {
      if (!competition.minTeamSize || competition.minTeamSize < 1) return "Min team size must be at least 1 for team competitions";
      if (!competition.maxTeamSize || competition.maxTeamSize < competition.minTeamSize) return "Max team size must be greater than or equal to min team size";
    }
    if (!files.detailsMd) return "Markdown file is required";

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

      // Prepare FormData for file upload
      const formData = new FormData();

      // Add basic competition data
      formData.append("title", competition.title);
      formData.append("description", competition.description);
      formData.append("type", competition.type);
      
      // Only add team sizes for TEAM type competitions
      if (competition.type === "TEAM") {
        formData.append("minTeamSize", parseInt(competition.minTeamSize));
        formData.append("maxTeamSize", parseInt(competition.maxTeamSize));
      }
      
      formData.append(
        "registrationFee",
        parseFloat(competition.registrationFee)
      );
      formData.append(
        "registrationDeadline",
        combineDateTime(
          competition.registrationDeadline,
          competition.registrationTime
        ).toISOString()
      );

      if (competition.otherRewards) {
        formData.append("otherRewards", competition.otherRewards);
      }

      // Add files
      if (files.detailsMd) {
        formData.append("detailsMd", files.detailsMd);
      }
      if (files.image) {
        formData.append("image", files.image);
      }

      // Add prizes if any
      if (prizes.first || prizes.second || prizes.third) {
        formData.append("prizes", JSON.stringify(prizes));
      }

      // Add stages - remove startTime and endTime as they're combined with dates
      const stagesData = stages.map((stage) => ({
        roundNumber: stage.roundNumber,
        roundTitle: stage.roundTitle,
        roundDesc: stage.roundDesc,
        startDate: combineDateTime(stage.startDate, stage.startTime),
        endDate: combineDateTime(stage.endDate, stage.endTime),
      }));
      formData.append("stages", JSON.stringify(stagesData));

      await axiosInstance.post("/competitions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
                <Label htmlFor="type">Competition Type *</Label>
                <select
                  id="type"
                  value={competition.type}
                  onChange={(e) =>
                    handleCompetitionChange("type", e.target.value)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="SOLO">Solo</option>
                  <option value="TEAM">Team</option>
                </select>
              </div>
            </div>

            {competition.type === "TEAM" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minTeamSize">Min Team Size *</Label>
                  <Input
                    id="minTeamSize"
                    type="number"
                    min="1"
                    value={competition.minTeamSize || ""}
                    onChange={(e) =>
                      handleCompetitionChange("minTeamSize", e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="Minimum team members"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxTeamSize">Max Team Size *</Label>
                  <Input
                    id="maxTeamSize"
                    type="number"
                    min="1"
                    value={competition.maxTeamSize || ""}
                    onChange={(e) =>
                      handleCompetitionChange("maxTeamSize", e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="Maximum team members"
                    required
                  />
                </div>
              </div>
            )}

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="detailsMd">
                  Competition Rules (Markdown File) *
                </Label>
                <Input
                  id="detailsMd"
                  type="file"
                  accept=".md,.markdown"
                  onChange={(e) =>
                    handleFileChange("detailsMd", e.target.files[0])
                  }
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a .md or .markdown file with detailed competition rules
                </p>
              </div>

              <div>
                <Label htmlFor="image">Competition Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("image", e.target.files[0])}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a banner image for the competition (optional)
                </p>
              </div>
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
