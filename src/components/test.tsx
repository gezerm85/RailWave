import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { FileUpload } from "../components/FileUpload";
import { Plus, Download, Mail, Video, Pencil, Trash2, Eye } from "lucide-react";
import { downloadPdf, generateTeamsLink } from "../lib/utils";
import { StarRating } from "../components/ui/StarRating";
import type { Candidate, CandidateStatus, Sector } from "../types";
import {
  SECTORS,
  CANDIDATE_STATUS_COLORS,
  CANDIDATE_STATUS_LABELS,
} from "../types";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { compressFile } from "../lib/fileUtils";
import fileService from "../services/fileService";
import candidatesService, {
  CandidateRequest,
  ApiResponse,
} from "../services/candidatesService";

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">(
    "all"
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [selectedPdfName, setSelectedPdfName] = useState<string>("");
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const [candidateForm, setCandidateForm] = useState<{
    name: string;
    email: string;
    phone: string;
    skills: string;
    experience: string;
    rating: string;
    sector: Sector;
  }>({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "0",
    rating: "3",
    sector: SECTORS[0],
  });

  const [meetingDetails, setMeetingDetails] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Helper function to extract candidate data from API response
  const processApiResponse = useCallback(
    (response: { data: ApiResponse<Candidate[]> }): Candidate[] => {
      // API response has data.data structure
      return response.data?.data ?? [];
    },
    []
  );

  useEffect(() => {
    let active = true;
    if (isPdfPreviewOpen && selectedPdfUrl) {
      fetch(selectedPdfUrl)
        .then(res => {
          if (!res.ok) throw new Error("PDF yüklenemedi");
          return res.blob();
        })
        .then(blob => {
          if (!active) return;
          const url = URL.createObjectURL(blob);
          setPdfBlobUrl(url);
        })
        .catch(err => {
          console.error("PDF önizleme hatası:", err);
        });
    }
    return () => {
      active = false;
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
    };
  }, [isPdfPreviewOpen, selectedPdfUrl]);
  

  // Function to refresh candidates
  const refreshCandidates = useCallback(
    async (isSubscribed = true) => {
      try {
        const response = await candidatesService.getAllCandidates();
        if (isSubscribed) {
          const candidatesData = processApiResponse(response);
          setCandidates(candidatesData);
          setError(null);
        }
      } catch (error) {
        console.error("Error loading candidates:", error);
        if (isSubscribed) {
          setError(
            `Error loading candidates: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }
    },
    [processApiResponse]
  );

  const filteredCandidatesList = useMemo(() => {
    if (!candidates.length) return [];

    return candidates.filter((candidate) => {
      if (statusFilter !== "all") {
        if (candidate.status !== statusFilter) return false;
      }

      return true;
    });
  }, [candidates, statusFilter]);

  useEffect(() => {
    setFilteredCandidates(filteredCandidatesList);
  }, [filteredCandidatesList]);

  useEffect(() => {
    let isSubscribed = true;

    const loadData = async () => {
      try {
        if (!isSubscribed) return;
        setIsLoading(true);
        setError(null);

        // Session check
        if (!user) {
          navigate("/login");
          return;
        }

        await refreshCandidates(isSubscribed);
      } catch (error) {
        console.error("Page initialization error:", error);
        if (isSubscribed) {
          setError(
            `Error loading page: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [user, navigate, refreshCandidates]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const resetForm = useCallback(() => {
    setCandidateForm({
      name: "",
      email: "",
      phone: "",
      skills: "",
      experience: "0",
      rating: "3",
      sector: SECTORS[0],
    });
    setSelectedFile(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit started ======");

    try {
      // Auth durumunu kontrol et
      if (!user) {
        setError("You need to be logged in");
        return;
      }

      setIsLoading(true);
      setError(null);

      // Check CV file
      if (!selectedFile) {
        throw new Error("Please select a CV file");
      }

      // Compress CV file
      console.log("Uploading CV...");
      const compressedCV = await compressFile(selectedFile);
      console.log("CV compression completed");

      // Upload CV through API
      const cvUrl = await fileService.uploadFile(compressedCV, "cvs");
      console.log("CV upload completed:", cvUrl);

      // Prepare candidate form
      const skills = candidateForm.skills.split(",").map((s) => s.trim());

      // Add candidate information to database
      const candidateData: CandidateRequest = {
        name: candidateForm.name,
        email: candidateForm.email,
        phone: candidateForm.phone,
        skills: skills,
        experience: parseInt(candidateForm.experience) || 0,
        rating: parseInt(candidateForm.rating) || 3,
        cv_url: cvUrl,
        sector: candidateForm.sector,
        status: "new",
      };

      console.log(
        "Adding candidate to database:",
        JSON.stringify(candidateData, null, 2)
      );

      try {
        // Try with XMLHttpRequest
        console.log("Sending request using XMLHttpRequest...");

        const xhr = new XMLHttpRequest();
        const token = localStorage.getItem("authToken");

        xhr.open("POST", `${import.meta.env.VITE_API_URL}/candidates`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.onreadystatechange = async function () {
          if (xhr.readyState === 4) {
            console.log("XHR response status:", xhr.status);
            console.log("XHR response text:", xhr.responseText);

            if (xhr.status >= 200 && xhr.status < 300) {
              console.log("Candidate created successfully via XHR");

              // Reset form
              resetForm();

              // Close modal
              setIsAddModalOpen(false);

              // Update candidate list
              await refreshCandidates();

              setIsLoading(false);
              setError(null);
            } else {
              let errorMessage = "Failed to create candidate";
              try {
                const errorData = JSON.parse(xhr.responseText);
                errorMessage = errorData.message || errorMessage;
              } catch (e) {
                console.error("Error parsing response:", e);
              }

              setIsLoading(false);
              setError(errorMessage);
              console.error("API error via XHR:", errorMessage);
            }
          }
        };

        xhr.send(JSON.stringify(candidateData));
      } catch (error) {
        console.error("XHR error:", error);
        setIsLoading(false);
        setError(error instanceof Error ? error.message : "XHR error occurred");
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
      setIsLoading(false);
      setError(error instanceof Error ? error.message : "An error occurred");
    }

    console.log("Form submit completed ======");
  };

  const handleEdit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedCandidate) return;

      try {
        let cv_url = selectedCandidate.cv_url;

        if (selectedFile) {
          // Upload new CV file through API
          cv_url = await fileService.uploadFile(selectedFile, "cvs");
        }

        const updateData: Partial<CandidateRequest> = {
          name: candidateForm.name,
          email: candidateForm.email,
          phone: candidateForm.phone,
          skills: candidateForm.skills.split(",").map((s) => s.trim()),
          experience: parseInt(candidateForm.experience),
          rating: parseInt(candidateForm.rating),
          sector: candidateForm.sector,
          cv_url,
        };

        const response = await candidatesService.updateCandidate(
          selectedCandidate.id!,
          updateData
        );
        const updatedCandidate = response.data.data;

        setCandidates((prev) =>
          prev.map((c) => (c.id === updatedCandidate.id ? updatedCandidate : c))
        );

        setIsEditModalOpen(false);
        resetForm();
        setSelectedCandidate(null);
      } catch (err) {
        console.error("Error updating candidate:", err);
        setError("Error updating candidate");
      }
    },
    [candidateForm, selectedFile, selectedCandidate]
  );

  const handleDelete = useCallback(async () => {
    if (!selectedCandidate) return;

    try {
      if (!user || (user.role !== "admin" && user.role !== "recruiter")) {
        setError("Only admins and recruiters can delete candidates.");
        return;
      }

      await candidatesService.deleteCandidate(selectedCandidate.id!);
      setCandidates((prev) =>
        prev.filter((c) => c.id !== selectedCandidate.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedCandidate(null);
    } catch (err) {
      console.error("Error deleting candidate:", err);
      setError("Error deleting candidate");
    }
  }, [selectedCandidate, user]);

  const handleDownloadCV = (
    cvUrl: string | undefined,
    candidateName: string
  ) => {
    if (!cvUrl) {
      console.error("CV URL not found");
      return;
    }

    console.log(`CV download request: ${cvUrl}, ${candidateName}`);

    try {
      // Extract file information from CV URL
      // URL format: /storage/cvs/FILENAME or full URL
      const urlParts = cvUrl.split("/");
      const filename = urlParts[urlParts.length - 1];
      let bucket = "cvs";

      // If bucket information exists in URL, use it
      if (urlParts.length > 2) {
        const possibleBucket = urlParts[urlParts.length - 2];
        if (possibleBucket) {
          bucket = possibleBucket;
        }
      }

      console.log(`Bucket: ${bucket}, Filename: ${filename}`);

      // If file name is available, we can download with path
      if (filename && bucket) {
        fileService.downloadFileByPath(bucket, filename);
      } else {
        // Use old method if file name or bucket not found
        downloadPdf(
          cvUrl,
          `${candidateName.toLowerCase().replace(/\s+/g, "_")}_cv.pdf`
        );
      }
    } catch (error) {
      console.error("CV download error:", error);
      // Use old method in case of error
      downloadPdf(
        cvUrl,
        `${candidateName.toLowerCase().replace(/\s+/g, "_")}_cv.pdf`
      );
    }
  };

  const handleSendEmail = (candidate: Candidate) => {
    const subject = "Interview Opportunity";
    const body = `Dear ${candidate.name},\n\nI hope this email finds you well. I would like to discuss a potential job opportunity with you.\n\nBest regards`;

    window.location.href = `mailto:${
      candidate.email
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCandidate) return;

    try {
      // Generate Teams meeting link
      const teamsLink = generateTeamsLink(
        meetingDetails.title,
        meetingDetails.startTime,
        meetingDetails.endTime
      );

      // Create Outlook calendar event
      const subject = encodeURIComponent(meetingDetails.title);
      const body = encodeURIComponent(`
Dear ${selectedCandidate.name},

${meetingDetails.description}

Join Microsoft Teams Meeting:
${teamsLink}

Best regards`);

      const start = encodeURIComponent(
        new Date(meetingDetails.startTime).toISOString()
      );
      const end = encodeURIComponent(
        new Date(meetingDetails.endTime).toISOString()
      );
      const to = encodeURIComponent(selectedCandidate.email);

      // Open Teams meeting link in new tab
      window.open(teamsLink, "_blank");

      // Create Outlook calendar event
      const outlookUrl = `ms-outlook://calendar/new?subject=${subject}&body=${body}&startdt=${start}&enddt=${end}&to=${to}&location=Microsoft Teams Meeting`;
      window.location.href = outlookUrl;

      // Reset form and close modal
      setIsMeetingModalOpen(false);
      setMeetingDetails({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
      });
      setSelectedCandidate(null);
    } catch (err) {
      console.error("Error scheduling meeting:", err);
      setError("Error scheduling meeting");
    }
  };

  const openEditModal = useCallback((candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCandidateForm({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      skills: candidate.skills.join(", "),
      experience: candidate.experience.toString(),
      rating: candidate.rating.toString(),
      sector: candidate.sector as Sector,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    async (candidateId: string, newStatus: CandidateStatus) => {
      try {
        const response = await candidatesService.updateCandidateStatus(
          candidateId,
          newStatus
        );
        const updatedCandidate = response.data.data;

        setCandidates((prev) =>
          prev.map((c) => (c.id === candidateId ? updatedCandidate : c))
        );
      } catch (err) {
        console.error("Error updating status:", err);
        setError("Error updating status");
      }
    },
    []
  );

  // Önizleme modalını açmak için fonksiyon
  const handleOpenPreview = (cvUrl: string, candidateName: string) => {
    if (!cvUrl) {
      console.error("CV URL not found");
      return;
    }

    console.log("Opening preview modal for:", cvUrl);
    setSelectedPdfUrl(cvUrl);
    setSelectedPdfName(candidateName);
    setIsPdfPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Candidates</h2>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as CandidateStatus | "all")
            }
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-900 focus:border-red-500 focus:outline-none focus:ring-red-500"
          >
            <option value="all">All Statuses</option>
            {Object.entries(CANDIDATE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Button
          className="flex items-center gap-2 bg-red-800 hover:bg-red-900"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Candidate
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sector
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                CV
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {candidate.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Experience: {candidate.experience} years
                      </div>
                      <div className="text-sm text-gray-500">
                        <StarRating value={candidate.rating} readOnly />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{candidate.email}</div>
                  <div className="text-sm text-gray-500">{candidate.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {candidate.sector}
                  </div>
                  <div className="text-sm text-gray-500">
                    {candidate.skills.join(", ")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={candidate.status}
                    onChange={(e) =>
                      handleStatusChange(
                        candidate.id!,
                        e.target.value as CandidateStatus
                      )
                    }
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      CANDIDATE_STATUS_COLORS[candidate.status]
                    }`}
                  >
                    {Object.entries(CANDIDATE_STATUS_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.cv_url ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleOpenPreview(candidate.cv_url!, candidate.name)
                        }
                        className="text-blue-600 hover:text-blue-900"
                        title="CV Önizleme"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleDownloadCV(candidate.cv_url, candidate.name)
                        }
                        className="text-green-600 hover:text-green-900"
                        title="CV İndir"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No CV</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSendEmail(candidate)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Send Email"
                    >
                      <Mail className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setMeetingDetails({
                          title: `Interview with ${candidate.name}`,
                          description: `Interview meeting with ${candidate.name}`,
                          startTime: "",
                          endTime: "",
                        });
                        setIsMeetingModalOpen(true);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                      title="Schedule Teams Meeting"
                    >
                      <Video className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openEditModal(candidate)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          resetForm();
        }}
        title={isEditModalOpen ? "Edit Candidate" : "Add New Candidate"}
      >
        <form
          onSubmit={isEditModalOpen ? handleEdit : handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-red-700">
              Full Name
            </label>
            <input
              type="text"
              required
              value={candidateForm.name}
              onChange={(e) =>
                setCandidateForm({ ...candidateForm, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700">
              Email
            </label>
            <input
              type="email"
              required
              value={candidateForm.email}
              onChange={(e) =>
                setCandidateForm({ ...candidateForm, email: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700">
              Phone
            </label>
            <input
              type="tel"
              required
              value={candidateForm.phone}
              onChange={(e) =>
                setCandidateForm({ ...candidateForm, phone: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              required
              value={candidateForm.skills}
              onChange={(e) =>
                setCandidateForm({ ...candidateForm, skills: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700">
              Years of Experience
            </label>
            <input
              type="number"
              required
              min="0"
              max="50"
              value={candidateForm.experience}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  experience: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700">
              Rating
            </label>
            <div className="mt-1 flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={candidateForm.rating}
                onChange={(e) =>
                  setCandidateForm({ ...candidateForm, rating: e.target.value })
                }
                className="w-full"
              />
              <StarRating value={parseInt(candidateForm.rating)} readOnly />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700">
              Sector
            </label>
            <select
              required
              value={candidateForm.sector}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  sector: e.target.value as Sector,
                })
              }
              className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 text-red-900 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            >
              {SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              CV (PDF)
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{ "application/pdf": [".pdf"] }}
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-red-600">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isEditModalOpen && !selectedFile}>
              {isEditModalOpen ? "Save Changes" : "Add Candidate"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Candidate"
      >
        <div className="space-y-4">
          <p className="text-red-700">
            Are you sure you want to delete {selectedCandidate?.name}? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Meeting Modal */}
      <Modal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        title="Schedule Interview"
      >
        <form onSubmit={handleScheduleMeeting} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-red-700">
              Meeting Title
            </label>
            <input
              type="text"
              required
              value={meetingDetails.title}
              onChange={(e) =>
                setMeetingDetails({ ...meetingDetails, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={meetingDetails.description}
              onChange={(e) =>
                setMeetingDetails({
                  ...meetingDetails,
                  description: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700">
              Start Time
            </label>
            <input
              type="datetime-local"
              required
              value={meetingDetails.startTime}
              onChange={(e) =>
                setMeetingDetails({
                  ...meetingDetails,
                  startTime: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700">
              End Time
            </label>
            <input
              type="datetime-local"
              required
              value={meetingDetails.endTime}
              onChange={(e) =>
                setMeetingDetails({
                  ...meetingDetails,
                  endTime: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-400 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMeetingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Schedule Meeting</Button>
          </div>
        </form>
      </Modal>

      {/* PDF Önizleme Modal */}
      <Modal
  isOpen={isPdfPreviewOpen}
  onClose={() => setIsPdfPreviewOpen(false)}
  title={`${selectedPdfName} - CV Önizleme`}
  size="lg"
>
  <div className="h-[70vh] w-full">
    {pdfBlobUrl ? (
      <iframe
        src={pdfBlobUrl}
        className="w-full h-full"
        title="CV Önizleme"
      />
    ) : (
      <div className="flex items-center justify-center h-full text-gray-500">
        Yükleniyor...
      </div>
    )}
  </div>
  <div className="mt-4 flex justify-end">
    <Button
      onClick={() =>
        pdfBlobUrl &&
        handleDownloadCV(selectedPdfUrl!, selectedPdfName)
      }
      className="bg-red-600 hover:bg-red-700"
    >
      <Download className="h-4 w-4 mr-2" />
      İndir
    </Button>
  </div>
</Modal>

    </div>
  );
}


