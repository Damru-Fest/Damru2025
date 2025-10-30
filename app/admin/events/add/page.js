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
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function AddEvent() {
  const router = useRouter();

  // Competition basic info
  const [event, setEvent] = useState({
    title: "",
    description: "",
    queryEmail: "",
    registrationFee: 0,
    endTime: "",
    startTime: "",
    otherRewards: "",
    queryPhone: "",
  });

  // File uploads
  const [files, setFiles] = useState({
    detailsMd: null,
    image: null,
  });

  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle competition field changes
  const handleEventChange = (field, value) => {
    setEvent((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

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

  // Combine date and time for API
  // Validate form
  const validateForm = () => {
    if (!event.title.trim()) return "Title is required";
    if (!event.description.trim()) return "Description is required";
    if (!files.detailsMd) return "Markdown file is required";

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
      formData.append("title", event.title);
      formData.append("description", event.description);
      formData.append("queryPhone", event.queryPhone);
      formData.append("queryEmail", event.queryEmail);
      formData.append("startTime", event.startTime);
      formData.append("endTime", event.endTime);

      // Add files
      if (files.detailsMd) {
        formData.append("detailsMd", files.detailsMd);
      }
      if (files.image) {
        formData.append("image", files.image);
      }
      console.log(formData.title);

      await axiosInstance.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/events");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create event");
      console.error("Error creating event:", error);
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
              <p className="font-semibold text-lg">Event Created!</p>
              <p className="text-sm mt-2">Redirecting to event list...</p>
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
          Back to Events
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Event
        </h1>
        <p className="text-gray-600">
          Fill in the details to create a new event
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
              <Calendar className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={event.title}
                  onChange={(e) => handleEventChange("title", e.target.value)}
                  placeholder="Enter event title"
                />
              </div>
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
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startTime">Start time and date</Label>
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
                <Label htmlFor="endTime">End time and date</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={event.endTime}
                  onChange={(e) => handleEventChange("endTime", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="queryEmail">Query email</Label>
                <Input
                  id="queryEmail"
                  type="email"
                  value={event.queryEmail}
                  onChange={(e) =>
                    handleEventChange("queryEmail", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="queryPhone">Query phone</Label>
                <Input
                  id="queryPhone"
                  type="phone"
                  value={event.queryPhone}
                  onChange={(e) =>
                    handleEventChange("queryPhone", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="detailsMd">Event Info (Markdown File) *</Label>
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
                  Upload a .md or .markdown file with detailed info about the
                  event
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
                  Upload a banner image for the event (optional)
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Event
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
