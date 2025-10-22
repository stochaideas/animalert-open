import { SmsService } from "~/server/api/modules/sms/sms.service";
import {
  type GeofenceMatch,
  UatGeofenceService,
} from "~/server/services/geofencing/uat-geofence.service";

export type ValidationTier = "Tier 1" | "Tier 2" | "Tier 3";

const VALIDATION_DESCRIPTIONS: Record<ValidationTier, string> = {
  "Tier 1": "Tier 1 - detectie automata (AI & GPS)",
  "Tier 2": "Tier 2 - validare locala umana",
  "Tier 3": "Tier 3 - confirmare institutionala",
};

export type BearSightingPayload = {
  id: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  occurredAt?: string | null;
  accuracy?: string | null;
  validationTier?: ValidationTier;
  provider?: string | null;
};

const truncateMessage = (value: string) =>
  value.length <= 160 ? value : `${value.slice(0, 157)}...`;

const formatDistance = (match: GeofenceMatch | null) => {
  if (!match) return "fara date";
  if (match.withinFence) {
    return "in aria UAT";
  }
  return `aproape (${match.distanceKm.toFixed(1)} km)`;
};

export class BearAlertNotificationService {
  private readonly smsService: SmsService;
  private readonly geofenceService: UatGeofenceService;
  private readonly sentNotifications = new Set<string>();

  constructor(
    smsService = new SmsService(),
    geofenceService = new UatGeofenceService(),
  ) {
    this.smsService = smsService;
    this.geofenceService = geofenceService;
  }

  async notify(payload: BearSightingPayload, options?: { force?: boolean }) {
    if (!payload.id) {
      throw new Error("Bear sighting payload requires an id");
    }

    if (!options?.force && this.sentNotifications.has(payload.id)) {
      return { skipped: true } as const;
    }

    if (
      typeof payload.latitude !== "number" ||
      Number.isNaN(payload.latitude) ||
      typeof payload.longitude !== "number" ||
      Number.isNaN(payload.longitude)
    ) {
      throw new Error("Bear sighting requires valid latitude and longitude");
    }

    const match = this.geofenceService.resolve(
      payload.latitude,
      payload.longitude,
    );

    const validationTier = payload.validationTier ?? "Tier 1";
    const validationLabel = VALIDATION_DESCRIPTIONS[validationTier];

    const baseMessage = truncateMessage(
      [
        `ALERTA URS - ${match?.geofence.displayName ?? "UAT necunoscut"}`,
        `Loc: ${payload.latitude.toFixed(4)}, ${payload.longitude.toFixed(4)}`,
        payload.accuracy ? `Precizie: ${payload.accuracy}` : null,
        `Validare: ${validationLabel}`,
        `Status: ${formatDistance(match)}`,
        payload.description ? `Descriere: ${payload.description}` : null,
        payload.provider ? `Sursa: ${payload.provider}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
    );

    const contacts = match?.geofence.contacts ?? [];

    const results = await Promise.all(
      contacts.map(async (contact) => {
        const message = truncateMessage(
          `[${contact.role}] ${baseMessage}`,
        );

        await this.smsService.sendSms({
          phoneNumber: contact.phone,
          message,
        });

        return {
          contact: contact.role,
          phone: contact.phone,
        };
      }),
    );

    this.sentNotifications.add(payload.id);

    return {
      notifiedContacts: results,
      geofence: match?.geofence.id ?? null,
      validationTier,
      baseMessage,
    } as const;
  }
}
