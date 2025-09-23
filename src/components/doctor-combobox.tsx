// components/DoctorCombobox.tsx

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
import { IDoctor } from "@/models/Doctor";
import DoctorRegistrationDialog from "./doctor-registration";

interface DoctorComboboxProps {
  doctors: IDoctor[];
  selectedDoctor: IDoctor | null;
  onSelectDoctor: (doctor: IDoctor | null) => void;
}

export function DoctorCombobox({
  doctors,
  selectedDoctor,
  onSelectDoctor,
}: DoctorComboboxProps) {
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
          {selectedDoctor
            ? `${selectedDoctor.firstName} ${selectedDoctor.lastName} - ${selectedDoctor.specialization}`
            : "Select doctor..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search doctor by name or specialization..." />
          <CommandList>
            <CommandEmpty className="py-4 px-2 text-center text-sm">
                <p className="mb-2">No doctor found.</p>
                {/* Embed your "Add New Doctor" dialog here */}
                <DoctorRegistrationDialog />
            </CommandEmpty>
            <CommandGroup>
              {doctors.map((doctor) => (
                <CommandItem
                  key={doctor._id}
                  value={`${doctor.firstName} ${doctor.lastName} ${doctor.specialization}`}
                  onSelect={() => {
                    onSelectDoctor(doctor);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedDoctor?._id === doctor._id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div>
                    <p>{`${doctor.firstName} ${doctor.lastName}`}</p>
                    <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}