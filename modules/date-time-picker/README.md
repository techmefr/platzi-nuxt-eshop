# DateTimePicker Module

Module réutilisable et framework-agnostic pour la gestion des dates et heures, avec validation, formatage et support des fuseaux horaires.

## Installation

```bash
pnpm add @reportit/date-time-picker
```

## Fonctionnalités

- Sélection de date simple ou plage de dates
- Support date + heure (datetime)
- Validation avec min/max dates
- Formatage personnalisable
- Support des fuseaux horaires
- Correction automatique des dates invalides
- Support des locales date-fns

## Utilisation

### Configuration de base
```typescript
import { useDateTimePicker } from '@reportit/date-time-picker'

const {
  selectedDate,
  selectedTime,
  formattedValue,
  isoValue,
  isValid,
  error,
  setDate,
  setTime,
  validate,
  reset
} = useDateTimePicker({
  mode: 'single',
  dateTimeMode: 'date',
  format: 'dd/MM/yyyy',
  minDate: new Date(),
  autoCorrect: true
})
```

### Modes disponibles

#### Date simple
```typescript
const picker = useDateTimePicker({
  mode: 'single',
  dateTimeMode: 'date'
})

picker.setDate(new Date())
console.log(picker.formattedValue.value) // "23/12/2024"
```

#### Date et heure
```typescript
const picker = useDateTimePicker({
  mode: 'single',
  dateTimeMode: 'datetime',
  format: 'dd/MM/yyyy HH:mm'
})

picker.setDate(new Date())
picker.setTime('14:30')
```

#### Plage de dates
```typescript
const picker = useDateTimePicker({
  mode: 'range'
})

picker.setDateRange({
  start: new Date('2024-01-01'),
  end: new Date('2024-01-31')
})
```

### Validation
```typescript
const picker = useDateTimePicker({
  minDate: new Date('2024-01-01'),
  maxDate: new Date('2024-12-31'),
  autoCorrect: false
})

picker.setDate(new Date('2023-06-15'))
console.log(picker.error.value) // { type: 'before_min', message: '...' }
```

### Fuseaux horaires
```typescript
const picker = useDateTimePicker({
  timezone: 'Europe/Paris'
})

picker.setDate(new Date())
const utc = picker.toUTC()
const local = picker.toLocal()
```

## Options de configuration

```typescript
interface DateTimePickerOptions {
  mode?: 'single' | 'range'
  dateTimeMode?: 'date' | 'datetime' | 'time'
  format?: string
  minDate?: Date
  maxDate?: Date
  defaultToNow?: boolean
  autoCorrect?: boolean
  timezone?: string
  locale?: Locale
}
```

## Architecture

Le module est construit avec :

- `DateTimeState` : Gestion de l'état réactif
- `DateTimeFormatter` : Formatage et parsing des dates
- `DateTimeValidator` : Validation des dates
- `BaseDateTimePicker` : Orchestration des modules

### Utilitaires

```typescript
import { formatDate, parseDate, toISO, toUTC, toLocalDate } from '@reportit/date-time-picker/utils/format'
import { isValidDate, isDateInRange, validateDateTime } from '@reportit/date-time-picker/utils/validation'
```

## Méthodes disponibles

### État (ComputedRef)
- `selectedDate` : Date sélectionnée
- `selectedTime` : Heure sélectionnée
- `dateRange` : Plage de dates
- `mode` : Mode actuel
- `dateTimeMode` : Type (date/datetime/time)
- `error` : Erreur de validation
- `isValid` : Validité
- `formattedValue` : Valeur formatée
- `isoValue` : Valeur ISO

### Actions
- `setDate(date)` : Définir la date
- `setTime(time)` : Définir l'heure
- `setDateRange(range)` : Définir la plage
- `setMinDate(date)` / `setMaxDate(date)` : Limites
- `setTimezone(tz)` : Fuseau horaire
- `setLocale(locale)` : Locale
- `setFormat(format)` : Format
- `toUTC()` / `toLocal()` : Conversions
- `validate()` : Valider
- `reset()` / `clear()` : Réinitialiser
