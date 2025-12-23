# DateTime Define Module

Module avec l'API `defineDate`, `defineDatetime` et `defineDateRange` pour créer des instances de sélecteurs de dates réutilisables et enregistrées globalement.

## Installation

```bash
pnpm add @reportit/datetime-define
```

## Fonctionnalités

- `defineDate` : Crée un composable réutilisable pour sélection de date
- `defineDatetime` : Crée un composable pour date + heure
- `defineDateRange` : Crée un composable pour plage de dates
- Registry global pour partager les instances entre composants
- Utilitaires de formatage et validation inclus

## Utilisation

### defineDate
```typescript
import { defineDate } from '@reportit/datetime-define'

// Définir le picker une fois
export const useBirthDatePicker = defineDate('birthdate', {
  format: 'dd/MM/yyyy',
  maxDate: new Date(),
  autoCorrect: true
})

// Utiliser dans n'importe quel composant
const { selectedDate, setDate, formattedValue, isValid } = useBirthDatePicker()
```

### defineDatetime
```typescript
import { defineDatetime } from '@reportit/datetime-define'

export const useAppointmentPicker = defineDatetime('appointment', {
  format: 'dd/MM/yyyy HH:mm',
  minDate: new Date(),
  timezone: 'Europe/Paris'
})

const { selectedDate, selectedTime, setDate, setTime, isoValue } = useAppointmentPicker()
```

### defineDateRange
```typescript
import { defineDateRange } from '@reportit/datetime-define'

export const useReportPeriod = defineDateRange('report-period', {
  format: 'dd/MM/yyyy',
  defaultToNow: false
})

const { dateRange, setDateRange, isValid } = useReportPeriod()

setDateRange({
  start: new Date('2024-01-01'),
  end: new Date('2024-12-31')
})
```

## Utilitaires de formatage

```typescript
import {
  formatDate,
  parseDate,
  toISO,
  toUTC,
  toLocalDate,
  combineDateTime,
  extractTime
} from '@reportit/datetime-define'

// Formater une date
const formatted = formatDate(new Date(), 'dd/MM/yyyy')

// Parser une chaîne
const date = parseDate('23/12/2024', 'dd/MM/yyyy')

// Convertir en ISO
const iso = toISO(new Date()) // "2024-12-23T00:00:00.000Z"

// Combiner date et heure
const datetime = combineDateTime(date, '14:30')
```

## Utilitaires de validation

```typescript
import {
  isValidDate,
  isDateInRange,
  isRangeValid,
  validateDateTime,
  validateRange,
  correctDate
} from '@reportit/datetime-define'

// Vérifier validité
if (isValidDate(date)) {
  // ...
}

// Vérifier si dans une plage
if (isDateInRange(date, minDate, maxDate)) {
  // ...
}

// Corriger automatiquement
const corrected = correctDate(date, minDate, maxDate)
```

## Registry

```typescript
import { hasDateTime, clearDateTimeRegistry } from '@reportit/datetime-define'

// Vérifier si un picker existe
if (hasDateTime('birthdate')) {
  // ...
}

// Nettoyer le registry (utile pour les tests)
clearDateTimeRegistry()
```

## Types exportés

```typescript
export type {
  DateRange,
  DatePickerMode,
  DateTimeMode,
  DateTimeError,
  BaseDateOptions,
  DateOptions,
  DatetimeOptions,
  DateRangeOptions
} from './types'
```
