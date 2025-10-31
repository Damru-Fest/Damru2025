"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import markdownToHtml from "@/lib/markdownToHtml";
import {
  ArrowLeft,
  Trophy,
  Clock,
  Save,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

interface Competition {
  title: string;
  description: string;
  type: "SOLO" | "TEAM";
  minTeamSize: number | null;
  maxTeamSize: number | null;
  registrationFee: number;
  registrationDeadline: string;
  registrationTime: string;
  otherRewards: string;
  copoun: string;
}

interface Files {
  detailsMd: File | null;
  image: File | null;
}

interface Prizes {
  first: string;
  second: string;
  third: string;
}

interface Stage {
  roundNumber: number;
  roundTitle: string;
  roundDesc: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export default function AddCompetition() {
  const router = useRouter();

  const [competition, setCompetition] = useState<Competition>({
    title: "",
    description: "",
    type: "SOLO",
    minTeamSize: null,
    maxTeamSize: null,
    registrationFee: 0,
    registrationDeadline: "",
    registrationTime: "",
    otherRewards: "",
    copoun: "",
  });

  const [files, setFiles] = useState<Files>({
    detailsMd: null,
    image: null,
  });

  const [prizes, setPrizes] = useState<Prizes>({
    first: "",
    second: "",
    third: "",
  });

  const [numStages, setNumStages] = useState<number>(1);
  const [stages, setStages] = useState<Stage[]>([
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

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [mdPreview, setMdPreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleCompetitionChange = (field: keyof Competition, value: any) => {
    setCompetition((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      if (field === "type") {
        if (value === "SOLO") {
          updated.minTeamSize = null;
          updated.maxTeamSize = null;
        } else if (
          value === "TEAM" &&
          (prev.minTeamSize === null || prev.maxTeamSize === null)
        ) {
          updated.minTeamSize = 2;
          updated.maxTeamSize = 5;
        }
      }

      return updated;
    });
  };

  const handleFileChange = (field: keyof Files, file: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));

    // Handle file previews
    if (file) {
      if (field === "detailsMd") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMdPreview(e.target?.result as string);
        };
        reader.readAsText(file);
      } else if (field === "image") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      if (field === "detailsMd") setMdPreview("");
      if (field === "image") setImagePreview("");
    }
  };

  const handlePrizeChange = (position: keyof Prizes, value: string) => {
    setPrizes((prev) => ({
      ...prev,
      [position]: value,
    }));
  };

  const handleNumStagesChange = (num: string) => {
    const newNum = parseInt(num);
    setNumStages(newNum);

    if (newNum > stages.length) {
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
      setStages(stages.slice(0, newNum));
    }
  };

  const handleStageChange = (index: number, field: keyof Stage, value: any) => {
    const newStages = [...stages];
    newStages[index] = {
      ...newStages[index],
      [field]: value,
    };
    setStages(newStages);
  };

  const combineDateTime = (date: string, time: string): Date | null => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}`);
  };

  const validateForm = (): string | null => {
    if (!competition.title.trim()) return "Title is required";
    if (!competition.description.trim()) return "Description is required";
    if (!competition.registrationDeadline)
      return "Registration deadline date is required";
    if (!competition.registrationTime)
      return "Registration deadline time is required";
    if (competition.type === "TEAM") {
      if (!competition.minTeamSize || competition.minTeamSize < 1)
        return "Min team size must be at least 1 for team competitions";
      if (
        !competition.maxTeamSize ||
        competition.maxTeamSize < competition.minTeamSize
      )
        return "Max team size must be greater than or equal to min team size";
    }
    if (!files.detailsMd) return "Markdown file is required";

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

      if (startDateTime && endDateTime && startDateTime >= endDateTime) {
        return `Stage ${i + 1} end time must be after start time`;
      }
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append("title", competition.title);
      formData.append("description", competition.description);
      formData.append("type", competition.type);
      formData.append("copoun", competition.copoun);
      if (competition.type === "TEAM") {
        formData.append("minTeamSize", String(competition.minTeamSize));
        formData.append("maxTeamSize", String(competition.maxTeamSize));
      }

      formData.append("registrationFee", String(competition.registrationFee));
      const deadline = combineDateTime(
        competition.registrationDeadline,
        competition.registrationTime
      );
      if (deadline) {
        formData.append("registrationDeadline", deadline.toISOString());
      }

      if (competition.otherRewards) {
        formData.append("otherRewards", competition.otherRewards);
      }

      if (files.detailsMd) {
        formData.append("detailsMd", files.detailsMd);
      }
      if (files.image) {
        formData.append("image", files.image);
      }

      if (prizes.first || prizes.second || prizes.third) {
        formData.append("prizes", JSON.stringify(prizes));
      }

      const stagesData = stages.map((stage) => ({
        roundNumber: stage.roundNumber,
        roundTitle: stage.roundTitle,
        roundDesc: stage.roundDesc,
        startDate: combineDateTime(stage.startDate, stage.startTime),
        endDate: combineDateTime(stage.endDate, stage.endTime),
      }));

      formData.append("stages", JSON.stringify(stagesData));

      await axiosInstance.post("/competitions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/competitions");
      }, 2000);
    } catch (error: any) {
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
                      handleCompetitionChange(
                        "minTeamSize",
                        e.target.value ? parseInt(e.target.value) : null
                      )
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
                      handleCompetitionChange(
                        "maxTeamSize",
                        e.target.value ? parseInt(e.target.value) : null
                      )
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
                <Label htmlFor="copoun">Copoun</Label>
                <Input
                  id="copoun"
                  type="text"
                  value={competition.copoun}
                  onChange={(e) =>
                    handleCompetitionChange("copoun", e.target.value)
                  }
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
                    handleFileChange(
                      "detailsMd",
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null
                    )
                  }
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a .md or .markdown file with detailed competition rules
                </p>
                {files.detailsMd && (
                  <div className="mt-2 space-y-2">
                    <span className="text-sm text-green-600">
                      ✓ {files.detailsMd.name}
                    </span>
                    {mdPreview && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Preview:
                        </p>
                        <div className="prose prose-sm max-w-none bg-black p-3 rounded-md border max-h-48 overflow-y-auto">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: markdownToHtml(mdPreview),
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="image">Competition Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(
                      "image",
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null
                    )
                  }
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a banner image for the competition (optional)
                </p>
                {imagePreview && (
                  <div className="mt-2">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Competition preview"
                        className="max-w-full h-32 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          handleFileChange("image", null);
                          const input = document.getElementById(
                            "image"
                          ) as HTMLInputElement;
                          if (input) input.value = "";
                        }}
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {files.image?.name}
                    </p>
                  </div>
                )}
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
