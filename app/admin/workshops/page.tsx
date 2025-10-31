"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCog, Eye, FileText, Clock } from "lucide-react";

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/workshops");
      setWorkshops(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch workshops");
      console.error("Error fetching workshops:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
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
          <p>Loading Workshops...</p>
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
              <Button
                onClick={fetchWorkshops}
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Workshops</h1>
          <p className="text-gray-600">Manage and view all workshops</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total Workshops: {workshops.length}
          </div>
          <Link href="/admin/workshops/add">
            <Button className="flex items-center gap-2">
              <CalendarCog className="h-4 w-4" />
              Create Workshop
            </Button>
          </Link>
        </div>
      </div>

      {workshops.length === 0 ? (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CalendarCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No workshops Found
              </h3>
              <p className="text-gray-600">
                There are no workshops available at the moment.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workshops.map((workshop) => (
            <Card
              key={workshop.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {workshop.title}
                  </CardTitle>
                  <Badge
                    variant={
                      isRegistrationOpen(workshop.endTime)
                        ? "default"
                        : "secondary"
                    }
                  >
                    {isRegistrationOpen(workshop.endTime) ? "Open" : "Closed"}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {workshop.description}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-4">
                  {workshop.startTime && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarCog className="h-4 w-4 mr-2" />
                      <span>Start: {formatDateTime(workshop.startTime)}</span>
                    </div>
                  )}

                  {workshop.endTime && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>End: {formatDateTime(workshop.endTime)}</span>
                    </div>
                  )}

                  {workshop.queryEmail && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📧</span>
                      <span className="truncate">{workshop.queryEmail}</span>
                    </div>
                  )}

                  {workshop.queryPhone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📞</span>
                      <span>{workshop.queryPhone}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/workshops/${workshop.id}`}
                    className="flex-1"
                  >
                    <Button className="w-full" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Link
                    href={`/admin/workshops/${workshop.id}/edit`}
                    className="flex-1"
                  >
                    <Button className="w-full" variant="secondary">
                      <FileText className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
