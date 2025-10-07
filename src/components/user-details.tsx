'use client'
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getUserById, updateUser, deleteUser, permanentlyDeleteUser } from "@/actions/superadmin-actions";
import { ArrowLeft, Edit, Trash2, UserCheck, UserX, Calendar, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

// User Edit Form Component
function UserEditForm({ user, onClose }: { user: any; onClose: () => void }) {
    async function handleSubmit(formData: FormData) {
        const data = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            role: formData.get("role") as any,
            specialty: formData.get("specialty") as string,
            experience: parseInt(formData.get("experience") as string) || 0,
            description: formData.get("description") as string,
            verificationStatus: formData.get("verificationStatus") as any,
        };

        await updateUser(user._id, data);
        onClose();
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input name="firstName" defaultValue={user.firstName} required />
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input name="lastName" defaultValue={user.lastName} required />
                </div>
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" defaultValue={user.email} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" defaultValue={user.role}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                            <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                            <SelectItem value="DOCTOR">Doctor</SelectItem>
                            <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="verificationStatus">Verification Status</Label>
                    <Select name="verificationStatus" defaultValue={user.verificationStatus}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="VERIFIED">Verified</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {user.role === "DOCTOR" && (
                <>
                    <div>
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input name="specialty" defaultValue={user.specialty || ""} />
                    </div>
                    <div>
                        <Label htmlFor="experience">Experience (years)</Label>
                        <Input name="experience" type="number" defaultValue={user.experience || 0} />
                    </div>
                </>
            )}

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" defaultValue={user.description || ""} rows={4} />
            </div>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">Update User</Button>
            </div>
        </form>
    );
}

export default function UserDetailPage({ user }: { user: any }) {

    if (!user) {
        notFound();
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "VERIFIED": return "bg-green-100 text-green-800 border-green-200";
            case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "SUPERADMIN": return "bg-purple-100 text-purple-800 border-purple-200";
            case "DOCTOR": return "bg-blue-100 text-blue-800 border-blue-200";
            case "RECEPTIONIST": return "bg-green-100 text-green-800 border-green-200";
            case "UNASSIGNED": return "bg-gray-100 text-gray-800 border-gray-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/superadmin/users">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Users
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(user.verificationStatus)} border`}>
                        {user.verificationStatus}
                    </Badge>
                    <Badge className={`${getRoleColor(user.role)} border`}>
                        {user.role}
                    </Badge>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Edit User Details</DialogTitle>
                            </DialogHeader>
                            <UserEditForm user={user} onClose={() => window.location.reload()} />
                        </DialogContent>
                    </Dialog>

                    {user.role !== "SUPERADMIN" && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete {user.firstName} {user.lastName}?
                                        This action cannot be undone and will remove the user from both the database and Clerk.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => permanentlyDeleteUser(user._id)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete Permanently
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                                    <p className="text-lg">{user.firstName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                                    <p className="text-lg">{user.lastName}</p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                <p className="text-lg flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                                    <Badge className={`${getRoleColor(user.role)} border mt-1`}>
                                        {user.role}
                                    </Badge>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Verification Status</Label>
                                    <Badge className={`${getStatusColor(user.verificationStatus)} border mt-1`}>
                                        {user.verificationStatus}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Joined Date</Label>
                                <p className="text-lg flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Information (for Doctors) */}
                    {user.role === "DOCTOR" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Professional Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user.specialty && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Specialty</Label>
                                        <p className="text-lg">{user.specialty}</p>
                                    </div>
                                )}

                                {user.experience && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Experience</Label>
                                        <p className="text-lg">{user.experience} years</p>
                                    </div>
                                )}

                                {user.description && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                        <p className="text-lg">{user.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Organization Information */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.organization ? (
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Organization Name</Label>
                                        <p className="text-lg font-medium">{user.organization.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                        <Badge
                                            className={
                                                user.organization.status === "ACTIVE"
                                                    ? "bg-green-100 text-green-800 border-green-200"
                                                    : user.organization.status === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                        : "bg-red-100 text-red-800 border-red-200"
                                            }
                                        >
                                            {user.organization.status}
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No organization assigned</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => updateUser(user._id, { verificationStatus: "VERIFIED" })}
                            >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Verify User
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => updateUser(user._id, { verificationStatus: "PENDING" })}
                            >
                                <UserX className="h-4 w-4 mr-2" />
                                Mark as Pending
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => updateUser(user._id, { verificationStatus: "REJECTED" })}
                            >
                                <UserX className="h-4 w-4 mr-2" />
                                Reject User
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
