"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Calendar,
  Users,
  Trophy,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
} from "lucide-react";

export default function CompetitionDetail() {
  const params = useParams();
  const router = useRouter();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCompetition();
    }
  }, [params.id]);

  const fetchCompetition = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/competitions/${params.id}`);
      setCompetition(response.data.competition);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch competition");
      console.error("Error fetching competition:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await axiosInstance.delete(`/competitions/${params.id}`);
      router.push("/admin/competitions");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete competition");
      console.error("Error deleting competition:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isRegistrationOpen = (deadline) => {
    return new Date() < new Date(deadline);
  };

  const getStageStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "active";
    return "completed";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "upcoming":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "completed":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "upcoming":
        return "secondary";
      case "active":
        return "default";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading competition details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-2">{error}</p>
              <div className="flex gap-2 mt-4 justify-center">
                <Button onClick={fetchCompetition} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => router.back()} variant="ghost">
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="font-semibold">Competition Not Found</p>
              <Button
                onClick={() => router.back()}
                className="mt-4"
                variant="outline"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Button>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push(`/admin/competitions/${params.id}/edit`)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Edit Competition
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  competition "{competition?.title}" and remove all associated data
                  including prizes and stages.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Competition
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Competition Overview */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                {competition.title}
              </CardTitle>
              <p className="text-gray-600 text-lg">{competition.description}</p>
            </div>
            <Badge
              variant={
                isRegistrationOpen(competition.registrationDeadline)
                  ? "default"
                  : "secondary"
              }
              className="text-sm"
            >
              {isRegistrationOpen(competition.registrationDeadline)
                ? "Registration Open"
                : "Registration Closed"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Registration Deadline</p>
                <p className="font-semibold">
                  {formatDate(competition.registrationDeadline)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Team Size</p>
                <p className="font-semibold">{competition.teamSize} members</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Registration Fee</p>
                <p className="font-semibold">
                  {competition.registrationFee > 0
                    ? `₹${competition.registrationFee}`
                    : "Free"}
                </p>
              </div>
            </div>

            {competition.detailsMdPath && (
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Details File</p>
                  <p className="font-semibold text-sm break-all">
                    {competition.detailsMdPath}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Prizes Section */}
      {competition.prizes && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Prize Pool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competition.prizes.first && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-yellow-800">1st Place</h3>
                  <p className="text-yellow-700">{competition.prizes.first}</p>
                </div>
              )}

              {competition.prizes.second && (
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Trophy className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">2nd Place</h3>
                  <p className="text-gray-700">{competition.prizes.second}</p>
                </div>
              )}

              {competition.prizes.third && (
                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <Trophy className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-amber-800">3rd Place</h3>
                  <p className="text-amber-700">{competition.prizes.third}</p>
                </div>
              )}
            </div>

            {competition.otherRewards && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Other Rewards
                </h4>
                <p className="text-blue-700">{competition.otherRewards}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stages and Timeline */}
      {competition.stagesAndTimelines &&
        competition.stagesAndTimelines.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Stages & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {competition.stagesAndTimelines.map((stage, index) => {
                  const status = getStageStatus(stage.startDate, stage.endDate);

                  return (
                    <div key={stage.id} className="relative">
                      {/* Timeline connector */}
                      {index < competition.stagesAndTimelines.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 shrink-0">
                          {getStatusIcon(status)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Round {stage.roundNumber}: {stage.roundTitle}
                            </h3>
                            <Badge variant={getStatusBadgeVariant(status)}>
                              {status === "upcoming"
                                ? "Upcoming"
                                : status === "active"
                                ? "Active"
                                : "Completed"}
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-3">
                            {stage.roundDesc}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Start: {formatDate(stage.startDate)}</span>
                            <span>•</span>
                            <span>End: {formatDate(stage.endDate)}</span>
                          </div>
                        </div>
                      </div>

                      {index < competition.stagesAndTimelines.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
