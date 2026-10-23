import toast from 'react-hot-toast';
export function smsSummary(data: any) {
  const result = Array.isArray(data) ? {
    sent: data.filter(r => r?.accepted === true).length,
    failed: data.filter(r => r?.accepted !== true).length,
    invalid: 0, duplicates: 0,
    errors: [...new Set(data.filter(r => !r?.accepted).map(r => r?.message).filter(Boolean))],
  } : data;
  if (!result || !Number.isFinite(result.sent) || !Number.isFinite(result.failed)) throw new Error('No SMS submission result was returned. Check provider reports before retrying.');
  const rejected = result.failed + (result.invalid || 0);
  const message = `${result.sent} SMS accepted by the provider; ${rejected} failed or invalid.${result.duplicates ? ` ${result.duplicates} duplicate numbers skipped.` : ''}${rejected && result.errors?.length ? ' ' + result.errors[0] : ''}`;
  return { message, successful: result.sent > 0 && rejected === 0 };
}
export function notifySmsSummary(data: any) {
  const result = smsSummary(data);
  if (result.successful) toast.success(result.message);
  else toast.error(result.message, { duration: 10000 });
}
export function notifySmsWarning(data: any) {
  if (data?.sms?.accepted === false) toast.error(`The action completed, but the SMS was not confirmed. ${data.sms.message || ''}`, { duration: 10000 });
}
