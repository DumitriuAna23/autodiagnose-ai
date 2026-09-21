export function clearDiagnosticDraft() {
  localStorage.removeItem(
    "diagnosticVehicle"
  );

  localStorage.removeItem(
    "diagnosticSymptoms"
  );

  localStorage.removeItem(
    "diagnosticDtcCodes"
  );

  localStorage.removeItem(
    "diagnosticAnswers"
  );

  localStorage.removeItem(
    "diagnosticCaseId"
  );
}