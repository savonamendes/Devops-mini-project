// Helper utility functions for the discussion components
export const getInitials = (name?: string | null): string => {
  if (!name) return "??";
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
