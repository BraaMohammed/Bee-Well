// Helper function to validate and filter available tools based on settings
export function getAvailableTools(dataAccess: { notes: boolean; habits: boolean; journal: boolean }) {
  const availableTools = [];
  
  if (dataAccess.notes) {
    availableTools.push('getUserNotes', 'getUserLabels');
  }
  
  if (dataAccess.journal) {
    availableTools.push('getJournalEntries');
  }
  
  // TODO: Add habit tools when implemented
  if (dataAccess.habits) {
    // availableTools.push('getHabitData', 'getHabitTemplates');
  }
  
  return availableTools;
}