// components/PatientCombobox.tsx

"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PatientRegistrationDialog from "./PatientRegistration";
import { IPatient } from "@/models/Patient";


interface PatientComboboxProps {
  patients: IPatient[];
  selectedPatient: IPatient | null;
  onSelectPatient: (patient: IPatient | null) => void;
}

export function PatientCombobox({
  patients,
  selectedPatient,
  onSelectPatient,
}: PatientComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedPatient
            ? `${selectedPatient.firstName} ${selectedPatient.lastName} - ${selectedPatient.phoneNumber}`
            : "Select patient..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search patient by name or phone..." />
          <CommandList>
            {/* This part shows up if the search returns no results */}
            <CommandEmpty className="py-4 px-2 text-center text-sm">
              <p className="mb-2">No patient found.</p>
              {/* Here we embed your "Add New" patient dialog */}
              <PatientRegistrationDialog />
            </CommandEmpty>

            <CommandGroup>
              {patients.map((patient) => (
                <CommandItem
                  key={patient._id} // Use a unique ID for the key
                  value={`${patient.firstName} ${patient.lastName} ${patient.phoneNumber}`}
                  onSelect={() => {
                    onSelectPatient(patient);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedPatient?._id === patient._id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {`${patient.firstName} ${patient.lastName}`}
                  <span className="text-xs opacity-60 ml-auto">
                    {patient.phoneNumber}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}