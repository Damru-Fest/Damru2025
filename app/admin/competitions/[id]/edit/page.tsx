"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
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
  Loader2,
  X,
} from "lucide-react";

interface Prize {
  first: string;
  second: string;
  third: string;
}

interface Stage {
  id: number | null;
  roundNumber: number;
  roundTitle: string;
  roundDesc: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

interface Competition {
  title: string;
  description: string;
  registrationFee: number;
  registrationDeadline: string;
  registrationTime: string;
  teamSize: number;
  otherRewards: string;
  detailsMdPath: string;
  imagePath?: string;
  copoun?: string;
}

export default function EditCompetition() {
  const params = useParams();
  const router = useRouter();

  const [competition, setCompetition] = useState<Competition>({
    title: "",
    description: "",
    registrationFee: 0,
    registrationDeadline: "",
    registrationTime: "",
    teamSize: 1,
    otherRewards: "",
    detailsMdPath: "",
    copoun: "",
  });

  const [prizes, setPrizes] = useState<Prize>({
    first: "",
    second: "",
    third: "",
  });

  const [files, setFiles] = useState<{
    detailsMd: File | null;
    image: File | null;
  }>({
    detailsMd: null,
    image: null,
  });

  const [numStages, setNumStages] = useState<number>(1);
  const [stages, setStages] = useState<Stage[]>([
    {
      id: null,
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
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [mdPreview, setMdPreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentMdContent, setCurrentMdContent] = useState<string>("");

  useEffect(() => {
    if (params?.id) {
      fetchCompetition();
    }
  }, [params?.id]);

  const fetchCompetition = async () => {
    try {
      setFetchLoading(true);
      const response = await axiosInstance.get(`/competitions/${params.id}`);
      const competitionData = response.data.competition;

      const regDeadline = new Date(competitionData.registrationDeadline);
      const regDate = regDeadline.toISOString().split("T")[0];
      const regTime = regDeadline.toTimeString().slice(0, 5);

      setCompetition({
        title: competitionData.title || "",
        description: competitionData.description || "",
        registrationFee: competitionData.registrationFee || 0,
        registrationDeadline: regDate,
        registrationTime: regTime,
        teamSize: competitionData.teamSize || 1,
        otherRewards: competitionData.otherRewards || "",
        detailsMdPath: competitionData.detailsMdPath || "",
        imagePath: competitionData.imagePath || "",
        copoun: competition.copoun || "",
      });

      if (competitionData.prizes) {
        setPrizes({
          first: competitionData.prizes.first || "",
          second: competitionData.prizes.second || "",
          third: competitionData.prizes.third || "",
        });
      }

      if (competitionData.stagesAndTimelines?.length > 0) {
        const stagesData: Stage[] = competitionData.stagesAndTimelines.map(
          (stage: any) => {
            const startDateTime = new Date(stage.startDate);
            const endDateTime = new Date(stage.endDate);

            return {
              id: stage.id,
              roundNumber: stage.roundNumber,
              roundTitle: stage.roundTitle || "",
              roundDesc: stage.roundDesc || "",
              startDate: startDateTime.toISOString().split("T")[0],
              startTime: startDateTime.toTimeString().slice(0, 5),
              endDate: endDateTime.toISOString().split("T")[0],
              endTime: endDateTime.toTimeString().slice(0, 5),
            };
          }
        );

        setStages(stagesData);
        setNumStages(stagesData.length);
      }

      // Load existing markdown content if available
      if (competitionData.detailsMdPath) {
        loadExistingMarkdown(competitionData.detailsMdPath);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch competition");
      console.error("Error fetching competition:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  const loadExistingMarkdown = async (mdPath: string) => {
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: mdPath }),
      });
      if (response.ok) {
        const content = await response.text();

        setCurrentMdContent(content);
      }
    } catch (error) {
      console.error("Failed to load markdown content:", error);
    }
  };

  const handleCompetitionChange = (
    field: keyof Competition,
    value: string | number
  ) => {
    setCompetition((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrizeChange = (position: keyof Prize, value: string) => {
    setPrizes((prev) => ({
      ...prev,
      [position]: value,
    }));
  };

  const handleFileChange = (field: keyof typeof files, file: File | null) => {
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

  const handleNumStagesChange = (num: string) => {
    const newNum = parseInt(num);
    setNumStages(newNum);

    if (newNum > stages.length) {
      const newStages = [...stages];
      for (let i = stages.length; i < newNum; i++) {
        newStages.push({
          id: null,
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

  const handleStageChange = (
    index: number,
    field: keyof Stage,
    value: string | number
  ) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], [field]: value as never };
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
    if (competition.teamSize < 1) return "Team size must be at least 1";

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
      formData.append("registrationFee", String(competition.registrationFee));
      formData.append("teamSize", String(competition.teamSize));
      formData.append("copoun", String(competition.copoun));
      formData.append(
        "registrationDeadline",
        combineDateTime(
          competition.registrationDeadline,
          competition.registrationTime
        )?.toISOString() || ""
      );

      if (competition.otherRewards)
        formData.append("otherRewards", competition.otherRewards);
      if (files.detailsMd) formData.append("detailsMd", files.detailsMd);
      if (files.image) formData.append("image", files.image);
      if (prizes.first || prizes.second || prizes.third)
        formData.append("prizes", JSON.stringify(prizes));

      const stagesData = stages.map((stage) => ({
        id: stage.id,
        roundNumber: stage.roundNumber,
        roundTitle: stage.roundTitle,
        roundDesc: stage.roundDesc,
        startDate: combineDateTime(stage.startDate, stage.startTime),
        endDate: combineDateTime(stage.endDate, stage.endTime),
      }));
      formData.append("stagesAndTimelines", JSON.stringify(stagesData));

      await axiosInstance.put(`/competitions/${params.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => router.push("/admin/competitions"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update competition");
      console.error("Error updating competition:", err);
    } finally {
      setLoading(false);
    }
  };

  // JSX below remains the same as your original component (no TS changes needed)
  // — you can safely paste your JSX form part here.

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading competition data...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-green-600">
              <CheckCircle className="h-12 w-12 mx-auto mb-4" />
              <p className="font-semibold text-lg">Competition Updated!</p>
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
          Back to Competition
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Competition
        </h1>
        <p className="text-gray-600">Update the competition details</p>
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
              <div>
                <Label htmlFor="copoun">Copoun Time *</Label>
                <Input
                  id="copoun"
                  type="time"
                  value={competition.copoun}
                  onChange={(e) =>
                    handleCompetitionChange("copoun", e.target.value)
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
                  Update Competition Rules (Markdown File)
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
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a new .md or .markdown file to replace current rules
                  (optional)
                </p>
                {competition.detailsMdPath && !files.detailsMd && (
                  <div className="mt-2">
                    {currentMdContent && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Current Content:
                        </p>
                        <div className="prose prose-sm max-w-none bg-black p-3 rounded-md border max-h-48 overflow-y-auto">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: markdownToHtml(currentMdContent),
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {files.detailsMd && (
                  <div className="mt-2 space-y-2">
                    <span className="text-sm text-green-600">
                      ✓ New file: {files.detailsMd.name}
                    </span>
                    {mdPreview && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          New File Preview:
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
                <Label htmlFor="image">Update Competition Image</Label>
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
                  Upload a new banner image for the competition (optional)
                </p>
                {competition.imagePath && !imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-blue-600 mb-2">Current image:</p>
                    <img
                      src={`${competition.imagePath}`}
                      alt="Current competition image"
                      className="max-w-full h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600 mb-2">
                      New image preview:
                    </p>
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
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Competition
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
