import type { TMenuItem } from 'src/types'

export const mainMenuItems: TMenuItem[] = [
  { route: '/', label: 'dashboard', icon: 'mdi-view-dashboard' },
  { label: 'booking', icon: 'mdi-room-service',
    active: true,
    items: [
      { label: 'cars', icon: 'mdi-car-clock' }
    ]
  },
  { label: 'resources', icon: 'mdi-clipboard-list-outline',
    active: true,
    items: [
      { label: 'car_calendar', icon: 'mdi-calendar-month-outline' },
      { label: 'clients', icon: 'mdi-account-star' },
      { label: 'cars', icon: 'mdi-car-hatchback' },
      { label: 'fuel_logs', icon: 'mdi-gas-station' },
      { label: 'car_services', icon: 'mdi-format-list-checkbox' },
      { label: 'car_route_prices', icon: 'mdi-routes' },
      { label: 'seasons', icon: 'mdi-calendar-multiselect' },
      { label: 'owners', icon: 'mdi-account-tie-outline' },
      { label: 'blacklist', icon: 'mdi-account-cancel' },
      { label: 'contacts', icon: 'mdi-contacts' },
    ]
  }
]
