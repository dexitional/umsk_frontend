export const needsHallConfirmation = (student: any) => !!student?.id && !student.affiliateEditedAt;
export const hallConfirmationPath = (student: any) => `/aisp/profile/${encodeURIComponent(student.id)}/edit`;
