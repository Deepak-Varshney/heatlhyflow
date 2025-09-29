// // models/Availability.ts

// import { Schema, model, models, Document } from "mongoose";

// export interface IAvailability extends Document {
//   doctor: Schema.Types.ObjectId;
//   startTime: Date;
//   endTime: Date;
//   status: 'available' | 'booked';
//   _id: Schema.Types.ObjectId|any;
// }

// const AvailabilitySchema = new Schema<IAvailability>(
//   {
//     doctor: {
//       type: Schema.Types.ObjectId,
//       ref: 'Doctor', // Reference to the Doctor model
//       required: true,
//     },
//     startTime: {
//       type: Date,
//       required: true,
//     },
//     endTime: {
//       type: Date,
//       required: true,
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: ['available', 'booked'], // The status can only be one of these two values
//       default: 'available',
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // This compound index is crucial for performance.
// // It allows you to quickly find all available slots for a specific doctor on a given day.
// AvailabilitySchema.index({ doctor: 1, startTime: 1, status: 1 });

// const Availability = models.Availability || model<IAvailability>("Availability", AvailabilitySchema);

// export default Availability;

import { Schema, model, models, Document } from "mongoose";

export interface IAvailability extends Document {
  doctor: Schema.Types.ObjectId; // This will reference a User document
  startTime: Date;
  endTime: Date;
  status: 'available' | 'booked';
  _id: Schema.Types.ObjectId | any;
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User', // THE FIX: Changed from 'Doctor' to 'User'
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'booked'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

AvailabilitySchema.index({ doctor: 1, startTime: 1, status: 1 });

const Availability = models.Availability || model<IAvailability>("Availability", AvailabilitySchema);

export default Availability;
