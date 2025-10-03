"use client";
import { useState, useEffect } from "react";
import { format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { IPatient } from "@/models/Patient";
import { IAvailability } from "@/models/Availability"; // Import the availability type
import { getAvailableSlots } from "@/actions/availability-actions"; // Import our new server action
import { DoctorCombobox } from "./doctor-combobox";
import { PatientCombobox } from "./patient-combobox";
import { bookAppointment } from "@/actions/appointment-actions";
import { IUser } from "@/models/User";
export default function AppointmentBooking({
    patients,
    doctors,
}: {
    patients: IPatient[];
    doctors: IUser[];
}) {
    const [open, setOpen] = useState(false);

    // Form State
    const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<IUser | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<IAvailability | null>(null);

    // Data & UI State
    const [availableSlots, setAvailableSlots] = useState<IAvailability[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Effect to fetch slots when doctor or date changes
    useEffect(() => {
        // Reset if doctor or date is not selected
        if (!selectedDoctor || !selectedDate) {
            setAvailableSlots([]);
            setSelectedSlot(null); // Also reset the selected slot
            return;
        }

        const fetchSlots = async () => {
            setIsLoadingSlots(true);
            setSelectedSlot(null); // Reset selection when fetching new slots
            try {
                const slots = await getAvailableSlots(selectedDoctor._id, selectedDate);
                setAvailableSlots(slots);
            } catch (error) {
                toast.error("Failed to fetch time slots.");
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [selectedDoctor, selectedDate]); // Dependency array

    // Appointment form submission handler
    // Update the handleSubmit function
    const handleSubmit = async () => {
        if (!selectedPatient || !selectedDoctor || !selectedDate || !selectedSlot) {
            toast.error("Please select all fields.");
            return;
        }

        // You might want to add a loading state here
        const result = await bookAppointment
            ({
                patientId: selectedPatient._id,
                doctorId: selectedDoctor._id,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime,
                // reason: "Optional reason from another form field"
            });

        if (result.success) {
            toast.success(
                `Appointment booked for ${selectedPatient.firstName} with Dr. ${selectedDoctor.lastName}!`
            );

            // Reset state after booking
            setSelectedPatient(null);
            setSelectedDoctor(null);
            setSelectedDate(new Date());
            setSelectedSlot(null);
            setOpen(false);
        } else {
            toast.error(result.error);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Book Appointment</Button>
                </DialogTrigger>

                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Book an Appointment</DialogTitle>
                        <DialogDescription>
                            Select a patient, doctor, date, and time to complete the booking.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 pt-4">
                        {/* Step 1: Select Patient */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Patient</label>
                            <PatientCombobox
                                patients={patients}
                                selectedPatient={selectedPatient}
                                onSelectPatient={setSelectedPatient}
                            />
                        </div>

                        {/* Step 2: Select Doctor */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Doctor</label>
                            <DoctorCombobox
                                doctors={doctors}
                                selectedDoctor={selectedDoctor}
                                onSelectDoctor={setSelectedDoctor}
                            />
                        </div>

                        {/* Step 3: Select Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !selectedDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        disabled={(date) => date < startOfDay(new Date())} // Disable past dates
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Step 4: Select Time Slot (Now Dynamic) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Time Slot</label>
                            <div className="grid grid-cols-3 gap-2">
                                {isLoadingSlots ? (
                                    <p className="col-span-3 text-center">Loading slots...</p>
                                ) : availableSlots.length > 0 ? (
                                    availableSlots.map((slot) => (
                                        <Button
                                            key={slot._id}
                                            variant={selectedSlot?._id === slot._id ? "default" : "outline"}
                                            onClick={() => setSelectedSlot(slot)}
                                        >
                                            {format(new Date(slot.startTime), "p")} {/* e.g., 9:00 AM */}
                                        </Button>
                                    ))
                                ) : (
                                    <p className="col-span-3 text-center">No available slots for this day.</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            className="w-full mt-4"
                            disabled={!selectedPatient || !selectedDoctor || !selectedSlot}
                        >
                            Book Appointment
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}