"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy, Eye, FileText } from "lucide-react";

export default function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/competitions");
      console.log(response);
      setCompetitions(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch competitions");
      console.error("Error fetching competitions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <p>Loading competitions...</p>
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
                onClick={fetchCompetitions}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Competitions
          </h1>
          <p className="text-gray-600">Manage and view all competitions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total Competitions: {competitions.length}
          </div>
          <Link href="/admin/competitions/add">
            <Button className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Create Competition
            </Button>
          </Link>
        </div>
      </div>

      {competitions.length === 0 ? (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Competitions Found
              </h3>
              <p className="text-gray-600">
                There are no competitions available at the moment.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {competitions.map((competition) => (
            <Card
              key={competition.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {competition.title}
                  </CardTitle>
                  <Badge
                    variant={
                      isRegistrationOpen(competition.registrationDeadline)
                        ? "default"
                        : "secondary"
                    }
                  >
                    {isRegistrationOpen(competition.registrationDeadline)
                      ? "Open"
                      : "Closed"}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {competition.description}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Deadline:{" "}
                      {formatDateTime(competition.registrationDeadline)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Team Size: {competition.teamSize} members</span>
                  </div>

                  {competition.registrationFee > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">💰</span>
                      <span>Fee: ₹{competition.registrationFee}</span>
                    </div>
                  )}

                  {competition.prizes && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>
                        Prizes:
                        {competition.prizes.first &&
                          ` 1st: ${competition.prizes.first}`}
                        {competition.prizes.second &&
                          `, 2nd: ${competition.prizes.second}`}
                        {competition.prizes.third &&
                          `, 3rd: ${competition.prizes.third}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/competitions/${competition.id}`}
                    className="flex-1"
                  >
                    <Button className="w-full" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Link
                    href={`/admin/competitions/${competition.id}/edit`}
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
