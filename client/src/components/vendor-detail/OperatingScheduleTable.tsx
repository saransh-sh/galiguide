import React from 'react';
import { Calendar } from 'lucide-react';
import { Vendor } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface OperatingScheduleTableProps {
  vendor: Vendor;
}

export const OperatingScheduleTable: React.FC<OperatingScheduleTableProps> = ({ vendor }) => {
  const { t } = useLanguage();

  if (!vendor.operatingHours || vendor.operatingHours.length === 0) return null;

  const daysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-base text-aubergine flex items-center gap-2">
          <Calendar className="w-4 h-4 text-marigold-700" />
          <span>{t('drawer.scheduleTitle')} (IST)</span>
        </h3>
        <span className="text-[11px] text-on-surface-variant font-semibold">Asia/Kolkata</span>
      </div>

      <div className="bg-white rounded-xl border border-icesilver-300 overflow-hidden shadow-street-sm">
        {daysOrder.map((dayKey) => {
          const schedule = vendor.operatingHours?.find((h) => h.dayOfWeek === dayKey);
          const isToday = vendor.operatingHoursToday?.dayOfWeek === dayKey;

          return (
            <div
              key={dayKey}
              className={`flex items-center justify-between px-3.5 py-2 text-xs border-b border-icesilver-200 last:border-b-0 ${
                isToday ? 'bg-marigold-50 font-bold' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                {isToday && <span className="w-2 h-2 rounded-full bg-marigold-600" />}
                <span className={isToday ? 'text-aubergine font-black' : 'text-on-surface'}>
                  {t(`day.${dayKey}`)}
                </span>
              </span>

              {schedule?.isClosed ? (
                <span className="text-on-surface-variant/60 font-medium">{t('card.closed')}</span>
              ) : (
                <span className="text-on-surface-variant font-bold">
                  {schedule?.openTime} – {schedule?.closeTime}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
