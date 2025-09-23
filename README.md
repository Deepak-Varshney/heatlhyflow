# ERP Solution for Healthcare Management

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

## Installation

### Prerequisites

* Node.js (v16+ recommended)
* MongoDB (running locally or via a cloud provider)
* Clerk account for authentication setup

### Clone the Repository

Clone the project from GitHub:

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

### Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### Setup Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```
MONGODB_URI=<your-mongodb-connection-string>
CLERK_FRONTEND_API=<your-clerk-frontend-api-key>
CLERK_API_KEY=<your-clerk-api-key>
```

### Run the Development Server

To run the project locally, use the following command:

```bash
npm run dev
```

This will start the application on [http://localhost:3000](http://localhost:3000).

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

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features you'd like to contribute. Ensure all code adheres to the project's coding standards.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Future Enhancements

* **Multi-Vendor Support**: Later versions will support multiple healthcare vendors, each with its own set of doctors, patients, and appointments.
* **Reporting and Analytics**: Generate detailed reports for doctors and receptionists to track appointments, treatments, and patient histories.
* **Advanced User Roles**: Admin role for managing users and monitoring system activity.