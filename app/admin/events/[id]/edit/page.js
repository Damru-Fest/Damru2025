"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function EditEvent() {
  const params = useParams();
  const router = useRouter();

  // Event basic info
  const [event, setEvent] = useState({
    title: "",
    description: "",
    queryEmail: "",
    queryPhone: "",
    startTime: "",
    endTime: "",
  });

  // File uploads
  const [files, setFiles] = useState({
    detailsMd: null,
    image: null,
  });

  // Form state
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch existing event data
  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      setFetchLoading(true);
      const response = await axiosInstance.get(`/events/${params.id}`);
      const eventData = response.data.data;

      // Convert datetime to input format
      const formatDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return "";
        const date = new Date(dateTimeString);
        return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
      };

      // Set event basic info
      setEvent({
        title: eventData.title || "",
        description: eventData.description || "",
        queryEmail: eventData.queryEmail || "",
        queryPhone: eventData.queryPhone || "",
        startTime: formatDateTimeForInput(eventData.startTime),
        endTime: formatDateTimeForInput(eventData.endTime),
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch event");
      console.error("Error fetching event:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle event field changes
  const handleEventChange = (field, value) => {
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file changes
  const handleFileChange = (field, file) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!event.title.trim()) return "Title is required";
    if (!event.description.trim()) return "Description is required";

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

      // Prepare FormData for file upload (if files are provided)
      const hasFiles = files.detailsMd || files.image;

      if (hasFiles) {
        const formData = new FormData();

        // Add basic event data
        formData.append("title", event.title);
        formData.append("description", event.description);
        formData.append("queryPhone", event.queryPhone || "");
        formData.append("queryEmail", event.queryEmail || "");
        formData.append("startTime", event.startTime || "");
        formData.append("endTime", event.endTime || "");

        // Add files if provided
        if (files.detailsMd) {
          formData.append("detailsMd", files.detailsMd);
        }
        if (files.image) {
          formData.append("image", files.image);
        }

        await axiosInstance.put(`/events/${params.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Send JSON data if no files
        await axiosInstance.put(`/events/${params.id}`, {
          title: event.title,
          description: event.description,
          queryPhone: event.queryPhone,
          queryEmail: event.queryEmail,
          startTime: event.startTime || null,
          endTime: event.endTime || null,
        });
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/events");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update event");
      console.error("Error updating event:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading event data...</p>
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
              <p className="font-semibold text-lg">Event Updated!</p>
              <p className="text-sm mt-2">Redirecting to events list...</p>
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
          Back to Event
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Event</h1>
        <p className="text-gray-600">Update the event details</p>
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
              <Calendar className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={event.title}
                onChange={(e) => handleEventChange("title", e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={event.description}
                onChange={(e) =>
                  handleEventChange("description", e.target.value)
                }
                placeholder="Describe the event"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={event.startTime}
                  onChange={(e) =>
                    handleEventChange("startTime", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={event.endTime}
                  onChange={(e) => handleEventChange("endTime", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="queryEmail">Query Email</Label>
                <Input
                  id="queryEmail"
                  type="email"
                  value={event.queryEmail}
                  onChange={(e) =>
                    handleEventChange("queryEmail", e.target.value)
                  }
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="queryPhone">Query Phone</Label>
                <Input
                  id="queryPhone"
                  type="tel"
                  value={event.queryPhone}
                  onChange={(e) =>
                    handleEventChange("queryPhone", e.target.value)
                  }
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Update Files (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="detailsMd">Event Details (Markdown File)</Label>
                <Input
                  id="detailsMd"
                  type="file"
                  accept=".md,.markdown"
                  onChange={(e) =>
                    handleFileChange("detailsMd", e.target.files[0])
                  }
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a new .md file to replace existing details (optional)
                </p>
              </div>

              <div>
                <Label htmlFor="image">Event Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("image", e.target.files[0])}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a new image to replace existing banner (optional)
                </p>
              </div>
            </div>
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
                Update Event
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
