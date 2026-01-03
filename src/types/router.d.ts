import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string
    auth?: boolean

    // Add more custom meta fields as needed
    [key: string]: any; // Allow other custom properties
  }
}
