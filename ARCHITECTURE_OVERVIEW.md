# Refactoring Architecture Overview

## Project Structure
```
src/features/appointments/
├── components/
│   └── cell-action.tsx (refactored component - 129 lines)
├── hooks/
│   ├── use-appointment-print.ts (PDF generation state)
│   ├── use-appointment-delete.ts (Delete state management)
│   └── index.ts
└── utils/
    ├── constants.ts (Magic strings & config)
    ├── formatters.ts (Pure formatting functions)
    ├── pdf-styles.ts (PDF styling & config)
    ├── pdf-generator.ts (PDF generation logic)
    ├── document-templates.ts (HTML template builders)
    └── index.ts
```

## Data Flow Diagram

```
CellAction Component
    │
    ├─→ useAppointmentPrint()
    │   │
    │   └─→ handlePrint(appointmentId, type)
    │       │
    │       ├─→ getAppointmentDetails() [server action]
    │       │
    │       ├─→ generateOPDTemplate() or generateInvoiceTemplate()
    │       │   │
    │       │   ├─→ formatters (formatFullName, formatCurrency, etc.)
    │       │   └─→ document-templates (HTML generation)
    │       │
    │       ├─→ generatePdfFromHtml()
    │       │   │
    │       │   ├─→ pdf-styles (CSS)
    │       │   ├─→ HTML2Canvas
    │       │   └─→ jsPDF
    │       │
    │       └─→ downloadPdf()
    │
    └─→ useAppointmentDelete()
        │
        └─→ handleConfirmDelete(appointmentId)
            │
            ├─→ deleteAppointment() [server action]
            └─→ router.refresh()
```

## Separation of Concerns

### UI Layer (cell-action.tsx)
- Dropdown menu rendering
- Button states and interactions
- Alert modal display
- Route navigation

### Business Logic Layer (hooks)
- State management
- API orchestration
- Error handling
- User notifications

### Utility Layer
- **Constants**: Configuration values
- **Formatters**: Pure data transformation
- **PDF Generation**: Document creation
- **Templates**: HTML generation
- **PDF Styles**: Visual styling

## Key Design Patterns

### 1. Custom Hooks Pattern
```tsx
const { handlePrint, isGeneratingPDF } = useAppointmentPrint();
const { deleteOpen, setDeleteOpen, loading, handleConfirmDelete } = useAppointmentDelete();
```

### 2. Pure Functions Pattern
```tsx
const formatted = formatMedicineTimings(timings);
const total = calculateTotal(items);
```

### 3. Template Composition Pattern
```tsx
const html = generateOPDTemplate(appointment);
const pdf = await generatePdfFromHtml(html, watermarkUrl);
```

## Code Reduction

| Category | Before | After | Change |
|----------|--------|-------|--------|
| Component | 605 lines | 129 lines | -78% |
| Max function | 250+ lines | 40 lines | -84% |
| Imports | 7 | 4 | Cleaner |
| Global functions | 2 | 0 | All modular |
| Type safety | `any` | Strong | 100% |

## Testing Strategy

### Unit Tests (Easy to write now)
- `formatMedicineTimings()` - Pure function
- `formatCurrency()` - Pure function
- `calculateTotal()` - Pure function

### Integration Tests
- `useAppointmentPrint()` hook
- `useAppointmentDelete()` hook

### E2E Tests
- Full appointment PDF download flow
- Appointment deletion flow

## Performance Considerations

1. **Tree Shaking**: Only import what you need
   ```tsx
   import { formatCurrency } from '@/features/appointments/utils';
   ```

2. **Lazy Loading**: PDF generation only when needed

3. **Code Splitting**: Utilities can be bundled separately

4. **Memoization**: Hooks support useCallback for optimization

## Future Enhancements

1. Add email delivery of PDF documents
2. Export to multiple formats (Word, Excel)
3. Template customization per clinic
4. Batch PDF generation
5. Document archiving/history
