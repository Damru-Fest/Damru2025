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

export default function EventDetail() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/events/${params.id}`);
      setEvent(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch event");
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await axiosInstance.delete(`/events/${params.id}`);
      router.push("/admin/events");
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

  const isRegistrationOpen = (deadline) => {
    return new Date() < new Date(deadline);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading event details...</p>
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
                <Button onClick={fetchEvent} variant="outline">
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
              <p className="font-semibold">Event Not Found</p>
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
          Back to Events
        </Button>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push(`/admin/events/${params.id}/edit`)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Edit Event
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
                  competition &quot;{event?.title}&quot; and remove all
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
                      Delete Event
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
                {event.title}
              </CardTitle>
              <p className="text-gray-600 text-lg">{event.description}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {event.startTime && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Start Time</p>
                  <p className="font-semibold">{formatDate(event.startTime)}</p>
                </div>
              </div>
            )}

            {event.endTime && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">End Time</p>
                  <p className="font-semibold">{formatDate(event.endTime)}</p>
                </div>
              </div>
            )}

            {event.queryEmail && (
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-gray-600">Query Email</p>
                  <p className="font-semibold break-all">{event.queryEmail}</p>
                </div>
              </div>
            )}

            {event.queryPhone && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Query Phone</p>
                  <p className="font-semibold">{event.queryPhone}</p>
                </div>
              </div>
            )}

            {event.detailsMdPath && (
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Details File</p>
                  <p className="font-semibold text-sm break-all">
                    {event.detailsMdPath}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
