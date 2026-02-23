'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PatientRegistration from '@/components/PatientRegistration';
import AppointmentBooking from '@/components/appointment-form';

type DashboardActionButtonsProps = {
    patients?: any[];
    doctors?: any[];
};

export default function DashboardActionButtons({ patients = [], doctors = [] }: DashboardActionButtonsProps) {


    return (
        <div className='flex gap-2'>
            <PatientRegistration />
            <AppointmentBooking patients={patients} doctors={doctors} />
        </div>
    );
}
