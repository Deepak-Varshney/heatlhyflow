"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface UsersAutoFiltersProps {
  searchParams: {
    search?: string;
    role?: string;
    verificationStatus?: string;
  };
}

export function UsersAutoFilters({ searchParams }: UsersAutoFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const limit = currentParams.get("limit") || "10";

  const [search, setSearch] = useState(searchParams.search ?? "");
  const [role, setRole] = useState(searchParams.role ?? "ALL");
  const [verificationStatus, setVerificationStatus] = useState(searchParams.verificationStatus ?? "ALL");

  useEffect(() => {
    setSearch(searchParams.search ?? "");
    setRole(searchParams.role ?? "ALL");
    setVerificationStatus(searchParams.verificationStatus ?? "ALL");
  }, [searchParams.search, searchParams.role, searchParams.verificationStatus]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams(currentParams.toString());

    params.set("page", "1");
    params.set("limit", limit);

    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    if (role && role !== "ALL") {
      params.set("role", role);
    } else {
      params.delete("role");
    }

    if (verificationStatus && verificationStatus !== "ALL") {
      params.set("verificationStatus", verificationStatus);
    } else {
      params.delete("verificationStatus");
    }

    return params.toString();
  }, [currentParams, limit, role, search, verificationStatus]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      const currentUrl = currentParams.toString() ? `${pathname}?${currentParams.toString()}` : pathname;

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentParams, pathname, queryString, router]);

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="DOCTOR">Doctor</SelectItem>
            <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
            <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
            <SelectItem value="DEVIL">🔥 DEVIL 🔥</SelectItem>
            <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
          </SelectContent>
        </Select>

        <Select value={verificationStatus} onValueChange={setVerificationStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/superadmin/users">Reset</Link>
        </Button>
      </div>
    </div>
  );
}
