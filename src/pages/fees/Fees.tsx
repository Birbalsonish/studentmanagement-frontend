import { useState, useEffect, useMemo } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageFeeDetails from "@/components/fees/fees-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DollarSign, CheckCircle, AlertCircle, Filter, Search, Eye, Download } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Fee } from "@/lib/types";
import { feeService } from "@/lib/api";
import NepaliDate from 'nepali-date-converter';

export default function Fees() {
  const [isManage, setIsManage] = useState(false);
  const [fees, setFees] = useState<Fee[]>([]);
  const [filteredFees, setFilteredFees] = useState<Fee[]>([]);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedFeeType, setSelectedFeeType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Preview modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Fetch fees on mount
  useEffect(() => {
    fetchFees();
  }, []);

  // Filter fees when filters change
  useEffect(() => {
    filterFees();
  }, [fees, selectedFeeType, selectedStatus, searchTerm]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await feeService.getAll();
      const data = response.data.data;

      if (data.data) {
        setFees(data.data);
      } else {
        setFees(Array.isArray(data) ? data : []);
      }

      setError("");
    } catch (err: any) {
      console.error("Error fetching fees:", err);
      setError(err.response?.data?.message || "Failed to fetch fees");
      alert("Failed to load fee records");
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  const filterFees = () => {
    let filtered = [...fees];

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((fee) => {
        const studentName = fee.student?.name?.toLowerCase() || "";
        const feeType = fee.fee_type?.toLowerCase() || "";
        const academicYear = fee.academic_year?.toLowerCase() || "";
        
        return (
          studentName.includes(search) ||
          feeType.includes(search) ||
          academicYear.includes(search)
        );
      });
    }

    // Filter by fee type
    if (selectedFeeType !== "all") {
      filtered = filtered.filter((fee) => fee.fee_type === selectedFeeType);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((fee) => fee.status === selectedStatus);
    }

    setFilteredFees(filtered);
  };

  const handleEdit = (fee: Fee) => {
    setSelectedFee(fee);
    setIsManage(true);
  };

  const handleDelete = async (fee: Fee) => {
    if (!confirm(`Are you sure you want to delete this fee record?`)) return;

    try {
      await feeService.delete(fee.id);
      alert("Fee record deleted successfully");
      fetchFees();
    } catch (err: any) {
      console.error("Error deleting fee:", err);
      alert(err.response?.data?.message || "Failed to delete fee record");
    }
  };

  const handleAddNew = () => {
    setSelectedFee(null);
    setIsManage(true);
  };

  const handleSuccess = () => {
    fetchFees();
  };

  const handleClearFilters = () => {
    setSelectedFeeType("all");
    setSelectedStatus("all");
    setSearchTerm("");
  };

  const handlePreviewReceipt = async (feeId: number) => {
    try {
      setLoadingPreview(true);
      setIsPreviewOpen(true);
      
      const token = localStorage.getItem('token');
      
      // Use preview endpoint that returns HTML
      const url = `http://localhost:8000/api/fees/${feeId}/receipt/preview?token=${token}`;
      setPreviewUrl(url);
      
    } catch (error) {
      console.error('Error previewing receipt:', error);
      alert('Failed to preview receipt. Please try again.');
      setIsPreviewOpen(false);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownloadReceipt = async (feeId: number) => {
    try {
      setDownloadingPdf(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8000/api/fees/${feeId}/receipt`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate receipt');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fee-receipt-${feeId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      const fee = fees.find(f => f.id === feeId);
      if (fee) {
        alert(`Receipt downloaded successfully for ${fee.student?.name || 'student'}!`);
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadFromPreview = () => {
    if (selectedFee) {
      handleDownloadReceipt(selectedFee.id);
    }
  };

  const handlePrintFromPreview = () => {
    const iframe = document.getElementById('receipt-preview-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewUrl("");
    setSelectedFee(null);
  };

  // Get unique fee types from data
  const feeTypes = useMemo(() => {
    const types = new Set(fees.map((fee) => fee.fee_type));
    return Array.from(types);
  }, [fees]);

  // Calculate statistics from filtered fees
  const stats = useMemo(() => {
    if (filteredFees.length === 0) {
      return {
        totalAmount: 0,
        totalPaid: 0,
        totalDue: 0,
      };
    }

    const totalAmount = filteredFees.reduce((sum, f) => sum + Number(f.amount || 0), 0);
    const totalPaid = filteredFees.reduce((sum, f) => sum + Number(f.paid_amount || 0), 0);
    const totalDue = filteredFees.reduce((sum, f) => sum + Number(f.pending_amount || 0), 0);

    return {
      totalAmount,
      totalPaid,
      totalDue,
    };
  }, [filteredFees]);

  // Table columns with preview button
  const columns = useMemo<ColumnDef<Fee>[]>(
    () => [
      {
        id: "student_name",
        accessorKey: "student.name",
        header: "Student Name",
        cell: ({ row }) => row.original.student?.name || "N/A",
      },
      {
        id: "fee_type",
        accessorKey: "fee_type",
        header: "Fee Type",
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: "Total Amount",
        cell: ({ getValue }) => `Rs. ${Number(getValue()).toFixed(2)}`,
      },
      {
        id: "paid_amount",
        accessorKey: "paid_amount",
        header: "Paid",
        cell: ({ getValue }) => `Rs. ${Number(getValue()).toFixed(2)}`,
      },
      {
        id: "pending_amount",
        accessorKey: "pending_amount",
        header: "Pending",
        cell: ({ getValue }) => `Rs. ${Number(getValue()).toFixed(2)}`,
      },
      {
        id: "due_date",
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ getValue }) => {
          try {
            const englishDate = getValue() as string;
            const date = new Date(englishDate);
            const nepaliDate = new NepaliDate(date);
            
            return (
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {nepaliDate.format('YYYY-MM-DD')} BS
                </span>
                <span className="text-xs text-muted-foreground">
                  {date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            );
          } catch (error) {
            console.error('Error converting date:', error);
            return getValue() as string;
          }
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === "Paid"
                  ? "bg-green-100 text-green-800"
                  : status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "Partial"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Receipt",
        cell: ({ row }) => {
          const fee = row.original;
          const canViewReceipt = Number(fee.paid_amount) > 0;
          
          return (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFee(fee);
                  handlePreviewReceipt(fee.id);
                }}
                disabled={!canViewReceipt}
                title={!canViewReceipt ? "No payment made yet" : "View Receipt"}
                className={`${
                  !canViewReceipt 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  if (error && !loading) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={fetchFees} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Fees</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={handleAddNew}
            >
              <DollarSign className="w-5 h-5" />
              Add Fee Record
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name, fee type, or academic year..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span>Filters:</span>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fee Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fee Type</label>
                    <Select value={selectedFeeType} onValueChange={setSelectedFeeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Fee Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Fee Types</SelectItem>
                        {feeTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Partial">Partial</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(selectedFeeType !== "all" || selectedStatus !== "all" || searchTerm) && (
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Active Filters Display */}
              {(selectedFeeType !== "all" || selectedStatus !== "all" || searchTerm) && (
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Search: {searchTerm}
                    </span>
                  )}
                  {selectedFeeType !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Fee Type: {selectedFeeType}
                    </span>
                  )}
                  {selectedStatus !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Status: {selectedStatus}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Amount"
            value={`Rs. ${stats.totalAmount.toFixed(2)}`}
            icon={DollarSign}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Paid Amount"
            value={`Rs. ${stats.totalPaid.toFixed(2)}`}
            icon={CheckCircle}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Pending Amount"
            value={`Rs. ${stats.totalDue.toFixed(2)}`}
            icon={AlertCircle}
            color="bg-red-500/70 text-white"
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredFees.length} of {fees.length} fee records
        </div>

        {/* Fees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading fee records...</p>
                </div>
              </div>
            ) : (
              <GenericTable
                data={filteredFees}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={[]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Manage Fee Modal */}
      <ManageFeeDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        fee={selectedFee}
        onSuccess={handleSuccess}
      />

      {/* Receipt Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Fee Receipt Preview</DialogTitle>
            <DialogDescription>
              {selectedFee && `Receipt for ${selectedFee.student?.name || 'Student'} - ${selectedFee.fee_type}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden rounded-lg border">
            {loadingPreview ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading receipt...</p>
                </div>
              </div>
            ) : (
              <iframe
                id="receipt-preview-iframe"
                src={previewUrl}
                className="w-full h-full"
                title="Receipt Preview"
              />
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleClosePreview}
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handlePrintFromPreview}
              disabled={loadingPreview}
            >
              🖨️ Print
            </Button>
            <Button
              onClick={handleDownloadFromPreview}
              disabled={loadingPreview || downloadingPdf}
            >
              {downloadingPdf ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// StatCard Component
interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: string;
}

function StatCard({ title, value, icon: Icon, color = "bg-white" }: StatCardProps) {
  return (
    <Card className={`rounded-lg shadow-lg p-0 overflow-hidden ${color}`}>
      <div className="flex items-center justify-between p-6 h-full">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white/20">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
