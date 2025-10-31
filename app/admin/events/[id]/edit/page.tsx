"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  X,
} from "lucide-react";

interface EventData {
  title: string;
  description: string;
  queryEmail: string;
  queryPhone: string;
  startTime: string;
  endTime: string;
}

interface FileData {
  detailsMd: File | null;
  image: File | null;
}

interface ApiResponse {
  data: {
    data: {
      title?: string;
      description?: string;
      queryEmail?: string;
      queryPhone?: string;
      startTime?: string;
      endTime?: string;
      detailsMdPath?: string;
      imagePath?: string;
    };
  };
}

export default function EditEvent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventData>({
    title: "",
    description: "",
    queryEmail: "",
    queryPhone: "",
    startTime: "",
    endTime: "",
  });

  const [files, setFiles] = useState<FileData>({
    detailsMd: null,
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mdPreview, setMdPreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentMdContent, setCurrentMdContent] = useState<string>("");
  const [currentImagePath, setCurrentImagePath] = useState<string>("");

  useEffect(() => {
    if (params?.id) {
      fetchEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const fetchEvent = async () => {
    try {
      setFetchLoading(true);
      const response = await axiosInstance.get<ApiResponse>(
        `/events/${params.id}`
      );
      const eventData = response.data;

      const formatDateTimeForInput = (dateTimeString?: string): string => {
        if (!dateTimeString) return "";
        const date = new Date(dateTimeString);
        return date.toISOString().slice(0, 16);
      };

      setEvent({
        title: eventData.data.title || "",
        description: eventData.data.description || "",
        queryEmail: eventData.data.queryEmail || "",
        queryPhone: eventData.data.queryPhone || "",
        startTime: formatDateTimeForInput(eventData.data.startTime),
        endTime: formatDateTimeForInput(eventData.data.endTime),
      });

      // Load existing markdown and image paths if available
      if (eventData.data.detailsMdPath) {
        loadExistingMarkdown(eventData.data.detailsMdPath);
      }
      if (eventData.data.imagePath) {
        setCurrentImagePath(eventData.data.imagePath);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch event");
      console.error("Error fetching event:", error);
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

  const handleEventChange = (field: keyof EventData, value: string) => {
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (field: keyof FileData, file: File | null) => {
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

  const validateForm = (): string | null => {
    if (!event.title.trim()) return "Title is required";
    if (!event.description.trim()) return "Description is required";
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const hasFiles = files.detailsMd || files.image;

      if (hasFiles) {
        const formData = new FormData();

        formData.append("title", event.title);
        formData.append("description", event.description);
        formData.append("queryPhone", event.queryPhone || "");
        formData.append("queryEmail", event.queryEmail || "");
        formData.append("startTime", event.startTime || "");
        formData.append("endTime", event.endTime || "");

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
    } catch (error: any) {
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleEventChange("title", e.target.value)
                }
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={event.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleEventChange("endTime", e.target.value)
                  }
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileChange(
                      "detailsMd",
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a new .md file to replace existing details (optional)
                </p>
                {currentMdContent && !files.detailsMd && (
                  <div className="mt-2">
                    <p className="text-sm text-blue-600 mb-2">
                      Current markdown exists
                    </p>
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
                <Label htmlFor="image">Event Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileChange(
                      "image",
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a new image to replace existing banner (optional)
                </p>
                {currentImagePath && !imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-blue-600 mb-2">Current image:</p>
                    <img
                      src={`${currentImagePath}`}
                      alt="Current event image"
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
                        alt="Event preview"
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
