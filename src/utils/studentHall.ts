export const needsHallConfirmation = (student: any) => !!student?.id && !student.affiliateEditedAt && (!!student.originalHallId || student.semesterNum === 1);
export const hallConfirmationPath = (student: any) => `/aisp/profile/${encodeURIComponent(student.id)}/edit`;
