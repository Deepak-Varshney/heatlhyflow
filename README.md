# HealthyFlow
## ERP Solution for Healthcare Management

## Overview

This project is a healthcare management ERP system designed to handle patient registration, appointment booking, doctor treatment, and OPD card generation. The system is tailored for two main user roles:

1. **Receptionist Dashboard**: To manage patient registrations and appointments.
2. **Doctor Dashboard**: To view patient details, prescribe medication, schedule tests, and generate OPD cards.

### Key Features:

* **Patient Registration**: Receptionist can register new patients.
* **Appointment Management**: Receptionist can book appointments for patients and doctors.
* **Doctor Dashboard**:

  * Access patient information.
  * Prescribe medications using a streamlined dropdown-based UI.
  * Add test schedules and medication doses using checkboxes and dropdowns.
  * Finalize the OPD card with a single-click submission.
* **PDF Generation**: Once the doctor finalizes the OPD card, the receptionist can download it as a PDF.
* **Role-based Access Control**: The system supports role-based access where only authorized users (like doctors and receptionists) can perform specific tasks.

---

## Tech Stack

* **Frontend**: Next.js (React.js)
* **Backend**: Node.js, MongoDB 
* **Authentication**: Clerk (for user authentication)
* **UI**: ShadCN UI (UI component library for a seamless user experience)
* **State Management**: React Context API (or Zustand)
* **Styling**: Tailwind CSS (for utility-first styling)

---

## Usage

* **Receptionist** can:

  * Register patients.
  * Book appointments for patients.
  * Download finalized OPD cards.

* **Doctors** can:

  * View patient information.
  * Prescribe medication from a list of available medicines.
  * Schedule tests and doses with dropdowns and checkboxes.
  * Generate OPD card PDFs after completing treatment.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Future Enhancements

* **Multi-Vendor Support**: Later versions will support multiple healthcare vendors, each with its own set of doctors, patients, and appointments.
* **Reporting and Analytics**: Generate detailed reports for doctors and receptionists to track appointments, treatments, and patient histories.
* **Advanced User Roles**: Admin role for managing users and monitoring system activity.