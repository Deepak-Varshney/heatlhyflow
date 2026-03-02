'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrganization, updateOrganizationStatus, createOrganizationAsSuperadmin } from "@/actions/superadmin-actions";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Search, ChevronDown, Plus } from 'lucide-react';

interface IOrganization {
  _id: string;
  name: string;
  owner: {
    firstName: string;
    lastName: string;
    clerkUserId: string;
  };
  status: 'ACTIVE' | 'DISABLED' | 'REJECTED';
  createdAt: string;
  email?: string;
  phone?: string;
  members: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    specialty?: string;
  }>;
}

const ToggleStatusForm = ({ orgId, currentStatus, clerkUserId }: {
  orgId: string,
  currentStatus: "ACTIVE" | "DISABLED",
  clerkUserId: string,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
  
  const handleToggle = () => {
    startTransition(async () => {
      await updateOrganizationStatus(orgId, newStatus, clerkUserId);
      router.refresh();
    });
  };
  
  return (
    <Button 
      onClick={handleToggle}
      disabled={isPending}
      size="sm"
      variant={newStatus === "ACTIVE" ? "default" : "destructive"}
      className="text-xs"
    >
      {isPending ? "..." : (newStatus === "ACTIVE" ? "Enable" : "Disable")}
    </Button>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    ACTIVE: 'default',
    DISABLED: 'secondary',
    REJECTED: 'destructive',
  } as const;
  
  return (
    <Badge variant={variants[status as keyof typeof variants] || 'default'}>
      {status}
    </Badge>
  );
};

const ClinicDetailsModal = ({ clinic, isOpen, onClose }: { clinic: IOrganization | null; isOpen: boolean; onClose: () => void }) => {
  if (!clinic) return null;

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      DOCTOR: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      RECEPTIONIST: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      UNASSIGNED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-full overflow-scroll">
        <DialogHeader>
          <DialogTitle>Clinic Details</DialogTitle>
          <DialogDescription>
            Complete information about {clinic.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Clinic Information */}
          <div className="grid gap-3">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Clinic Name</h3>
              <p className="text-lg font-medium">{clinic.name}</p>
            </div>
          </div>

          {/* Owner Information */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Owner Information</h3>
            <div className="grid gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{clinic.owner.firstName} {clinic.owner.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clerk User ID</p>
                <p className="font-mono text-sm">{clinic.owner.clerkUserId}</p>
              </div>
            </div>
          </div>

          {/* Status & Dates */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Status & Timeline</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Current Status</p>
                <div className="mt-1">
                  <StatusBadge status={clinic.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created On</p>
                <p className="font-medium">{new Date(clinic.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {(clinic.email || clinic.phone) && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Contact Information</h3>
              <div className="grid gap-3">
                {clinic.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{clinic.email}</p>
                  </div>
                )}
                {clinic.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{clinic.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Organization Members */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Team Members ({clinic.members.length})
            </h3>
            {clinic.members.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No team members yet</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Specialty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clinic.members.map((member) => (
                      <TableRow key={member._id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">
                            {member.firstName} {member.lastName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {member.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {member.specialty || '-'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ClinicActionsMenu = ({ clinic, onViewDetails }: { clinic: IOrganization; onViewDetails: (clinic: IOrganization) => void }) => {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(`Delete clinic "${clinic.name}"? This cannot be undone.`);
    if (!confirmed) return;

    startDeleteTransition(async () => {
      const result = await deleteOrganization(clinic._id);
      if (!result.success) {
        alert(result.error || "Failed to delete clinic");
        return;
      }
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onViewDetails(clinic)}>View Details</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Edit clinic feature coming soon')}>
          Edit Information
        </DropdownMenuItem>
        {clinic.status !== 'REJECTED' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {clinic.status === 'ACTIVE' ? 'Disable Clinic' : 'Enable Clinic'}
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Clinic'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CreateClinicDialog = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Organization fields
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState<"CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE" | "NURSING_HOME">("CLINIC");
  
  // Owner/Doctor fields
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerSpecialty, setOwnerSpecialty] = useState("");
  const [ownerExperience, setOwnerExperience] = useState("");
  
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateClinic = () => {
    setError(null);
    setMessage(null);

    // Validation
    if (!organizationName.trim()) {
      setError("Clinic name is required");
      return;
    }
    if (!ownerFirstName.trim() || !ownerLastName.trim()) {
      setError("Owner's first and last name are required");
      return;
    }
    if (!ownerEmail.trim()) {
      setError("Owner's email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!ownerPhone.trim()) {
      setError("Owner's phone number is required");
      return;
    }

    startTransition(async () => {
      const result = await createOrganizationAsSuperadmin({
        name: organizationName,
        type: organizationType,
        ownerDetails: {
          firstName: ownerFirstName,
          lastName: ownerLastName,
          email: ownerEmail,
          phone: ownerPhone,
          specialty: ownerSpecialty || undefined,
          yearsOfExperience: ownerExperience ? parseInt(ownerExperience) : undefined,
        },
      });

      if (!result.success) {
        setError(result.error || "Failed to create clinic");
        return;
      }

      // Reset form
      setOrganizationName("");
      setOwnerFirstName("");
      setOwnerLastName("");
      setOwnerEmail("");
      setOwnerPhone("");
      setOwnerSpecialty("");
      setOwnerExperience("");
      
      setMessage(result.message || "Clinic created successfully");
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
        router.refresh();
      }, 1500);
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" /> Create Clinic
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Clinic & Owner</DialogTitle>
            <DialogDescription>
              Create a new clinic and set up the owner/doctor account in one step.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Clinic Information */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">1</span>
                Clinic Information
              </h3>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="clinicName">Clinic Name *</Label>
                  <Input
                    id="clinicName"
                    placeholder="e.g., City Medical Center"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="clinicType">Organization Type *</Label>
                  <Select value={organizationType} onValueChange={(value: any) => setOrganizationType(value)} disabled={isPending}>
                    <SelectTrigger id="clinicType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLINIC">Clinic</SelectItem>
                      <SelectItem value="HOSPITAL">Hospital</SelectItem>
                      <SelectItem value="PRIVATE_PRACTICE">Private Practice</SelectItem>
                      <SelectItem value="NURSING_HOME">Nursing Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Owner/Doctor Information */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">2</span>
                Owner/Doctor Details
              </h3>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={ownerFirstName}
                      onChange={(e) => setOwnerFirstName(e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={ownerLastName}
                      onChange={(e) => setOwnerLastName(e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@example.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+1 234 567 8900"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="specialty">Specialty (Optional)</Label>
                    <Input
                      id="specialty"
                      placeholder="e.g., Cardiology"
                      value={ownerSpecialty}
                      onChange={(e) => setOwnerSpecialty(e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="experience">Years of Experience (Optional)</Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="10"
                      min="0"
                      value={ownerExperience}
                      onChange={(e) => setOwnerExperience(e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {message && (
              <div className="rounded-lg bg-green-50 dark:bg-green-950 p-3 text-sm text-green-800 dark:text-green-200">
                {message}
              </div>
            )}
            
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3 text-sm text-red-800 dark:text-red-200">
                {error}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateClinic} disabled={isPending}>
              {isPending ? "Creating..." : "Create Clinic"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const ManageClinicsPageContent = ({ allOrgs }: { allOrgs: IOrganization[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DISABLED' | 'REJECTED'>('ALL');
  const [selectedClinic, setSelectedClinic] = useState<IOrganization | null>(null);

  // Filter clinics based on search and status
  const filteredClinics = useMemo(() => {
    return allOrgs.filter((clinic) => {
      const matchesSearch = 
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${clinic.owner.firstName} ${clinic.owner.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || clinic.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, allOrgs]);

  const stats = {
    total: allOrgs.length,
    active: allOrgs.filter(c => c.status === 'ACTIVE').length,
    disabled: allOrgs.filter(c => c.status === 'DISABLED').length,
    rejected: allOrgs.filter(c => c.status === 'REJECTED').length,
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Clinics</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage all clinics on the platform. Control their status and access.
          </p>
        </div>
        <div className="shrink-0">
          <CreateClinicDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Clinics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All clinics</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">Operational clinics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Disabled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.disabled}</div>
            <p className="text-xs text-muted-foreground mt-1">Suspended clinics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground mt-1">Rejected clinics</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search clinics by name or owner..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Status: {statusFilter} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('ALL')}>
                  All Clinics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('ACTIVE')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('DISABLED')}>
                  Disabled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('REJECTED')}>
                  Rejected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filteredClinics.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {filteredClinics.length} of {allOrgs.length} clinics
            </p>
          )}
        </CardHeader>

        <CardContent>
          {filteredClinics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No clinics found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Clinic Name</TableHead>
                    <TableHead className="font-semibold">Owner</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClinics.map((clinic) => (
                    <TableRow key={clinic._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{clinic.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {clinic.owner.firstName} {clinic.owner.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={clinic.status} />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(clinic.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {clinic.status !== 'REJECTED' && clinic.owner.clerkUserId !== 'N/A' && (
                            <ToggleStatusForm 
                              orgId={clinic._id} 
                              currentStatus={clinic.status as "ACTIVE" | "DISABLED"}
                              clerkUserId={clinic.owner.clerkUserId}
                            />
                          )}
                          <ClinicActionsMenu clinic={clinic} onViewDetails={setSelectedClinic} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ClinicDetailsModal 
        clinic={selectedClinic} 
        isOpen={!!selectedClinic} 
        onClose={() => setSelectedClinic(null)} 
      />
    </div>
  );
};
