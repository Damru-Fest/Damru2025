"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
import markdownToHtml from "@/lib/markdownToHtml";
import {
  ArrowLeft,
  Calendar,
  Users,
  Clock,
  FileText,
  Trash2,
  Loader2,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime?: string;
  endTime?: string;
  queryEmail?: string;
  queryPhone?: string;
  detailsMdPath?: string;
  imagePath?: string;
}

export default function EventDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [workshop, setWorkshop] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [markdownContent, setMarkdownContent] = useState<string>("");

  useEffect(() => {
    if (params.id) {
      fetchWorkhsop();
    }
  }, [params.id]);

  const fetchWorkhsop = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/workshops/${params.id}`);
      const eventData = response.data.data;
      setWorkshop(eventData);

      // Load markdown content if available
      if (eventData.detailsMdPath) {
        loadMarkdownContent(eventData.detailsMdPath);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch event");
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarkdownContent = async (mdPath: string) => {
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
        setMarkdownContent(content);
      }
    } catch (error) {
      console.error("Failed to load markdown content:", error);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await axiosInstance.delete(`/workshops/${params.id}`);
      router.push("/admin/workshops");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to delete event");
      console.error("Error deleting event:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isRegistrationOpen = (deadline: string): boolean => {
    return new Date() < new Date(deadline);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading workshop details...</p>
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
                <Button onClick={fetchWorkhsop} variant="outline">
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

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="font-semibold">Workshop Not Found</p>
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
          Back to Workshops
        </Button>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push(`/admin/workshops/${params.id}/edit`)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Edit Workshop
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
                  competition &quot;{workshop?.title}&quot; and remove all
                  associated data.
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
                      Delete Workshop
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Event Overview */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                {workshop.title}
              </CardTitle>
              <p className="text-gray-600 text-lg">{workshop.description}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workshop.startTime && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Start Time</p>
                  <p className="font-semibold">
                    {formatDate(workshop.startTime)}
                  </p>
                </div>
              </div>
            )}

            {workshop.endTime && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">End Time</p>
                  <p className="font-semibold">
                    {formatDate(workshop.endTime)}
                  </p>
                </div>
              </div>
            )}
            {workshop.registrationDeadline && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    Registeration Deadline
                  </p>
                  <p className="font-semibold">
                    {formatDate(workshop.registrationDeadline)}
                  </p>
                </div>
              </div>
            )}

            {workshop.queryEmail && (
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-gray-600">Query Email</p>
                  <p className="font-semibold break-all">
                    {workshop.queryEmail}
                  </p>
                </div>
              </div>
            )}

            {workshop.queryPhone && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Query Phone</p>
                  <p className="font-semibold">{workshop.queryPhone}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Image */}
      {workshop.imagePath && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Workshop Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img
                src={`${workshop.imagePath}`}
                alt={workshop.title}
                className="max-w-full h-auto rounded-lg border shadow-sm"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Details */}
      {markdownContent && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Workshop Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none bg-black p-4 rounded-md border"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(markdownContent),
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
